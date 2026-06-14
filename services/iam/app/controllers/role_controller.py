"""Role business logic (in-memory demo store)."""

from app.models import Role


class RoleController:
    def __init__(self) -> None:
        self._roles: dict[str, Role] = {}

    def list(self) -> list[Role]:
        return list(self._roles.values())

    def create(self, role: Role) -> Role:
        self._roles[role.id] = role
        return role


role_controller = RoleController()
