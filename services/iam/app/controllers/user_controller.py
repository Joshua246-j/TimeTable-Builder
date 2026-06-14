"""User business logic.

An in-memory store backs the demo. Swap `_users` for a repository over the
SQLAlchemy `get_session` dependency (see app.core.database) to persist to RDS.
"""

from uuid import uuid4

from app.core.exceptions import NotFoundError
from app.models import User, UserCreate, UserUpdate


class UserController:
    def __init__(self) -> None:
        self._users: dict[str, User] = {}

    def list(self) -> list[User]:
        return list(self._users.values())

    def create(self, payload: UserCreate) -> User:
        user = User(id=str(uuid4()), **payload.model_dump())
        self._users[user.id] = user
        return user

    def get(self, user_id: str) -> User:
        user = self._users.get(user_id)
        if user is None:
            raise NotFoundError("user not found")
        return user

    def update(self, user_id: str, payload: UserUpdate) -> User:
        user = self.get(user_id)
        updated = user.model_copy(update=payload.model_dump(exclude_unset=True))
        self._users[user_id] = updated
        return updated

    def delete(self, user_id: str) -> None:
        if self._users.pop(user_id, None) is None:
            raise NotFoundError("user not found")


user_controller = UserController()
