"""
I/O utilities for Scout ETL Pipeline
Handles CSV, JSON, Parquet reading and writing
"""
import pandas as pd
import json
import csv
from pathlib import Path
from typing import Dict, Any, List, Optional, Union, Iterator
from io import StringIO

def read_csv(file_path: Union[str, Path], **kwargs) -> pd.DataFrame:
    """Read CSV file with robust error handling"""
    try:
        # Default CSV reading options
        defaults = {
            'encoding': 'utf-8',
            'na_values': ['', 'NULL', 'null', 'None'],
            'keep_default_na': True,
            'dtype': str  # Read everything as string initially
        }
        defaults.update(kwargs)

        df = pd.read_csv(file_path, **defaults)
        print(f"✅ Read {len(df)} rows from {file_path}")
        return df

    except Exception as e:
        print(f"❌ Failed to read CSV {file_path}: {e}")
        raise

def read_json(file_path: Union[str, Path]) -> Union[Dict, List]:
    """Read JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ Read JSON from {file_path}")
        return data

    except Exception as e:
        print(f"❌ Failed to read JSON {file_path}: {e}")
        raise

def write_csv(df: pd.DataFrame, file_path: Union[str, Path], **kwargs) -> None:
    """Write DataFrame to CSV"""
    try:
        defaults = {
            'index': False,
            'encoding': 'utf-8'
        }
        defaults.update(kwargs)

        df.to_csv(file_path, **defaults)
        print(f"✅ Wrote {len(df)} rows to {file_path}")

    except Exception as e:
        print(f"❌ Failed to write CSV {file_path}: {e}")
        raise

def write_parquet(df: pd.DataFrame, file_path: Union[str, Path]) -> None:
    """Write DataFrame to Parquet"""
    try:
        df.to_parquet(file_path, index=False)
        print(f"✅ Wrote {len(df)} rows to {file_path}")

    except Exception as e:
        print(f"❌ Failed to write Parquet {file_path}: {e}")
        raise

def dataframe_chunks(df: pd.DataFrame, chunk_size: int = 5000) -> Iterator[pd.DataFrame]:
    """Split DataFrame into chunks for batch processing"""
    for i in range(0, len(df), chunk_size):
        yield df.iloc[i:i + chunk_size]

def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names for consistency"""
    df = df.copy()

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').str.replace('-', '_')

    # Remove special characters except underscore
    df.columns = df.columns.str.replace(r'[^a-z0-9_]', '', regex=True)

    return df

def infer_datatypes(df: pd.DataFrame,
                   numeric_cols: Optional[List[str]] = None,
                   date_cols: Optional[List[str]] = None) -> pd.DataFrame:
    """Infer and convert data types"""
    df = df.copy()

    # Convert numeric columns
    if numeric_cols:
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

    # Convert date columns
    if date_cols:
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')

    # Auto-infer numeric columns (if not specified)
    if not numeric_cols:
        for col in df.columns:
            if df[col].dtype == 'object':
                # Try to convert to numeric
                try:
                    converted = pd.to_numeric(df[col], errors='coerce')
                    # If most values are numeric, convert the column
                    if converted.notna().sum() / len(df) > 0.5:
                        df[col] = converted
                except:
                    pass

    return df

def validate_required_columns(df: pd.DataFrame, required_cols: List[str]) -> bool:
    """Validate that DataFrame has required columns"""
    missing_cols = set(required_cols) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    return True

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Clean DataFrame with standard operations"""
    df = df.copy()

    # Remove completely empty rows
    df = df.dropna(how='all')

    # Strip whitespace from string columns
    string_cols = df.select_dtypes(include=['object']).columns
    for col in string_cols:
        df[col] = df[col].astype(str).str.strip()
        # Convert empty strings to NaN
        df[col] = df[col].replace(['', 'nan', 'None'], pd.NA)

    return df