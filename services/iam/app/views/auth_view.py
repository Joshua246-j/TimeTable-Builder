"""Authentication HTTP endpoints — thin layer delegating to AuthController."""

from fastapi import APIRouter

from app.controllers.auth_controller import auth_controller
from app.models import Token, TokenRequest

router = APIRouter(tags=["auth"])


@router.post("/token", response_model=Token)
async def issue_token(req: TokenRequest) -> Token:
    return auth_controller.issue_token(req)
