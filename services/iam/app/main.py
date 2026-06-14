import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import check_db, lifespan
from app.core.exceptions import DomainError
from app.views import router

logging.basicConfig(level=settings.log_level)

app = FastAPI(
    title=f"IIS {settings.service_name} service",
    version=settings.version,
    lifespan=lifespan,
)


@app.exception_handler(DomainError)
async def handle_domain_error(_: Request, exc: DomainError) -> JSONResponse:
    """Map controller-raised domain errors to HTTP responses."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


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
