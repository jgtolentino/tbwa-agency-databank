#!/usr/bin/env python3
"""
Merge `complete_warc_json.json` + `warc_comprehensive_json.json`
into one canonical file for CES ingestion.

USAGE:
    python etl/merge_warc_json.py \
        --in ./output/real_campaigns_extraction \
        --out ./output/ces_ingest

The script produces:
    • merged_warc_raw.json     (full JSON list; lineage + checksum kept)
    • merged_warc_clean.parquet
    • upsert_warc_cases.sql
"""

import argparse, json, hashlib, os, datetime, uuid, csv
from pathlib import Path

try:
    import pandas as pd        # pyarrow + pandas already in the template's venv
except ImportError:
    print("Installing pandas...")
    os.system("pip install pandas pyarrow")
    import pandas as pd

# ── helpers ──────────────────────────────────────────────────────────────
def sha256_str(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

def load_jsonl_or_json(fp: Path) -> list:
    txt = fp.read_text()
    try:
        return json.loads(txt)                        # normal JSON array
    except json.JSONDecodeError:
        # fallback: JSON-lines
        return [json.loads(line) for line in txt.splitlines() if line.strip()]

# ── main merge ───────────────────────────────────────────────────────────
def merge(inputs: list[Path]) -> tuple[pd.DataFrame, list]:
    rows, lineage = [], []
    for f in inputs:
        data = load_jsonl_or_json(f)
        file_sha = sha256_str(f.read_text())
        for r in data:
            r = dict(r)                       # shallow copy
            r["_file_name"] = f.name
            r["_file_sha"]  = file_sha
            rows.append(r)
        lineage.append(
            dict(source_file=f.name,
                 sha256=file_sha,
                 rows=len(data),
                 loaded_at=datetime.datetime.utcnow().isoformat()+"Z")
        )
    df = pd.json_normalize(rows)

    # -- minimal normalisation --
    df.rename(columns=lambda c: c.strip().lower().replace(" ", "_"),
              inplace=True)

    # pick a primary key (preferring explicit id → else hash of title+brand)
    if "case_id" not in df.columns:
        # Create case_id from available fields
        title_field = None
        brand_field = None
        
        # Look for common title/name fields
        for col in df.columns:
            if 'title' in col.lower() or 'name' in col.lower():
                title_field = col
                break
        
        # Look for brand field
        for col in df.columns:
            if 'brand' in col.lower() or 'client' in col.lower():
                brand_field = col
                break
        
        # Generate case_id
        if title_field and brand_field:
            df["case_id"] = (df[title_field].astype(str) + "_" + df[brand_field].astype(str)).apply(sha256_str)
        elif title_field:
            df["case_id"] = df[title_field].astype(str).apply(sha256_str)
        else:
            # Fallback: use row index
            df["case_id"] = df.index.astype(str).apply(lambda x: sha256_str(f"row_{x}"))

    # drop duplicates (keep first)
    df = df.sort_values("_file_name")              # deterministic
    df = df.drop_duplicates(subset="case_id", keep="first")

    return df, lineage

# ── CLI ───────────────────────────────────────────────────────────────────
def cli():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in",  required=True,
                    help="folder containing the two WARC json files")
    ap.add_argument("--out", required=True,
                    help="output folder for merged artefacts")
    args = ap.parse_args()

    infolder  = Path(args.__dict__["in"])
    outfolder = Path(args.__dict__["out"])
    outfolder.mkdir(parents=True, exist_ok=True)

    files = sorted(infolder.glob("*warc*.json"))
    if not files:
        raise SystemExit(f"No warc*.json found in {infolder}")

    df, lineage = merge(files)

    # 1. full raw JSON dump (for bronze archival)
    merged_json = outfolder / "merged_warc_raw.json"
    merged_json.write_text(json.dumps(df.to_dict(orient="records"),
                                      indent=2))

    # 2. Parquet (binary columnar) for analytics / Dagster-Silver jobs
    parquet_path = outfolder / "merged_warc_clean.parquet"
    df.to_parquet(parquet_path, index=False)

    # 3. SQL upsert for creative_ops.warc_cases
    cols = [c for c in df.columns if not c.startswith("_")]
    placeholders = ", ".join([f":{c}" for c in cols])
    col_list     = ", ".join(cols)
    update_stmt  = ", ".join([f"{c}=EXCLUDED.{c}" for c in cols
                              if c != "case_id"])

    sql_file = outfolder / "upsert_warc_cases.sql"
    with sql_file.open("w") as f:
        f.write(f"-- auto-generated {datetime.datetime.utcnow().isoformat()}Z\n")
        f.write(f"INSERT INTO creative_ops.warc_cases ({col_list})\n"
                f"VALUES ({placeholders})\n"
                f"ON CONFLICT (case_id) DO UPDATE SET {update_stmt};\n")

    # 4. lineage manifest
    lineage_path = outfolder / "manifest.parquet"
    pd.DataFrame(lineage).to_parquet(lineage_path, index=False)

    print("✅ merge done:")
    print(f"   rows kept …… {len(df):,}")
    print(f"   artefacts ……… {merged_json.name}, {parquet_path.name}, "
          f"{sql_file.name}, {lineage_path.name}")
    
    # 5. Preview results
    print(f"\n📊 Preview of merged data:")
    print(f"   Columns: {list(df.columns)}")
    print(f"   Sample case_id: {df['case_id'].iloc[0] if len(df) > 0 else 'N/A'}")
    
    return df, lineage

if __name__ == "__main__":
    cli()