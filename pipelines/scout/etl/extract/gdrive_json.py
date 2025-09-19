"""
Google Drive JSON/CSV data extraction for Scout ETL Pipeline
"""
import pandas as pd
import json
import requests
from pathlib import Path
from typing import Optional, Dict, Any, List
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.io import read_csv, read_json, clean_dataframe, normalize_columns

def pull_devices(run: ETLRun) -> pd.DataFrame:
    """Extract device information from Google Drive"""
    start_time = pd.Timestamp.now()

    if not cfg.gdrive_folder_id:
        run.log_step("pull_devices", "skipped",
                    note="Google Drive not configured, using mock data")
        return _mock_devices()

    try:
        # In production, this would use Google Drive API
        # For now, we'll simulate with local files or mock data
        devices_df = _fetch_devices_from_drive()

        if devices_df is None or devices_df.empty:
            run.log_step("pull_devices", "fallback",
                        note="No data from Google Drive, using mock data")
            return _mock_devices()

        # Clean and normalize
        devices_df = clean_dataframe(devices_df)
        devices_df = normalize_columns(devices_df)

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("pull_devices", "success",
                    duration_ms=duration_ms, rows=len(devices_df))
        run.log_metric("devices_extracted", len(devices_df))

        return devices_df

    except Exception as e:
        run.log_error("pull_devices", str(e))
        print(f"❌ Failed to extract devices from Google Drive: {e}")
        return _mock_devices()

def pull_campaign_data(run: ETLRun) -> pd.DataFrame:
    """Extract campaign effectiveness data from Google Drive"""
    start_time = pd.Timestamp.now()

    try:
        # Look for campaign files in the configured folder
        campaign_df = _fetch_campaign_from_drive()

        if campaign_df is None or campaign_df.empty:
            run.log_step("pull_campaign_data", "fallback",
                        note="No campaign data from Google Drive, using mock data")
            return _mock_campaign_data()

        # Clean and normalize
        campaign_df = clean_dataframe(campaign_df)
        campaign_df = normalize_columns(campaign_df)

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("pull_campaign_data", "success",
                    duration_ms=duration_ms, rows=len(campaign_df))
        run.log_metric("campaign_data_extracted", len(campaign_df))

        return campaign_df

    except Exception as e:
        run.log_error("pull_campaign_data", str(e))
        print(f"❌ Failed to extract campaign data: {e}")
        return _mock_campaign_data()

def _fetch_devices_from_drive() -> Optional[pd.DataFrame]:
    """Fetch device data from Google Drive (placeholder implementation)"""
    # In production, this would use Google Drive API
    # For demo purposes, we'll check for local files first

    local_paths = [
        "data/devices.csv",
        "data/scout_devices.json",
        "/tmp/scout_devices.csv"
    ]

    for path in local_paths:
        file_path = Path(path)
        if file_path.exists():
            try:
                if path.endswith('.csv'):
                    return read_csv(file_path)
                elif path.endswith('.json'):
                    data = read_json(file_path)
                    return pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
            except Exception as e:
                print(f"⚠️ Failed to read {path}: {e}")
                continue

    return None

def _fetch_campaign_from_drive() -> Optional[pd.DataFrame]:
    """Fetch campaign data from Google Drive (placeholder implementation)"""
    # Similar to devices, check for local files
    local_paths = [
        "data/campaign_effectiveness.csv",
        "data/ces_data.json",
        "/tmp/campaign_data.csv"
    ]

    for path in local_paths:
        file_path = Path(path)
        if file_path.exists():
            try:
                if path.endswith('.csv'):
                    return read_csv(file_path)
                elif path.endswith('.json'):
                    data = read_json(file_path)
                    return pd.DataFrame(data) if isinstance(data, list) else pd.DataFrame([data])
            except Exception as e:
                print(f"⚠️ Failed to read {path}: {e}")
                continue

    return None

def _mock_devices() -> pd.DataFrame:
    """Generate mock device data"""
    import numpy as np

    data = {
        'device_id': ['DEV_001', 'DEV_002', 'DEV_003', 'DEV_004', 'DEV_005'],
        'device_name': [
            'Main POS Terminal',
            'Self-Checkout 1',
            'Self-Checkout 2',
            'Mobile POS',
            'Kiosk Terminal'
        ],
        'device_type': ['POS', 'Self-Checkout', 'Self-Checkout', 'Mobile', 'Kiosk'],
        'store_id': [1, 1, 1, 2, 2],
        'location_in_store': [
            'Main Counter',
            'Self-Checkout Area',
            'Self-Checkout Area',
            'Floor Assistant',
            'Information Desk'
        ],
        'installation_date': [
            '2023-01-15',
            '2023-02-01',
            '2023-02-01',
            '2023-03-10',
            '2023-04-05'
        ],
        'status': ['Active'] * 5,
        'last_maintenance': [
            '2024-01-15',
            '2024-01-20',
            '2024-01-20',
            '2024-01-25',
            '2024-01-30'
        ],
        'serial_number': [f'SN{i:06d}' for i in range(100001, 100006)],
        'firmware_version': ['v2.1.0', 'v2.0.5', 'v2.0.5', 'v2.1.1', 'v1.9.8']
    }

    df = pd.DataFrame(data)
    print(f"📊 Generated {len(df)} mock device records")
    return df

def _mock_campaign_data() -> pd.DataFrame:
    """Generate mock campaign effectiveness data"""
    import numpy as np
    from datetime import datetime, timedelta

    n_campaigns = 20
    base_date = datetime.now() - timedelta(days=180)

    data = {
        'campaign_id': [f'CMP_{i:04d}' for i in range(1, n_campaigns + 1)],
        'campaign_name': [
            f'Campaign {i} - {brand}' for i, brand in
            enumerate(['Coca-Cola', 'Pepsi', 'Nestle', 'P&G'] * 5, 1)
        ],
        'brand': ['Coca-Cola', 'Pepsi', 'Nestle', 'P&G'] * 5,
        'start_date': [
            base_date + timedelta(days=i*7) for i in range(n_campaigns)
        ],
        'end_date': [
            base_date + timedelta(days=i*7 + 14) for i in range(n_campaigns)
        ],
        'budget': np.random.uniform(50000, 500000, n_campaigns),
        'impressions': np.random.randint(100000, 1000000, n_campaigns),
        'clicks': np.random.randint(1000, 50000, n_campaigns),
        'conversions': np.random.randint(50, 2000, n_campaigns),
        'revenue_attributed': np.random.uniform(10000, 200000, n_campaigns),
        'channel': np.random.choice(['Digital', 'TV', 'Radio', 'Print'], n_campaigns),
        'target_demographic': np.random.choice(['18-25', '26-35', '36-45', '46+'], n_campaigns),
        'campaign_type': np.random.choice(['Awareness', 'Conversion', 'Retention'], n_campaigns)
    }

    df = pd.DataFrame(data)
    # Calculate derived metrics
    df['ctr'] = (df['clicks'] / df['impressions'] * 100).round(2)
    df['conversion_rate'] = (df['conversions'] / df['clicks'] * 100).round(2)
    df['roi'] = ((df['revenue_attributed'] - df['budget']) / df['budget'] * 100).round(2)

    print(f"📊 Generated {len(df)} mock campaign records")
    return df

def fetch_from_gdrive_api(folder_id: str, file_pattern: str) -> List[Dict[str, Any]]:
    """
    Production implementation for Google Drive API access
    This is a placeholder for the actual API implementation
    """
    # TODO: Implement Google Drive API access
    # Would require:
    # 1. Google API credentials
    # 2. Google Drive API client
    # 3. File listing and download logic
    # 4. Error handling and retries

    print(f"📁 Would fetch files matching '{file_pattern}' from folder {folder_id}")
    return []