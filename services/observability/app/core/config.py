from functools import cached_property

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    service_name: str = "observability"
    route_prefix: str = "/observability"
    version: str = "0.1.0"
    log_level: str = "INFO"

    # Full DSN takes precedence; otherwise it is assembled from the parts below.
    database_url: str | None = None
    db_host: str | None = None
    db_port: int = 5432
    db_name: str = "iis"
    db_user: str | None = None
    db_password: str | None = None

    @cached_property
    def sqlalchemy_url(self) -> str:
        if self.database_url:
            return self.database_url
        if self.db_host and self.db_user:
            return (
                f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
                f"@{self.db_host}:{self.db_port}/{self.db_name}"
            )
        # Local fallback for running the service standalone.
        return "postgresql+asyncpg://postgres:postgres@localhost:5432/observability"


settings = Settings()
