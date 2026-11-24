from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings read from environment variables or backend/.env (prefix ROOTLINE_)."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="ROOTLINE_")

    app_name: str = "Rootline API"
    # Vite dev server and preview server.
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:4173"]
    max_upload_mb: int = 10


settings = Settings()
