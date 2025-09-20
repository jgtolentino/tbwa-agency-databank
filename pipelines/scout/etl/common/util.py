"""
Utility functions for Scout ETL Pipeline
Hash keys, data validation, and helper functions
"""
import hashlib
import json
import re
from typing import Any, Dict, List, Optional, Union
import pandas as pd

def hash_row(row: Union[pd.Series, Dict], algorithm: str = "blake2b") -> str:
    """Generate stable hash for a row to create surrogate keys"""
    if isinstance(row, pd.Series):
        data = row.to_dict()
    else:
        data = row

    # Sort keys for consistent hashing
    sorted_data = {k: v for k, v in sorted(data.items())}

    # Convert to JSON string (handling NaN/None values)
    json_str = json.dumps(sorted_data, sort_keys=True, default=str)

    # Generate hash
    if algorithm == "blake2b":
        return hashlib.blake2b(json_str.encode()).hexdigest()[:16]
    elif algorithm == "md5":
        return hashlib.md5(json_str.encode()).hexdigest()
    else:
        return hashlib.sha256(json_str.encode()).hexdigest()[:16]

def create_natural_key(df: pd.DataFrame, key_cols: List[str]) -> pd.Series:
    """Create natural key from multiple columns"""
    # Combine columns with separator
    natural_key = df[key_cols].astype(str).agg('|'.join, axis=1)
    return natural_key

def create_surrogate_key(df: pd.DataFrame, key_cols: Optional[List[str]] = None) -> pd.Series:
    """Create surrogate key for DataFrame rows"""
    if key_cols:
        # Use only specified columns for key generation
        subset_df = df[key_cols].copy()
    else:
        # Use all columns
        subset_df = df.copy()

    # Generate hash for each row
    surrogate_keys = subset_df.apply(hash_row, axis=1)
    return surrogate_keys

def validate_primary_key(df: pd.DataFrame, pk_cols: List[str]) -> bool:
    """Validate primary key uniqueness"""
    if not all(col in df.columns for col in pk_cols):
        raise ValueError(f"Primary key columns {pk_cols} not found in DataFrame")

    # Check for duplicates
    duplicates = df.duplicated(subset=pk_cols, keep=False)
    if duplicates.any():
        duplicate_count = duplicates.sum()
        print(f"⚠️ Found {duplicate_count} duplicate rows on PK {pk_cols}")
        return False

    return True

def validate_foreign_key(df: pd.DataFrame, fk_col: str,
                        ref_df: pd.DataFrame, ref_col: str) -> Dict[str, Any]:
    """Validate foreign key references"""
    if fk_col not in df.columns:
        raise ValueError(f"Foreign key column {fk_col} not found")

    if ref_col not in ref_df.columns:
        raise ValueError(f"Reference column {ref_col} not found")

    # Get non-null foreign key values
    fk_values = df[fk_col].dropna().unique()
    ref_values = ref_df[ref_col].dropna().unique()

    # Find orphan records
    orphans = set(fk_values) - set(ref_values)

    validation_result = {
        "is_valid": len(orphans) == 0,
        "orphan_count": len(orphans),
        "orphan_values": list(orphans)[:10],  # Limit to first 10
        "coverage_pct": (1 - len(orphans) / len(fk_values)) * 100 if fk_values.size > 0 else 100
    }

    if orphans:
        print(f"⚠️ Found {len(orphans)} orphan records in {fk_col}")

    return validation_result

def clean_column_names(columns: List[str]) -> List[str]:
    """Clean and standardize column names"""
    cleaned = []
    for col in columns:
        # Convert to lowercase
        clean_col = col.lower()

        # Replace spaces and hyphens with underscores
        clean_col = re.sub(r'[\s\-]+', '_', clean_col)

        # Remove special characters except underscores
        clean_col = re.sub(r'[^a-z0-9_]', '', clean_col)

        # Remove leading/trailing underscores
        clean_col = clean_col.strip('_')

        # Handle empty string
        if not clean_col:
            clean_col = f"col_{len(cleaned)}"

        cleaned.append(clean_col)

    return cleaned

def detect_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """Detect appropriate data types for columns"""
    type_mapping = {}

    for col in df.columns:
        series = df[col].dropna()

        if len(series) == 0:
            type_mapping[col] = "string"
            continue

        # Check if numeric
        try:
            pd.to_numeric(series)
            # Check if integer
            if series.apply(lambda x: str(x).replace('.', '').replace('-', '').isdigit()).all():
                type_mapping[col] = "integer"
            else:
                type_mapping[col] = "float"
            continue
        except (ValueError, TypeError):
            pass

        # Check if datetime
        try:
            pd.to_datetime(series)
            type_mapping[col] = "datetime"
            continue
        except (ValueError, TypeError):
            pass

        # Check if boolean
        unique_values = set(series.astype(str).str.lower().unique())
        if unique_values.issubset({'true', 'false', '1', '0', 'yes', 'no'}):
            type_mapping[col] = "boolean"
            continue

        # Default to string
        type_mapping[col] = "string"

    return type_mapping

def calculate_data_quality_score(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculate data quality metrics"""
    total_cells = df.shape[0] * df.shape[1]
    null_cells = df.isnull().sum().sum()

    quality_score = {
        "completeness": 1 - (null_cells / total_cells) if total_cells > 0 else 1,
        "row_count": len(df),
        "column_count": len(df.columns),
        "null_count": int(null_cells),
        "null_percentage": (null_cells / total_cells * 100) if total_cells > 0 else 0,
        "duplicate_rows": df.duplicated().sum(),
        "columns_with_nulls": df.isnull().any().sum()
    }

    return quality_score

def format_bytes(bytes_value: int) -> str:
    """Format bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.1f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.1f} TB"

def format_duration(seconds: float) -> str:
    """Format duration in seconds to human readable format"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        return f"{seconds/60:.1f}m"
    else:
        return f"{seconds/3600:.1f}h"