"""Role HTTP endpoints — thin layer delegating to RoleController."""

from fastapi import APIRouter

from app.controllers.role_controller import role_controller
from app.models import Role

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("", response_model=list[Role])
async def list_roles() -> list[Role]:
    return role_controller.list()


@router.post("", response_model=Role, status_code=201)
async def create_role(role: Role) -> Role:
    return role_controller.create(role)
