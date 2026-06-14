"""Aggregates the per-resource routers into one IAM router."""

from fastapi import APIRouter

from app.views import auth_view, role_view, user_view

router = APIRouter()
router.include_router(user_view.router)
router.include_router(role_view.router)
router.include_router(auth_view.router)
