import logging

from fastapi import FastAPI

from app.api.routes import router
from app.core.config import settings
from app.core.database import check_db, lifespan

logging.basicConfig(level=settings.log_level)

app = FastAPI(
    title=f"IIS {settings.service_name} service",
    version=settings.version,
    lifespan=lifespan,
)


@app.get("/health", tags=["system"])
async def health() -> dict:
    """Liveness probe used by the ALB target group health check."""
    return {"status": "ok", "service": settings.service_name, "version": settings.version}


@app.get("/ready", tags=["system"])
async def ready() -> dict:
    """Readiness probe — verifies database connectivity."""
    db_ok = await check_db()
    return {"status": "ok" if db_ok else "degraded", "database": db_ok}


app.include_router(router, prefix=settings.route_prefix)
