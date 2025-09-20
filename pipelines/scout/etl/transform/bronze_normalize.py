"""
Bronze layer normalization for Scout ETL Pipeline
Clean and standardize raw data from multiple sources
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.io import normalize_columns, clean_dataframe, infer_datatypes
from ..common.util import clean_column_names, detect_column_types, calculate_data_quality_score

def to_bronze(raw_data: Dict[str, pd.DataFrame], run: ETLRun) -> Dict[str, pd.DataFrame]:
    """Transform raw data to bronze layer"""
    start_time = pd.Timestamp.now()
    bronze_data = {}

    try:
        # Process each raw dataset
        for source_name, df in raw_data.items():
            bronze_df = normalize_source_data(df, source_name, run)
            bronze_data[source_name] = bronze_df

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("bronze_normalize", "success",
                    duration_ms=duration_ms,
                    sources_processed=len(bronze_data))

        # Log quality metrics for each bronze table
        for name, df in bronze_data.items():
            quality = calculate_data_quality_score(df)
            run.log_metric(f"bronze_{name}_quality_score", quality["completeness"])
            run.log_metric(f"bronze_{name}_row_count", quality["row_count"])

        return bronze_data

    except Exception as e:
        run.log_error("bronze_normalize", str(e))
        raise

def normalize_source_data(df: pd.DataFrame, source_name: str, run: ETLRun) -> pd.DataFrame:
    """Normalize data from a specific source"""
    if df.empty:
        run.log_step(f"normalize_{source_name}", "skipped", note="Empty dataset")
        return df

    original_count = len(df)
    start_time = pd.Timestamp.now()

    try:
        # Step 1: Clean column names
        original_columns = df.columns.tolist()
        df.columns = clean_column_names(df.columns.tolist())

        # Step 2: Remove completely empty rows and columns
        df = df.dropna(how='all').loc[:, df.notna().any()]

        # Step 3: Data type detection and conversion
        if source_name == "sales":
            df = _normalize_sales_data(df)
        elif source_name == "stores":
            df = _normalize_stores_data(df)
        elif source_name == "devices":
            df = _normalize_devices_data(df)
        else:
            # Generic normalization
            df = _normalize_generic_data(df)

        # Step 4: Add metadata columns
        df = _add_bronze_metadata(df, source_name)

        # Step 5: Data quality validation
        final_count = len(df)
        quality_score = calculate_data_quality_score(df)

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step(f"normalize_{source_name}", "success",
                    duration_ms=duration_ms,
                    rows_in=original_count,
                    rows_out=final_count,
                    quality_score=round(quality_score["completeness"], 3))

        return df

    except Exception as e:
        run.log_error(f"normalize_{source_name}", str(e))
        raise

def _normalize_sales_data(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize sales/interactions data"""
    # Expected columns mapping
    column_mapping = {
        'interactionid': 'interaction_id',
        'transactionid': 'transaction_id',
        'storeid': 'store_id',
        'deviceid': 'device_id',
        'productid': 'product_id',
        'customerid': 'customer_id',
        'transactiondate': 'transaction_date',
        'transactiontime': 'transaction_time',
        'transactiontimestamp': 'transaction_timestamp',
        'quantity': 'quantity',
        'qty': 'quantity',
        'unitprice': 'unit_price',
        'totalamount': 'total_amount',
        'total_price': 'total_amount',
        'paymentmethod': 'payment_method',
        'category': 'category',
        'brand': 'brand',
        'productname': 'product_name',
        'product': 'product_name',
        'sku': 'sku'
    }

    # Apply column mapping
    df = df.rename(columns=column_mapping)

    # Data type conversions
    numeric_columns = ['quantity', 'unit_price', 'total_amount', 'store_id', 'device_id']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Date/time conversions
    date_columns = ['transaction_date', 'transaction_timestamp']
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')

    # String cleaning
    string_columns = ['brand', 'category', 'product_name', 'payment_method', 'sku']
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.upper()
            df[col] = df[col].replace(['NAN', 'NONE', ''], np.nan)

    return df

def _normalize_stores_data(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize stores data"""
    column_mapping = {
        'storeid': 'store_id',
        'storename': 'store_name',
        'storetype': 'store_type',
        'region': 'region',
        'province': 'province',
        'city': 'city',
        'barangay': 'barangay',
        'address': 'address',
        'latitude': 'latitude',
        'longitude': 'longitude',
        'opendate': 'open_date',
        'status': 'status',
        'managername': 'manager_name',
        'contactinfo': 'contact_info'
    }

    df = df.rename(columns=column_mapping)

    # Numeric conversions
    numeric_columns = ['store_id', 'latitude', 'longitude']
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Date conversions
    if 'open_date' in df.columns:
        df['open_date'] = pd.to_datetime(df['open_date'], errors='coerce')

    # String cleaning
    string_columns = ['store_name', 'store_type', 'region', 'province', 'city', 'status']
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.title()
            df[col] = df[col].replace(['Nan', 'None', ''], np.nan)

    return df

def _normalize_devices_data(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize devices data"""
    column_mapping = {
        'deviceid': 'device_id',
        'devicename': 'device_name',
        'devicetype': 'device_type',
        'storeid': 'store_id',
        'locationinstore': 'location_in_store',
        'installationdate': 'installation_date',
        'status': 'status',
        'lastmaintenance': 'last_maintenance',
        'serialnumber': 'serial_number',
        'firmwareversion': 'firmware_version'
    }

    df = df.rename(columns=column_mapping)

    # Numeric conversions
    if 'store_id' in df.columns:
        df['store_id'] = pd.to_numeric(df['store_id'], errors='coerce')

    # Date conversions
    date_columns = ['installation_date', 'last_maintenance']
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')

    # String cleaning
    string_columns = ['device_name', 'device_type', 'status', 'location_in_store']
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.title()
            df[col] = df[col].replace(['Nan', 'None', ''], np.nan)

    return df

def _normalize_generic_data(df: pd.DataFrame) -> pd.DataFrame:
    """Generic normalization for unknown data sources"""
    # Detect and convert data types
    type_mapping = detect_column_types(df)

    for col, dtype in type_mapping.items():
        if col not in df.columns:
            continue

        try:
            if dtype == "integer":
                df[col] = pd.to_numeric(df[col], errors='coerce').astype('Int64')
            elif dtype == "float":
                df[col] = pd.to_numeric(df[col], errors='coerce')
            elif dtype == "datetime":
                df[col] = pd.to_datetime(df[col], errors='coerce')
            elif dtype == "boolean":
                df[col] = df[col].astype(str).str.lower().map({
                    'true': True, 'false': False, '1': True, '0': False,
                    'yes': True, 'no': False
                })
            # String columns keep as-is but clean
            else:
                df[col] = df[col].astype(str).str.strip()
                df[col] = df[col].replace(['nan', 'None', ''], np.nan)

        except Exception as e:
            print(f"⚠️ Failed to convert column {col} to {dtype}: {e}")

    return df

def _add_bronze_metadata(df: pd.DataFrame, source_name: str) -> pd.DataFrame:
    """Add metadata columns to bronze data"""
    df = df.copy()

    # Add bronze layer metadata
    df['_bronze_source'] = source_name
    df['_bronze_loaded_at'] = pd.Timestamp.now()
    df['_bronze_row_id'] = range(1, len(df) + 1)

    # Add data quality indicators
    df['_bronze_null_count'] = df.isnull().sum(axis=1)
    df['_bronze_completeness'] = 1 - (df['_bronze_null_count'] / (len(df.columns) - 4))  # Exclude metadata cols

    return df

def validate_bronze_data(bronze_data: Dict[str, pd.DataFrame], run: ETLRun) -> bool:
    """Validate bronze layer data quality"""
    validation_passed = True

    for source_name, df in bronze_data.items():
        if df.empty:
            run.log_error(f"bronze_validation_{source_name}", "Empty dataset")
            validation_passed = False
            continue

        # Check for required metadata columns
        required_metadata = ['_bronze_source', '_bronze_loaded_at', '_bronze_row_id']
        missing_metadata = [col for col in required_metadata if col not in df.columns]

        if missing_metadata:
            run.log_error(f"bronze_validation_{source_name}",
                         f"Missing metadata columns: {missing_metadata}")
            validation_passed = False

        # Check data quality thresholds
        quality = calculate_data_quality_score(df)
        if quality["completeness"] < 0.7:  # 70% completeness threshold
            run.log_error(f"bronze_validation_{source_name}",
                         f"Low data quality: {quality['completeness']:.2%} completeness")
            validation_passed = False

        # Log validation results
        run.log_metric(f"bronze_{source_name}_validation_passed", validation_passed)

    return validation_passed