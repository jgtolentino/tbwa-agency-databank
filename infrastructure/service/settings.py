from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application settings using pydantic for environment variable management"""
    
    # Supabase configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    
    # PGVector configuration
    PGVECTOR_URL: Optional[str] = None
    
    # Model configuration
    MODEL_PATH: str = "models/ckpt.pt"
    
    # API configuration
    API_TOKEN: Optional[str] = None
    RETURN_EMBEDDINGS: bool = False
    
    # Service configuration
    LOG_LEVEL: str = "INFO"
    MAX_WORKERS: int = 4
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"