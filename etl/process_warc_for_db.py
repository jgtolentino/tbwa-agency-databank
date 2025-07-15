#!/usr/bin/env python3
"""
Process merged WARC data for database insertion
Flattens nested JSON structures and prepares SQL inserts
"""

import json
import datetime
from pathlib import Path
from typing import Dict, Any, List

def extract_nested_value(data: Dict, path: str, default: Any = None) -> Any:
    """Extract value from nested dict using dot notation path"""
    keys = path.split('.')
    current = data
    
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return default
    
    return current

def flatten_warc_case(case: Dict[str, Any]) -> Dict[str, Any]:
    """Flatten a single WARC case for database insertion"""
    flattened = {
        'case_id': case.get('case_id'),
        
        # Campaign identification
        'campaign_name': extract_nested_value(case, 'campaign_identification.campaign_name'),
        'brand': extract_nested_value(case, 'campaign_identification.brand'),
        'parent_company': extract_nested_value(case, 'campaign_identification.parent_company'),
        'publication_year': extract_nested_value(case, 'campaign_identification.publication_year'),
        'warc_source': extract_nested_value(case, 'campaign_identification.warc_source'),
        'industry_sector': extract_nested_value(case, 'campaign_identification.industry_sector'),
        'sub_category': extract_nested_value(case, 'campaign_identification.sub_category'),
        
        # Market context
        'primary_market': extract_nested_value(case, 'market_context.primary_market'),
        'market_type': extract_nested_value(case, 'market_context.market_type'),
        'target_audience': extract_nested_value(case, 'market_context.target_audience'),
        
        # Business context
        'primary_challenge': extract_nested_value(case, 'business_challenge.primary_challenge'),
        'market_situation': extract_nested_value(case, 'business_challenge.market_situation'),
        'competitive_context': extract_nested_value(case, 'business_challenge.competitive_context'),
        'primary_objective': extract_nested_value(case, 'campaign_objectives.primary_objective'),
        
        # Campaign strategy
        'strategic_approach': extract_nested_value(case, 'campaign_strategy.strategic_approach'),
        'key_insight': extract_nested_value(case, 'campaign_strategy.key_insight'),
        'creative_concept': extract_nested_value(case, 'creative_execution.creative_concept'),
        
        # Execution details
        'media_mix': extract_nested_value(case, 'media_execution.media_mix', []),
        'channel_strategy': extract_nested_value(case, 'media_execution.channel_strategy'),
        'budget_allocation': extract_nested_value(case, 'media_execution.budget_allocation', {}),
        
        # Performance metrics
        'effectiveness_metrics': extract_nested_value(case, 'performance_metrics', {}),
        'business_results': extract_nested_value(case, 'business_results', {}),
        'performance_lift': extract_nested_value(case, 'performance_lift', {}),
        
        # Cultural and social elements
        'cultural_relevance': extract_nested_value(case, 'cultural_social_elements.cultural_relevance'),
        'social_impact': extract_nested_value(case, 'cultural_social_elements.social_impact'),
        
        # Awards and recognition
        'awards_won': extract_nested_value(case, 'awards_recognition.awards_won', []),
        'recognition_details': extract_nested_value(case, 'awards_recognition', {}),
        
        # Technology
        'technology_used': extract_nested_value(case, 'technology_integration.technology_used', []),
        'innovation_elements': extract_nested_value(case, 'technology_integration.innovation_elements'),
        
        # Metadata
        'warc_file_id': extract_nested_value(case, 'warc_file_id'),
        'extraction_date': extract_nested_value(case, '_loaded_at', datetime.datetime.now().isoformat()),
        'data_quality_score': calculate_data_quality_score(case),
        
        # Store full case data as JSONB for complex queries
        'full_case_data': case
    }
    
    return flattened

def calculate_data_quality_score(case: Dict[str, Any]) -> float:
    """Calculate data quality score based on completeness"""
    required_fields = [
        'campaign_identification.campaign_name',
        'campaign_identification.brand',
        'business_challenge.primary_challenge',
        'performance_metrics'
    ]
    
    score = 0
    for field in required_fields:
        if extract_nested_value(case, field):
            score += 1
    
    return score / len(required_fields)

def process_warc_data(input_file: Path, output_file: Path) -> List[Dict[str, Any]]:
    """Process merged WARC data and prepare for database insertion"""
    
    print(f"📖 Reading merged WARC data from {input_file}")
    with input_file.open('r') as f:
        cases = json.load(f)
    
    print(f"🔄 Processing {len(cases)} WARC cases...")
    
    processed_cases = []
    for case in cases:
        try:
            flattened = flatten_warc_case(case)
            processed_cases.append(flattened)
        except Exception as e:
            print(f"⚠️ Error processing case {case.get('case_id', 'unknown')}: {e}")
            continue
    
    print(f"✅ Successfully processed {len(processed_cases)} cases")
    
    # Save processed data
    with output_file.open('w') as f:
        json.dump(processed_cases, f, indent=2, default=str)
    
    # Generate summary
    print(f"\n📊 Processing Summary:")
    print(f"   Total cases: {len(processed_cases)}")
    print(f"   Brands: {len(set(c['brand'] for c in processed_cases if c['brand']))}")
    print(f"   Years: {sorted(set(c['publication_year'] for c in processed_cases if c['publication_year']))}")
    print(f"   Industries: {len(set(c['industry_sector'] for c in processed_cases if c['industry_sector']))}")
    print(f"   Average quality score: {sum(c['data_quality_score'] for c in processed_cases)/len(processed_cases):.2f}")
    
    return processed_cases

def generate_sql_inserts(processed_cases: List[Dict[str, Any]], output_file: Path):
    """Generate SQL INSERT statements for the processed cases"""
    
    with output_file.open('w') as f:
        f.write("-- WARC Cases SQL Inserts\n")
        f.write(f"-- Generated: {datetime.datetime.now().isoformat()}\n")
        f.write(f"-- Total cases: {len(processed_cases)}\n\n")
        
        for case in processed_cases:
            # Prepare values, handling NULL and special characters
            values = []
            columns = []
            
            for key, value in case.items():
                if key == 'full_case_data':
                    continue  # Skip for now - too complex for simple SQL
                
                columns.append(key)
                
                if value is None:
                    values.append('NULL')
                elif isinstance(value, str):
                    # Escape single quotes
                    escaped = value.replace("'", "''")
                    values.append(f"'{escaped}'")
                elif isinstance(value, (list, dict)):
                    # Convert to JSON string
                    json_str = json.dumps(value).replace("'", "''")
                    values.append(f"'{json_str}'")
                else:
                    values.append(str(value))
            
            # Write INSERT statement
            f.write(f"INSERT INTO creative_ops.warc_cases ({', '.join(columns)}) VALUES ({', '.join(values)}) ON CONFLICT (case_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP;\n")
    
    print(f"📝 SQL inserts written to {output_file}")

def main():
    """Main processing function"""
    input_file = Path("./output/ces_ingest/merged_warc_raw.json")
    processed_file = Path("./output/ces_ingest/processed_warc_cases.json")
    sql_file = Path("./output/ces_ingest/warc_cases_inserts.sql")
    
    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        print("   Run merge_warc_simple.py first")
        return
    
    # Process the data
    processed_cases = process_warc_data(input_file, processed_file)
    
    # Generate SQL inserts
    generate_sql_inserts(processed_cases, sql_file)
    
    print(f"\n🎉 WARC processing complete!")
    print(f"📁 Files created:")
    print(f"   - {processed_file}")
    print(f"   - {sql_file}")

if __name__ == "__main__":
    main()