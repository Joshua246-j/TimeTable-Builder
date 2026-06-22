"""User HTTP endpoints — thin layer delegating to UserController."""

from fastapi import APIRouter

from app.controllers.user_controller import user_controller
from app.models import User, UserCreate, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[User])
async def list_users() -> list[User]:
    return user_controller.list()


@router.post("", response_model=User, status_code=201)
async def create_user(payload: UserCreate) -> User:
    return user_controller.create(payload)


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str) -> User:
    return user_controller.get(user_id)


@router.patch("/{user_id}", response_model=User)
async def update_user(user_id: str, payload: UserUpdate) -> User:
    return user_controller.update(user_id, payload)


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: str) -> None:
    user_controller.delete(user_id)
