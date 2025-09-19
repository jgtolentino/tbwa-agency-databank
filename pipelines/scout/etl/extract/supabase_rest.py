"""
Supabase REST API data extraction for Scout ETL Pipeline
Used for reference data and incremental loads
"""
import pandas as pd
import requests
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.io import clean_dataframe

def create_supabase_client(use_service_role: bool = False) -> Optional[Client]:
    """Create Supabase client for data extraction"""
    if not cfg.validate_supabase_config(require_service_role=use_service_role):
        print("⚠️ Supabase configuration not available")
        return None

    try:
        if use_service_role and cfg.supabase_service_role:
            supabase = create_client(cfg.supabase_url, cfg.supabase_service_role)
        else:
            supabase = create_client(cfg.supabase_url, cfg.supabase_anon_key)

        # Test connection
        result = supabase.table('scout_gold_transactions_flat').select('count', count='exact').limit(1).execute()

        print(f"✅ Supabase connection established ({'service' if use_service_role else 'anon'} role)")
        return supabase

    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {e}")
        return None

def pull_reference_data(run: ETLRun, table_name: str) -> pd.DataFrame:
    """Extract reference data from Supabase"""
    start_time = pd.Timestamp.now()

    supabase = create_supabase_client()
    if supabase is None:
        run.log_step(f"pull_reference_{table_name}", "skipped",
                    note="Supabase not configured")
        return pd.DataFrame()

    try:
        # Query the table
        result = supabase.table(table_name).select('*').execute()

        if result.data:
            df = pd.DataFrame(result.data)
            df = clean_dataframe(df)

            duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
            run.log_step(f"pull_reference_{table_name}", "success",
                        duration_ms=duration_ms, rows=len(df))
            run.log_metric(f"{table_name}_extracted", len(df))

            return df
        else:
            run.log_step(f"pull_reference_{table_name}", "empty",
                        note="No data found in table")
            return pd.DataFrame()

    except Exception as e:
        run.log_error(f"pull_reference_{table_name}", str(e))
        print(f"❌ Failed to extract {table_name}: {e}")
        return pd.DataFrame()

def pull_existing_transactions(run: ETLRun, limit: int = 10000) -> pd.DataFrame:
    """Pull existing transactions for incremental processing"""
    start_time = pd.Timestamp.now()

    supabase = create_supabase_client()
    if supabase is None:
        run.log_step("pull_existing_transactions", "skipped",
                    note="Supabase not configured")
        return pd.DataFrame()

    try:
        # Query recent transactions
        result = (supabase.table('scout_gold_transactions_flat')
                 .select('transaction_id, transactiondate, total_price, store, brand')
                 .order('transactiondate', desc=True)
                 .limit(limit)
                 .execute())

        if result.data:
            df = pd.DataFrame(result.data)
            df = clean_dataframe(df)

            duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
            run.log_step("pull_existing_transactions", "success",
                        duration_ms=duration_ms, rows=len(df))
            run.log_metric("existing_transactions_extracted", len(df))

            return df
        else:
            run.log_step("pull_existing_transactions", "empty",
                        note="No existing transactions found")
            return pd.DataFrame()

    except Exception as e:
        run.log_error("pull_existing_transactions", str(e))
        print(f"❌ Failed to extract existing transactions: {e}")
        return pd.DataFrame()

def check_data_freshness(run: ETLRun) -> Dict[str, Any]:
    """Check the freshness of data in Supabase tables"""
    supabase = create_supabase_client()
    if supabase is None:
        return {"status": "unavailable", "tables": {}}

    freshness_info = {
        "status": "available",
        "tables": {},
        "checked_at": pd.Timestamp.now().isoformat()
    }

    tables_to_check = [
        'scout_gold_transactions_flat',
        'scout_silver_transactions',
        'scout_bronze_sales_interactions'
    ]

    for table in tables_to_check:
        try:
            # Get latest record timestamp
            result = (supabase.table(table)
                     .select('transactiondate')
                     .order('transactiondate', desc=True)
                     .limit(1)
                     .execute())

            if result.data and result.data[0]:
                latest_date = result.data[0].get('transactiondate')

                # Get total count
                count_result = (supabase.table(table)
                               .select('count', count='exact')
                               .execute())

                total_count = count_result.count if count_result.count else 0

                freshness_info["tables"][table] = {
                    "latest_date": latest_date,
                    "total_records": total_count,
                    "status": "ok"
                }
            else:
                freshness_info["tables"][table] = {
                    "status": "empty"
                }

            run.log_metric(f"{table}_freshness_check", "completed")

        except Exception as e:
            freshness_info["tables"][table] = {
                "status": "error",
                "error": str(e)
            }
            run.log_error(f"freshness_check_{table}", str(e))

    return freshness_info

def get_table_schema(table_name: str) -> Optional[Dict[str, Any]]:
    """Get table schema information from Supabase"""
    supabase = create_supabase_client()
    if supabase is None:
        return None

    try:
        # Query table metadata (this is a simplified version)
        # In production, you might use PostgreSQL information_schema
        result = supabase.table(table_name).select('*').limit(1).execute()

        if result.data and result.data[0]:
            # Extract column information from first row
            sample_row = result.data[0]
            schema_info = {
                "table": table_name,
                "columns": list(sample_row.keys()),
                "column_count": len(sample_row.keys()),
                "sample_data": sample_row
            }
            return schema_info

    except Exception as e:
        print(f"❌ Failed to get schema for {table_name}: {e}")

    return None

def validate_table_exists(table_name: str) -> bool:
    """Validate that a table exists and is accessible"""
    supabase = create_supabase_client()
    if supabase is None:
        return False

    try:
        result = supabase.table(table_name).select('count', count='exact').limit(1).execute()
        return True
    except Exception:
        return False