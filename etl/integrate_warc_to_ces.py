#!/usr/bin/env python3
"""
Complete WARC → CES Integration Script
Orchestrates the full pipeline from raw WARC files to database ingestion
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

def run_command(cmd: str, description: str) -> bool:
    """Run a shell command and return success status"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"   stdout: {e.stdout}")
        print(f"   stderr: {e.stderr}")
        return False

def check_prerequisites():
    """Check if all required files and directories exist"""
    print("🔍 Checking prerequisites...")
    
    required_files = [
        "./output/real_campaigns_extraction/complete_warc_json.json",
        "./output/real_campaigns_extraction/warc_comprehensive_json.json",
        "./etl/merge_warc_simple.py",
        "./etl/process_warc_for_db.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing required files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    
    print("✅ All prerequisites met")
    return True

def run_warc_integration():
    """Run the complete WARC integration pipeline"""
    print("🚀 Starting WARC → CES Integration Pipeline")
    print("=" * 50)
    
    # Check prerequisites
    if not check_prerequisites():
        sys.exit(1)
    
    # Step 1: Merge WARC JSON files
    if not run_command(
        "python3 etl/merge_warc_simple.py --in ./output/real_campaigns_extraction --out ./output/ces_ingest",
        "Merging WARC JSON files"
    ):
        sys.exit(1)
    
    # Step 2: Process data for database insertion
    if not run_command(
        "python3 etl/process_warc_for_db.py",
        "Processing WARC data for database"
    ):
        sys.exit(1)
    
    # Step 3: Generate integration summary
    generate_integration_summary()
    
    print("\n🎉 WARC → CES Integration Complete!")
    print("=" * 50)
    print("Next steps:")
    print("1. Review the generated SQL migration file")
    print("2. Apply the database migration")
    print("3. Run the SQL insert script")
    print("4. Test the CES • JamPacked aliases")

def generate_integration_summary():
    """Generate a summary of the integration results"""
    print("📊 Generating integration summary...")
    
    # Read processed data
    processed_file = Path("./output/ces_ingest/processed_warc_cases.json")
    if not processed_file.exists():
        print("❌ Processed data file not found")
        return
    
    with processed_file.open('r') as f:
        cases = json.load(f)
    
    # Generate summary
    summary = {
        "integration_date": datetime.now().isoformat(),
        "total_cases": len(cases),
        "brands": sorted(list(set(c['brand'] for c in cases if c['brand']))),
        "years": sorted(list(set(c['publication_year'] for c in cases if c['publication_year']))),
        "industries": sorted(list(set(c['industry_sector'] for c in cases if c['industry_sector']))),
        "markets": sorted(list(set(c['primary_market'] for c in cases if c['primary_market']))),
        "quality_scores": [c['data_quality_score'] for c in cases],
        "avg_quality": sum(c['data_quality_score'] for c in cases) / len(cases),
        "files_created": [
            "output/ces_ingest/merged_warc_raw.json",
            "output/ces_ingest/processed_warc_cases.json", 
            "output/ces_ingest/warc_cases_inserts.sql",
            "output/ces_ingest/lineage.json"
        ]
    }
    
    # Save summary
    summary_file = Path("./output/ces_ingest/integration_summary.json")
    with summary_file.open('w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"✅ Integration summary saved to {summary_file}")
    
    # Print key metrics
    print(f"\n📈 Key Metrics:")
    print(f"   Total cases processed: {summary['total_cases']}")
    print(f"   Unique brands: {len(summary['brands'])}")
    print(f"   Year range: {min(summary['years'])} - {max(summary['years'])}")
    print(f"   Industries covered: {len(summary['industries'])}")
    print(f"   Average data quality: {summary['avg_quality']:.2f}")
    
    # Print sample brands
    print(f"\n🏢 Sample Brands:")
    for brand in summary['brands'][:10]:
        print(f"   - {brand}")
    if len(summary['brands']) > 10:
        print(f"   ... and {len(summary['brands']) - 10} more")

if __name__ == "__main__":
    run_warc_integration()