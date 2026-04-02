import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")

settings = Settings()
