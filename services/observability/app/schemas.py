from datetime import datetime, timezone

from pydantic import BaseModel, Field


def _now() -> datetime:
    return datetime.now(timezone.utc)


class LogEntry(BaseModel):
    service: str
    level: str = "INFO"
    message: str
    timestamp: datetime = Field(default_factory=_now)


class Metric(BaseModel):
    service: str
    name: str
    value: float
    timestamp: datetime = Field(default_factory=_now)


class ServiceStatus(BaseModel):
    service: str
    healthy: bool
    detail: str | None = None
