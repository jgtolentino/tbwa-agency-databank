"""
Configuration management for Scout ETL Pipeline
Handles environment variables and feature flags
"""
import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration manager for Scout ETL"""

    def __init__(self):
        self.base_path = Path(__file__).parent.parent
        self.configs_path = self.base_path.parent / "configs"

        # Environment configuration
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.dry_run = os.getenv("DRY_RUN", "true").lower() == "true"

        # Supabase configuration
        self.supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        self.supabase_anon_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        self.supabase_service_role = os.getenv("SUPABASE_SERVICE_ROLE")

        # Azure SQL configuration
        self.azure_sql_url = os.getenv("AZURE_SQL_URL")
        self.azure_sql_user = os.getenv("AZURE_SQL_USER")
        self.azure_sql_pass = os.getenv("AZURE_SQL_PASS")

        # Google Drive configuration
        self.gdrive_folder_id = os.getenv("GDRIVE_FOLDER_ID")
        self.gdrive_credentials_path = os.getenv("GDRIVE_CREDENTIALS_PATH")

        # Processing configuration
        self.batch_size = int(os.getenv("BATCH_SIZE", "5000"))
        self.max_workers = int(os.getenv("MAX_WORKERS", "4"))

        # Load YAML configurations
        self._load_configs()

    def _load_configs(self):
        """Load YAML configuration files"""
        try:
            # Load table mappings
            with open(self.configs_path / "tables.yaml", 'r') as f:
                self.tables = yaml.safe_load(f)

            # Load dimension configurations
            with open(self.configs_path / "dims.yaml", 'r') as f:
                self.dims = yaml.safe_load(f)

            # Load feature flags
            with open(self.configs_path / "features.yaml", 'r') as f:
                self.features = yaml.safe_load(f)
        except FileNotFoundError as e:
            print(f"Warning: Configuration file not found: {e}")
            self.tables = {}
            self.dims = {}
            self.features = {}

    def validate_supabase_config(self, require_service_role: bool = False) -> bool:
        """Validate Supabase configuration"""
        if not self.supabase_url or not self.supabase_anon_key:
            return False

        if require_service_role and not self.supabase_service_role:
            return False

        return True

    def validate_azure_config(self) -> bool:
        """Validate Azure SQL configuration"""
        return all([
            self.azure_sql_url,
            self.azure_sql_user,
            self.azure_sql_pass
        ])

    def get_table_config(self, table_name: str) -> Optional[Dict[str, Any]]:
        """Get configuration for specific table"""
        return self.tables.get(table_name)

    def get_feature_flag(self, flag_name: str, default: bool = False) -> bool:
        """Get feature flag value"""
        return self.features.get(flag_name, default)

    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.environment.lower() == "production"

# Global configuration instance
cfg = Config()