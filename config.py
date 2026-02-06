"""
Configuration management for BizRoute application.
Loads environment variables and provides centralized config access.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration class."""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # API Keys
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
    TOMTOM_API_KEY = os.getenv('TOMTOM_API_KEY')
    AQICN_API_KEY = os.getenv('AQICN_API_KEY')
    
    # Database configuration
    DB_CONFIG = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'bizroute')
    }
    
    @staticmethod
    def validate():
        """Validate that all required configuration is present."""
        required_keys = [
            'GOOGLE_MAPS_API_KEY',
            'TOMTOM_API_KEY',
            'AQICN_API_KEY'
        ]
        
        missing = []
        for key in required_keys:
            if not os.getenv(key):
                missing.append(key)
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        
        return True
