"""
Azure SQL Server data extraction for Scout ETL Pipeline
"""
import pandas as pd
import sqlalchemy as sa
from typing import Optional, Dict, Any
from ..common.config import cfg
from ..common.log import ETLRun
from ..common.io import clean_dataframe, infer_datatypes

def create_azure_connection() -> Optional[sa.engine.Engine]:
    """Create Azure SQL connection"""
    if not cfg.validate_azure_config():
        print("⚠️ Azure SQL configuration not available")
        return None

    try:
        # Build connection string
        connection_string = (
            f"mssql+pyodbc://{cfg.azure_sql_user}:{cfg.azure_sql_pass}@"
            f"{cfg.azure_sql_url}?driver=ODBC+Driver+17+for+SQL+Server"
        )

        engine = sa.create_engine(connection_string)

        # Test connection
        with engine.connect() as conn:
            conn.execute(sa.text("SELECT 1"))

        print("✅ Azure SQL connection established")
        return engine

    except Exception as e:
        print(f"❌ Failed to connect to Azure SQL: {e}")
        return None

def pull_sales_interactions(run: ETLRun) -> pd.DataFrame:
    """Extract sales interactions from Azure SQL"""
    start_time = pd.Timestamp.now()

    engine = create_azure_connection()
    if engine is None:
        # Return mock data for development
        run.log_step("pull_sales_interactions", "skipped",
                    note="Azure SQL not configured, using mock data")
        return _mock_sales_interactions()

    try:
        query = """
        SELECT
            InteractionID,
            StoreID,
            DeviceID,
            ProductID,
            CustomerID,
            TransactionDate,
            TransactionTime,
            Quantity,
            UnitPrice,
            TotalAmount,
            PaymentMethod,
            Category,
            Brand,
            ProductName,
            SKU,
            CAST(TransactionDate AS VARCHAR) + ' ' +
            CAST(TransactionTime AS VARCHAR) as TransactionTimestamp
        FROM SalesInteractions
        WHERE TransactionDate >= DATEADD(day, -90, GETDATE())
        ORDER BY TransactionDate DESC, TransactionTime DESC
        """

        df = pd.read_sql(query, engine)

        # Clean and process data
        df = clean_dataframe(df)

        # Infer data types
        numeric_cols = ['Quantity', 'UnitPrice', 'TotalAmount', 'StoreID', 'DeviceID']
        date_cols = ['TransactionDate', 'TransactionTimestamp']
        df = infer_datatypes(df, numeric_cols=numeric_cols, date_cols=date_cols)

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("pull_sales_interactions", "success",
                    duration_ms=duration_ms, rows=len(df))
        run.log_metric("sales_interactions_extracted", len(df))

        return df

    except Exception as e:
        run.log_error("pull_sales_interactions", str(e))
        print(f"❌ Failed to extract sales interactions: {e}")
        # Return mock data as fallback
        return _mock_sales_interactions()

def pull_stores(run: ETLRun) -> pd.DataFrame:
    """Extract store information from Azure SQL"""
    start_time = pd.Timestamp.now()

    engine = create_azure_connection()
    if engine is None:
        run.log_step("pull_stores", "skipped",
                    note="Azure SQL not configured, using mock data")
        return _mock_stores()

    try:
        query = """
        SELECT
            StoreID,
            StoreName,
            StoreType,
            Region,
            Province,
            City,
            Barangay,
            Address,
            Latitude,
            Longitude,
            OpenDate,
            Status,
            ManagerName,
            ContactInfo
        FROM Stores
        WHERE Status = 'Active'
        ORDER BY StoreID
        """

        df = pd.read_sql(query, engine)
        df = clean_dataframe(df)

        # Infer data types
        numeric_cols = ['StoreID', 'Latitude', 'Longitude']
        date_cols = ['OpenDate']
        df = infer_datatypes(df, numeric_cols=numeric_cols, date_cols=date_cols)

        duration_ms = int((pd.Timestamp.now() - start_time).total_seconds() * 1000)
        run.log_step("pull_stores", "success",
                    duration_ms=duration_ms, rows=len(df))
        run.log_metric("stores_extracted", len(df))

        return df

    except Exception as e:
        run.log_error("pull_stores", str(e))
        print(f"❌ Failed to extract stores: {e}")
        return _mock_stores()

def _mock_sales_interactions() -> pd.DataFrame:
    """Generate mock sales interactions data"""
    import numpy as np
    from datetime import datetime, timedelta

    # Generate sample data
    n_records = 1000
    base_date = datetime.now() - timedelta(days=30)

    data = {
        'InteractionID': [f'INT_{i:06d}' for i in range(1, n_records + 1)],
        'StoreID': np.random.choice([1, 2, 3, 4, 5], n_records),
        'DeviceID': np.random.choice(['DEV_001', 'DEV_002', 'DEV_003'], n_records),
        'ProductID': [f'P_{i:04d}' for i in np.random.randint(1, 100, n_records)],
        'CustomerID': [f'C_{i:06d}' for i in np.random.randint(1, 1000, n_records)],
        'TransactionDate': [
            base_date + timedelta(days=np.random.randint(0, 30))
            for _ in range(n_records)
        ],
        'Quantity': np.random.randint(1, 5, n_records),
        'UnitPrice': np.round(np.random.uniform(10, 500, n_records), 2),
        'PaymentMethod': np.random.choice(['Cash', 'Card', 'Digital'], n_records),
        'Category': np.random.choice(['Beverages', 'Snacks', 'Personal Care'], n_records),
        'Brand': np.random.choice(['Coca-Cola', 'Pepsi', 'Nestle', 'P&G'], n_records),
        'ProductName': np.random.choice(['Product A', 'Product B', 'Product C'], n_records),
        'SKU': [f'SKU_{i:04d}' for i in np.random.randint(1, 50, n_records)]
    }

    # Calculate total amount
    df = pd.DataFrame(data)
    df['TotalAmount'] = df['Quantity'] * df['UnitPrice']

    print(f"📊 Generated {len(df)} mock sales interaction records")
    return df

def _mock_stores() -> pd.DataFrame:
    """Generate mock store data"""
    data = {
        'StoreID': [1, 2, 3, 4, 5],
        'StoreName': [
            'SM Mall of Asia',
            'Ayala Makati',
            'Robinsons Galleria',
            'Gateway Mall',
            'Trinoma'
        ],
        'StoreType': ['Mall', 'Mall', 'Mall', 'Mall', 'Mall'],
        'Region': ['NCR', 'NCR', 'NCR', 'NCR', 'NCR'],
        'Province': ['Metro Manila'] * 5,
        'City': ['Pasay', 'Makati', 'Quezon City', 'Quezon City', 'Quezon City'],
        'Barangay': ['Tambo', 'Poblacion', 'Ortigas', 'Cubao', 'North Triangle'],
        'Latitude': [14.5352, 14.5547, 14.6199, 14.6199, 14.6560],
        'Longitude': [120.9822, 121.0244, 121.0560, 121.0560, 121.0351],
        'Status': ['Active'] * 5,
        'ManagerName': ['Juan Cruz', 'Maria Santos', 'Pedro Garcia', 'Ana Lopez', 'Jose Reyes'],
        'ContactInfo': ['juan@store1.com', 'maria@store2.com', 'pedro@store3.com', 'ana@store4.com', 'jose@store5.com']
    }

    df = pd.DataFrame(data)
    print(f"📊 Generated {len(df)} mock store records")
    return df