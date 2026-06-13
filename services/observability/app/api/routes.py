"""Observability domain routes — log/metric ingestion and service status.

In-memory ring buffers back the demo endpoints. In production, forward to
CloudWatch / a time-series store and query downstream service health.
"""

from collections import deque

import httpx
from fastapi import APIRouter

from app.schemas import LogEntry, Metric, ServiceStatus

router = APIRouter(tags=["observability"])

_MAX = 1000
_logs: deque[LogEntry] = deque(maxlen=_MAX)
_metrics: deque[Metric] = deque(maxlen=_MAX)

# Internal ALB routes each service is reachable on (same VPC).
_DOWNSTREAM = {
    "iam": "http://localhost:8000/health",
    "campus": "http://localhost:8000/health",
    "commerce": "http://localhost:8000/health",
}


@router.post("/logs", response_model=LogEntry, status_code=201)
async def ingest_log(entry: LogEntry) -> LogEntry:
    _logs.append(entry)
    return entry


@router.get("/logs", response_model=list[LogEntry])
async def list_logs(limit: int = 100) -> list[LogEntry]:
    return list(_logs)[-limit:]


@router.post("/metrics", response_model=Metric, status_code=201)
async def ingest_metric(metric: Metric) -> Metric:
    _metrics.append(metric)
    return metric


@router.get("/metrics", response_model=list[Metric])
async def list_metrics(limit: int = 100) -> list[Metric]:
    return list(_metrics)[-limit:]


@router.get("/status", response_model=list[ServiceStatus])
async def status() -> list[ServiceStatus]:
    """Probe downstream services and report their health."""
    results: list[ServiceStatus] = []
    async with httpx.AsyncClient(timeout=3.0) as client:
        for name, url in _DOWNSTREAM.items():
            try:
                resp = await client.get(url)
                results.append(
                    ServiceStatus(service=name, healthy=resp.status_code == 200)
                )
            except httpx.HTTPError as exc:
                results.append(
                    ServiceStatus(service=name, healthy=False, detail=str(exc))
                )
    return results
