"""
Silver layer enrichment for Scout ETL Pipeline
Add derived insights, lookups, and cross-table joins
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.util import create_surrogate_key, calculate_data_quality_score

def enrich_interactions(silver_data: Dict[str, pd.DataFrame], run: ETLRun) -> pd.DataFrame:
    """Enrich interactions with store and device information"""
    if 'interactions' not in silver_data or silver_data['interactions'].empty:
        run.log_step("enrich_interactions", "skipped", note="No interactions data")
        return pd.DataFrame()

    start_time = pd.Timestamp.now()

    try:
        interactions_df = silver_data['interactions'].copy()
        stores_df = silver_data.get('stores', pd.DataFrame())
        devices_df = silver_data.get('devices', pd.DataFrame())

        # Start with base interactions
        enriched_df = interactions_df.copy()

        # Enrich with store data
        if not stores_df.empty:
            enriched_df = _enrich_with_store_data(enriched_df, stores_df, run)

        # Enrich with device data
        if not devices_df.empty:
            enriched_df = _enrich_with_device_data(enriched_df, devices_df, run)

        # Add customer insights (demographic mapping)
        enriched_df = _add_customer_insights(enriched_df, run)

        # Add business metrics
        enriched_df = _add_business_metrics(enriched_df, run)

        # Add temporal enrichments
        enriched_df = _add_temporal_enrichments(enriched_df, run)

        # Update surrogate key for enriched data
        enriched_df['interaction_enriched_key'] = create_surrogate_key(
            enriched_df, ['transaction_id', 'store_id', 'device_id']
        )

        # Add enrichment metadata
        enriched_df['_enriched_at'] = pd.Timestamp.now()
        enriched_df['_enrichment_source'] = 'silver_enrich'

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("enrich_interactions", "success",
                    duration_ms=duration_ms,
                    rows=len(enriched_df),
                    columns=len(enriched_df.columns))

        # Log enrichment metrics
        quality = calculate_data_quality_score(enriched_df)
        run.log_metric("enriched_interactions_quality", quality["completeness"])
        run.log_metric("enriched_interactions_columns", len(enriched_df.columns))

        return enriched_df

    except Exception as e:
        run.log_error("enrich_interactions", str(e))
        raise

def _enrich_with_store_data(interactions_df: pd.DataFrame,
                           stores_df: pd.DataFrame,
                           run: ETLRun) -> pd.DataFrame:
    """Enrich interactions with store information"""
    # Prepare store lookup data
    store_lookup = stores_df[['store_id', 'store_name', 'store_type', 'region',
                             'province', 'city', 'barangay', 'latitude', 'longitude']].copy()

    # Rename columns to avoid conflicts
    store_lookup.columns = ['store_id'] + [f'store_{col}' for col in store_lookup.columns[1:]]

    # Merge with interactions
    enriched_df = interactions_df.merge(store_lookup, on='store_id', how='left')

    # Calculate store metrics
    store_match_rate = (enriched_df['store_name'].notna().sum() / len(enriched_df)) * 100
    run.log_metric("store_enrichment_match_rate", round(store_match_rate, 2))

    return enriched_df

def _enrich_with_device_data(interactions_df: pd.DataFrame,
                            devices_df: pd.DataFrame,
                            run: ETLRun) -> pd.DataFrame:
    """Enrich interactions with device information"""
    # Prepare device lookup data
    device_lookup = devices_df[['device_id', 'device_name', 'device_type',
                               'location_in_store', 'serial_number']].copy()

    # Rename columns to avoid conflicts
    device_lookup.columns = ['device_id'] + [f'device_{col}' for col in device_lookup.columns[1:]]

    # Merge with interactions
    enriched_df = interactions_df.merge(device_lookup, on='device_id', how='left')

    # Calculate device metrics
    device_match_rate = (enriched_df['device_name'].notna().sum() / len(enriched_df)) * 100
    run.log_metric("device_enrichment_match_rate", round(device_match_rate, 2))

    return enriched_df

def _add_customer_insights(df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Add customer demographic insights"""
    enriched_df = df.copy()

    # Age group mapping (if age data exists)
    if 'age' in df.columns:
        enriched_df['age_group'] = pd.cut(
            df['age'],
            bins=[0, 18, 25, 35, 45, 55, 65, 100],
            labels=['<18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+']
        )

    # Gender standardization (if gender data exists)
    if 'gender' in df.columns:
        gender_mapping = {
            'M': 'Male', 'F': 'Female',
            'MALE': 'Male', 'FEMALE': 'Female',
            '1': 'Male', '0': 'Female'
        }
        enriched_df['gender_normalized'] = df['gender'].astype(str).str.upper().map(gender_mapping)

    # Purchase behavior segmentation
    if 'total_amount' in df.columns:
        enriched_df['purchase_segment'] = pd.cut(
            df['total_amount'],
            bins=[0, 50, 150, 500, 1000, float('inf')],
            labels=['Low', 'Medium', 'High', 'Premium', 'VIP']
        )

    # Frequency indicators (simplified for demo)
    if 'customer_id' in df.columns:
        customer_freq = df.groupby('customer_id').size()
        freq_mapping = customer_freq.to_dict()
        enriched_df['customer_frequency'] = df['customer_id'].map(freq_mapping)

        enriched_df['frequency_segment'] = pd.cut(
            enriched_df['customer_frequency'],
            bins=[0, 1, 3, 10, float('inf')],
            labels=['One-time', 'Occasional', 'Regular', 'Frequent']
        )

    return enriched_df

def _add_business_metrics(df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Add business intelligence metrics"""
    enriched_df = df.copy()

    # Margin calculation (simplified - would need cost data in production)
    if 'total_amount' in df.columns and 'category' in df.columns:
        # Simplified margin assumptions by category
        margin_mapping = {
            'BEVERAGES': 0.25,
            'SNACKS': 0.30,
            'PERSONAL CARE': 0.35,
            'ELECTRONICS': 0.15,
            'CLOTHING': 0.50
        }

        enriched_df['estimated_margin_rate'] = df['category'].str.upper().map(margin_mapping).fillna(0.25)
        enriched_df['estimated_margin'] = df['total_amount'] * enriched_df['estimated_margin_rate']

    # Brand performance indicators
    if 'brand' in df.columns and 'total_amount' in df.columns:
        brand_performance = df.groupby('brand')['total_amount'].agg(['sum', 'count', 'mean'])
        brand_performance.columns = ['brand_total_revenue', 'brand_transaction_count', 'brand_avg_transaction']

        enriched_df = enriched_df.merge(
            brand_performance.reset_index(),
            on='brand',
            how='left'
        )

    # Category insights
    if 'category' in df.columns:
        category_stats = df.groupby('category').agg({
            'total_amount': ['sum', 'mean'],
            'quantity': 'mean'
        }).round(2)

        category_stats.columns = ['category_total_revenue', 'category_avg_transaction', 'category_avg_quantity']

        enriched_df = enriched_df.merge(
            category_stats.reset_index(),
            on='category',
            how='left'
        )

    # Cross-selling indicators
    if 'transaction_id' in df.columns and 'brand' in df.columns:
        # Count unique brands per transaction
        brand_count = df.groupby('transaction_id')['brand'].nunique().reset_index()
        brand_count.columns = ['transaction_id', 'brands_in_basket']

        enriched_df = enriched_df.merge(brand_count, on='transaction_id', how='left')

        # Cross-selling flag
        enriched_df['is_cross_sell'] = (enriched_df['brands_in_basket'] > 1).astype(bool)

    return enriched_df

def _add_temporal_enrichments(df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Add time-based enrichments"""
    enriched_df = df.copy()

    if 'transaction_date' in df.columns:
        transaction_date = pd.to_datetime(df['transaction_date'])

        # Day classifications
        enriched_df['is_weekend'] = transaction_date.dt.weekday >= 5
        enriched_df['is_month_end'] = transaction_date.dt.day >= 25
        enriched_df['is_month_start'] = transaction_date.dt.day <= 7

        # Season mapping (Philippines context)
        enriched_df['season'] = transaction_date.dt.month.map({
            12: 'Dry', 1: 'Dry', 2: 'Dry', 3: 'Hot Dry', 4: 'Hot Dry', 5: 'Hot Dry',
            6: 'Wet', 7: 'Wet', 8: 'Wet', 9: 'Wet', 10: 'Wet', 11: 'Dry'
        })

        # Holiday indicators (simplified)
        enriched_df['is_holiday_season'] = transaction_date.dt.month.isin([11, 12, 1])

        # Payroll periods (15th and 30th)
        enriched_df['is_payday_period'] = (
            (transaction_date.dt.day.between(13, 17)) |
            (transaction_date.dt.day.between(28, 31))
        )

    if 'transaction_timestamp' in df.columns:
        transaction_ts = pd.to_datetime(df['transaction_timestamp'])

        # Hour-based classifications
        enriched_df['hour'] = transaction_ts.dt.hour
        enriched_df['is_peak_hour'] = transaction_ts.dt.hour.isin([11, 12, 13, 17, 18, 19])  # Lunch & dinner
        enriched_df['is_business_hour'] = transaction_ts.dt.hour.between(9, 21)

        # Shift classifications
        enriched_df['work_shift'] = pd.cut(
            transaction_ts.dt.hour,
            bins=[0, 6, 14, 22, 24],
            labels=['Night', 'Morning', 'Afternoon', 'Evening'],
            include_lowest=True
        )

    return enriched_df

def create_customer_segments(enriched_df: pd.DataFrame, run: ETLRun) -> pd.DataFrame:
    """Create customer segmentation table"""
    if enriched_df.empty or 'customer_id' not in enriched_df.columns:
        run.log_step("create_customer_segments", "skipped", note="No customer data")
        return pd.DataFrame()

    try:
        # Aggregate customer metrics
        customer_metrics = enriched_df.groupby('customer_id').agg({
            'total_amount': ['sum', 'mean', 'count'],
            'quantity': 'sum',
            'transaction_date': ['min', 'max'],
            'brand': 'nunique',
            'category': 'nunique',
            'store_id': 'nunique'
        }).round(2)

        customer_metrics.columns = [
            'total_revenue', 'avg_transaction_value', 'transaction_count',
            'total_quantity', 'first_purchase', 'last_purchase',
            'brands_purchased', 'categories_purchased', 'stores_visited'
        ]

        # Calculate derived metrics
        customer_metrics['days_active'] = (
            pd.to_datetime(customer_metrics['last_purchase']) -
            pd.to_datetime(customer_metrics['first_purchase'])
        ).dt.days + 1

        customer_metrics['avg_days_between_visits'] = (
            customer_metrics['days_active'] / customer_metrics['transaction_count']
        )

        # RFM Segmentation
        customer_metrics['recency_days'] = (
            pd.Timestamp.now() - pd.to_datetime(customer_metrics['last_purchase'])
        ).dt.days

        # Create RFM scores (1-5 scale)
        customer_metrics['recency_score'] = pd.qcut(
            customer_metrics['recency_days'], q=5, labels=[5, 4, 3, 2, 1]
        )
        customer_metrics['frequency_score'] = pd.qcut(
            customer_metrics['transaction_count'], q=5, labels=[1, 2, 3, 4, 5]
        )
        customer_metrics['monetary_score'] = pd.qcut(
            customer_metrics['total_revenue'], q=5, labels=[1, 2, 3, 4, 5]
        )

        # Combine RFM into segments
        customer_metrics['rfm_score'] = (
            customer_metrics['recency_score'].astype(str) +
            customer_metrics['frequency_score'].astype(str) +
            customer_metrics['monetary_score'].astype(str)
        )

        # Add surrogate key
        customer_metrics = customer_metrics.reset_index()
        customer_metrics['customer_segment_key'] = create_surrogate_key(
            customer_metrics, ['customer_id']
        )

        run.log_step("create_customer_segments", "success", rows=len(customer_metrics))
        run.log_metric("customer_segments_created", len(customer_metrics))

        return customer_metrics

    except Exception as e:
        run.log_error("create_customer_segments", str(e))
        return pd.DataFrame()