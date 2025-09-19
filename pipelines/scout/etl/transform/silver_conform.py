"""
Silver layer conformance for Scout ETL Pipeline
Apply business rules, data quality, and standardization
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.util import (
    create_surrogate_key, validate_primary_key, validate_foreign_key,
    calculate_data_quality_score
)

def to_silver(bronze_data: Dict[str, pd.DataFrame], run: ETLRun) -> Dict[str, pd.DataFrame]:
    """Transform bronze data to silver layer with business rules"""
    start_time = pd.Timestamp.now()
    silver_data = {}

    try:
        # Process in dependency order: stores -> devices -> sales
        if 'stores' in bronze_data:
            silver_data['stores'] = conform_stores(bronze_data['stores'], run)

        if 'devices' in bronze_data:
            silver_data['devices'] = conform_devices(
                bronze_data['devices'],
                silver_data.get('stores'),
                run
            )

        if 'sales' in bronze_data:
            silver_data['interactions'] = conform_interactions(
                bronze_data['sales'],
                silver_data.get('stores'),
                silver_data.get('devices'),
                run
            )

        # Add derived tables
        if 'interactions' in silver_data:
            silver_data['transactions'] = create_transaction_summary(
                silver_data['interactions'], run
            )

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("silver_conform", "success",
                    duration_ms=duration_ms,
                    tables_created=len(silver_data))

        # Validate silver layer
        validation_passed = validate_silver_data(silver_data, run)
        run.log_metric("silver_validation_passed", validation_passed)

        return silver_data

    except Exception as e:
        run.log_error("silver_conform", str(e))
        raise

def conform_stores(stores_df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Conform stores data to silver layer standards"""
    if stores_df.empty:
        return stores_df

    start_time = pd.Timestamp.now()
    df = stores_df.copy()

    try:
        # Apply business rules
        df = _apply_store_business_rules(df)

        # Create surrogate key
        df['store_key'] = create_surrogate_key(df, ['store_id'])

        # Validate primary key
        pk_valid = validate_primary_key(df, ['store_id'])
        if not pk_valid:
            # Deduplicate if needed
            df = df.drop_duplicates(subset=['store_id'], keep='first')
            run.log_step("conform_stores_dedup", "applied",
                        note="Removed duplicate store records")

        # Add silver metadata
        df = _add_silver_metadata(df, 'stores')

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("conform_stores", "success",
                    duration_ms=duration_ms, rows=len(df))

        return df

    except Exception as e:
        run.log_error("conform_stores", str(e))
        raise

def conform_devices(devices_df: pd.DataFrame,
                   stores_df: Optional[pd.DataFrame],
                   run: ETLRun) -> pd.DataFrame:
    """Conform devices data to silver layer standards"""
    if devices_df.empty:
        return devices_df

    start_time = pd.Timestamp.now()
    df = devices_df.copy()

    try:
        # Apply business rules
        df = _apply_device_business_rules(df)

        # Create surrogate key
        df['device_key'] = create_surrogate_key(df, ['device_id'])

        # Validate foreign key to stores
        if stores_df is not None and not stores_df.empty:
            fk_validation = validate_foreign_key(
                df, 'store_id', stores_df, 'store_id'
            )
            run.log_metric("devices_store_fk_coverage", fk_validation["coverage_pct"])

            if fk_validation["orphan_count"] > 0:
                run.log_step("conform_devices_orphans", "warning",
                            orphan_count=fk_validation["orphan_count"])

        # Validate primary key
        pk_valid = validate_primary_key(df, ['device_id'])
        if not pk_valid:
            df = df.drop_duplicates(subset=['device_id'], keep='first')
            run.log_step("conform_devices_dedup", "applied")

        # Add silver metadata
        df = _add_silver_metadata(df, 'devices')

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("conform_devices", "success",
                    duration_ms=duration_ms, rows=len(df))

        return df

    except Exception as e:
        run.log_error("conform_devices", str(e))
        raise

def conform_interactions(interactions_df: pd.DataFrame,
                        stores_df: Optional[pd.DataFrame],
                        devices_df: Optional[pd.DataFrame],
                        run: ETLRun) -> pd.DataFrame:
    """Conform sales interactions to silver layer standards"""
    if interactions_df.empty:
        return interactions_df

    start_time = pd.Timestamp.now()
    df = interactions_df.copy()

    try:
        # Apply business rules
        df = _apply_interaction_business_rules(df)

        # Create surrogate key
        df['interaction_key'] = create_surrogate_key(
            df, ['transaction_id', 'store_id', 'device_id']
        )

        # Validate foreign keys
        fk_validations = {}

        if stores_df is not None and not stores_df.empty:
            fk_validations['store'] = validate_foreign_key(
                df, 'store_id', stores_df, 'store_id'
            )

        if devices_df is not None and not devices_df.empty:
            fk_validations['device'] = validate_foreign_key(
                df, 'device_id', devices_df, 'device_id'
            )

        # Log foreign key validation results
        for fk_name, validation in fk_validations.items():
            run.log_metric(f"interactions_{fk_name}_fk_coverage", validation["coverage_pct"])

        # Add derived columns
        df = _add_interaction_derived_columns(df)

        # Add silver metadata
        df = _add_silver_metadata(df, 'interactions')

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("conform_interactions", "success",
                    duration_ms=duration_ms, rows=len(df))

        return df

    except Exception as e:
        run.log_error("conform_interactions", str(e))
        raise

def create_transaction_summary(interactions_df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Create transaction-level summary from interactions"""
    if interactions_df.empty:
        return pd.DataFrame()

    start_time = pd.Timestamp.now()

    try:
        # Group by transaction to create summary
        transaction_cols = ['transaction_id', 'store_id', 'device_id',
                           'transaction_date', 'transaction_timestamp', 'payment_method']

        # Check which columns exist
        existing_cols = [col for col in transaction_cols if col in interactions_df.columns]

        if not existing_cols:
            run.log_step("create_transaction_summary", "skipped",
                        note="Required transaction columns not found")
            return pd.DataFrame()

        # Aggregate interactions to transactions
        df = (interactions_df.groupby(existing_cols, as_index=False)
              .agg({
                  'quantity': 'sum',
                  'total_amount': 'sum',
                  'product_name': 'count',  # Item count
                  'brand': lambda x: '|'.join(x.unique()[:5]),  # Top 5 brands
                  'category': lambda x: '|'.join(x.unique()[:3])  # Top 3 categories
              })
              .rename(columns={
                  'product_name': 'item_count',
                  'brand': 'brands_purchased',
                  'category': 'categories_purchased'
              }))

        # Add derived metrics
        df['avg_item_price'] = df['total_amount'] / df['quantity']
        df['basket_size'] = df['item_count']

        # Create surrogate key
        df['transaction_key'] = create_surrogate_key(df, ['transaction_id'])

        # Add silver metadata
        df = _add_silver_metadata(df, 'transactions')

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("create_transaction_summary", "success",
                    duration_ms=duration_ms, rows=len(df))

        return df

    except Exception as e:
        run.log_error("create_transaction_summary", str(e))
        raise

def _apply_store_business_rules(df: pd.DataFrame) -> pd.DataFrame:
    """Apply business rules to stores data"""
    # Filter active stores only
    if 'status' in df.columns:
        df = df[df['status'].str.upper().isin(['ACTIVE', 'OPEN'])]

    # Standardize region names
    if 'region' in df.columns:
        region_mapping = {
            'METRO MANILA': 'NCR',
            'NATIONAL CAPITAL REGION': 'NCR',
            'REGION 4A': 'CALABARZON',
            'REGION IV-A': 'CALABARZON'
        }
        df['region'] = df['region'].str.upper().replace(region_mapping)

    # Validate coordinates
    if 'latitude' in df.columns and 'longitude' in df.columns:
        # Philippines coordinate bounds
        df.loc[
            (df['latitude'] < 4.0) | (df['latitude'] > 21.0) |
            (df['longitude'] < 116.0) | (df['longitude'] > 127.0),
            ['latitude', 'longitude']
        ] = np.nan

    return df

def _apply_device_business_rules(df: pd.DataFrame) -> pd.DataFrame:
    """Apply business rules to devices data"""
    # Filter active devices only
    if 'status' in df.columns:
        df = df[df['status'].str.upper() == 'ACTIVE']

    # Standardize device types
    if 'device_type' in df.columns:
        device_type_mapping = {
            'POINT OF SALE': 'POS',
            'SELF CHECKOUT': 'SELF-CHECKOUT',
            'MOBILE POS': 'MOBILE',
            'INFORMATION KIOSK': 'KIOSK'
        }
        df['device_type'] = df['device_type'].str.upper().replace(device_type_mapping)

    return df

def _apply_interaction_business_rules(df: pd.DataFrame) -> pd.DataFrame:
    """Apply business rules to interactions data"""
    # Filter valid transactions
    if 'total_amount' in df.columns:
        df = df[df['total_amount'] > 0]

    if 'quantity' in df.columns:
        df = df[df['quantity'] > 0]

    # Standardize payment methods
    if 'payment_method' in df.columns:
        payment_mapping = {
            'CREDIT CARD': 'CARD',
            'DEBIT CARD': 'CARD',
            'CREDIT': 'CARD',
            'GCASH': 'DIGITAL',
            'PAYMAYA': 'DIGITAL',
            'GRABPAY': 'DIGITAL'
        }
        df['payment_method'] = df['payment_method'].str.upper().replace(payment_mapping)

    # Cap extreme values
    if 'quantity' in df.columns:
        df.loc[df['quantity'] > 100, 'quantity'] = 100  # Cap quantity at 100

    if 'unit_price' in df.columns:
        df.loc[df['unit_price'] > 10000, 'unit_price'] = np.nan  # Cap unit price

    return df

def _add_interaction_derived_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived columns to interactions"""
    # Calculate derived fields if base columns exist
    if 'transaction_date' in df.columns:
        df['day_of_week'] = pd.to_datetime(df['transaction_date']).dt.day_name()
        df['month'] = pd.to_datetime(df['transaction_date']).dt.month
        df['quarter'] = pd.to_datetime(df['transaction_date']).dt.quarter
        df['year'] = pd.to_datetime(df['transaction_date']).dt.year

    if 'transaction_timestamp' in df.columns:
        df['hour'] = pd.to_datetime(df['transaction_timestamp']).dt.hour
        df['time_of_day'] = pd.cut(
            pd.to_datetime(df['transaction_timestamp']).dt.hour,
            bins=[0, 6, 12, 18, 24],
            labels=['Night', 'Morning', 'Afternoon', 'Evening']
        )

    # Revenue per unit
    if 'total_amount' in df.columns and 'quantity' in df.columns:
        df['revenue_per_unit'] = df['total_amount'] / df['quantity']

    return df

def _add_silver_metadata(df: pd.DataFrame, table_name: str) -> pd.DataFrame:
    """Add silver layer metadata"""
    df = df.copy()

    df['_silver_table'] = table_name
    df['_silver_loaded_at'] = pd.Timestamp.now()
    df['_silver_quality_score'] = calculate_data_quality_score(df)["completeness"]

    return df

def validate_silver_data(silver_data: Dict[str, pd.DataFrame], run: ETLRun) -> bool:
    """Validate silver layer data"""
    validation_passed = True

    for table_name, df in silver_data.items():
        if df.empty:
            continue

        # Check for surrogate keys
        key_column = f"{table_name.rstrip('s')}_key"
        if table_name == 'interactions':
            key_column = 'interaction_key'

        if key_column not in df.columns:
            run.log_error(f"silver_validation_{table_name}",
                         f"Missing surrogate key: {key_column}")
            validation_passed = False

        # Check data quality
        quality = calculate_data_quality_score(df)
        if quality["completeness"] < 0.8:  # 80% completeness threshold
            run.log_error(f"silver_validation_{table_name}",
                         f"Low data quality: {quality['completeness']:.2%}")
            validation_passed = False

        # Check for required business rules
        if table_name == 'stores' and 'status' in df.columns:
            inactive_count = (~df['status'].str.upper().isin(['ACTIVE', 'OPEN'])).sum()
            if inactive_count > 0:
                run.log_error(f"silver_validation_{table_name}",
                             f"Found {inactive_count} inactive stores")

        run.log_metric(f"silver_{table_name}_quality_score", quality["completeness"])

    return validation_passed