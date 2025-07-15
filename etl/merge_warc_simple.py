#!/usr/bin/env python3
"""
Simple WARC JSON merger for CES ingestion - no pandas dependency
"""

import argparse, json, hashlib, os, datetime
from pathlib import Path

def sha256_str(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

def load_jsonl_or_json(fp: Path) -> list:
    txt = fp.read_text()
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        return [json.loads(line) for line in txt.splitlines() if line.strip()]

def merge_warc_files(input_folder: Path, output_folder: Path):
    """Merge WARC JSON files and prepare for CES ingestion"""
    output_folder.mkdir(parents=True, exist_ok=True)
    
    files = sorted(input_folder.glob("*warc*.json"))
    if not files:
        raise SystemExit(f"No warc*.json found in {input_folder}")
    
    print(f"🔍 Found {len(files)} WARC files to merge:")
    for f in files:
        print(f"   - {f.name} ({f.stat().st_size} bytes)")
    
    all_cases = []
    lineage = []
    
    for f in files:
        data = load_jsonl_or_json(f)
        file_sha = sha256_str(f.read_text())
        
        # Handle different JSON structures
        if isinstance(data, dict):
            # If it's a dict with case_studies array
            if "case_studies" in data:
                cases = data["case_studies"]
            else:
                # If it's a single case, wrap in array
                cases = [data]
        else:
            # If it's already an array
            cases = data
        
        for case in cases:
            if isinstance(case, dict):
                case = dict(case)
                case["_file_name"] = f.name
                case["_file_sha"] = file_sha
                case["_loaded_at"] = datetime.datetime.utcnow().isoformat() + "Z"
                all_cases.append(case)
        
        lineage.append({
            "source_file": f.name,
            "sha256": file_sha,
            "rows": len(cases),
            "loaded_at": datetime.datetime.utcnow().isoformat() + "Z"
        })
    
    # Generate case_id for each case
    for case in all_cases:
        # Try to create meaningful case_id from nested structures
        existing_id = case.get('case_id')
        if existing_id:
            case["case_id"] = existing_id
            continue
            
        # Look for campaign identification
        campaign_id = case.get('campaign_identification', {})
        title = campaign_id.get('campaign_name', case.get('title', case.get('name', '')))
        brand = campaign_id.get('brand', case.get('brand', case.get('client', '')))
        
        if title and brand:
            case_id = sha256_str(f"{title}_{brand}")
        elif title:
            case_id = sha256_str(str(title))
        else:
            case_id = sha256_str(json.dumps(case, sort_keys=True))
        
        case["case_id"] = case_id
    
    # Remove duplicates based on case_id
    seen_ids = set()
    unique_cases = []
    for case in all_cases:
        if case["case_id"] not in seen_ids:
            seen_ids.add(case["case_id"])
            unique_cases.append(case)
    
    print(f"\n📊 Merge results:")
    print(f"   Total cases: {len(all_cases)}")
    print(f"   Unique cases: {len(unique_cases)}")
    print(f"   Duplicates removed: {len(all_cases) - len(unique_cases)}")
    
    # Save merged raw data
    merged_json = output_folder / "merged_warc_raw.json"
    with merged_json.open("w") as f:
        json.dump(unique_cases, f, indent=2)
    
    # Save lineage
    lineage_json = output_folder / "lineage.json"
    with lineage_json.open("w") as f:
        json.dump(lineage, f, indent=2)
    
    # Create SQL upsert for creative_ops.warc_cases
    if unique_cases:
        sample_case = unique_cases[0]
        # Get columns excluding internal fields
        cols = [k for k in sample_case.keys() if not k.startswith("_")]
        
        sql_file = output_folder / "upsert_warc_cases.sql"
        with sql_file.open("w") as f:
            f.write(f"-- auto-generated {datetime.datetime.utcnow().isoformat()}Z\n")
            f.write(f"-- Total cases to insert: {len(unique_cases)}\n\n")
            
            # Create table schema
            f.write("CREATE TABLE IF NOT EXISTS creative_ops.warc_cases (\n")
            f.write("    case_id VARCHAR(255) PRIMARY KEY,\n")
            for col in cols:
                if col != "case_id":
                    f.write(f"    {col} TEXT,\n")
            f.write("    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n")
            f.write("    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n")
            f.write(");\n\n")
            
            # Insert sample records (first 10)
            f.write("-- Sample upsert statements:\n")
            for i, case in enumerate(unique_cases[:10]):
                values = []
                for col in cols:
                    value = case.get(col, '')
                    if isinstance(value, str):
                        value = value.replace("'", "''")  # Escape quotes
                    values.append(f"'{value}'")
                
                f.write(f"INSERT INTO creative_ops.warc_cases ({', '.join(cols)}) VALUES ({', '.join(values)}) ON CONFLICT (case_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;\n")
                if i >= 9:  # Only show first 10
                    f.write(f"-- ... {len(unique_cases) - 10} more records\n")
                    break
    
    print(f"\n✅ Files created:")
    print(f"   - {merged_json.name} ({len(unique_cases)} cases)")
    print(f"   - {lineage_json.name} ({len(lineage)} sources)")
    print(f"   - {sql_file.name} (SQL upsert)")
    
    return unique_cases, lineage

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", required=True, help="Input folder with WARC JSON files")
    ap.add_argument("--out", required=True, help="Output folder for merged files")
    args = ap.parse_args()
    
    input_folder = Path(args.__dict__["in"])
    output_folder = Path(args.__dict__["out"])
    
    merge_warc_files(input_folder, output_folder)

if __name__ == "__main__":
    main()