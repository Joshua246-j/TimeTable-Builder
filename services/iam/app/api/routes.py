"""IAM domain routes.

In-memory stores back the demo endpoints. Swap them for the SQLAlchemy
`get_session` dependency (see app.core.database) to persist to RDS.
"""

from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.schemas import Role, Token, TokenRequest, User, UserCreate

router = APIRouter(tags=["iam"])

_users: dict[str, User] = {}
_roles: dict[str, Role] = {}


@router.get("/users", response_model=list[User])
async def list_users() -> list[User]:
    return list(_users.values())


@router.post("/users", response_model=User, status_code=201)
async def create_user(payload: UserCreate) -> User:
    user = User(id=str(uuid4()), **payload.model_dump())
    _users[user.id] = user
    return user


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str) -> User:
    if user_id not in _users:
        raise HTTPException(status_code=404, detail="user not found")
    return _users[user_id]


@router.get("/roles", response_model=list[Role])
async def list_roles() -> list[Role]:
    return list(_roles.values())


@router.post("/roles", response_model=Role, status_code=201)
async def create_role(role: Role) -> Role:
    _roles[role.id] = role
    return role


@router.post("/token", response_model=Token)
async def issue_token(req: TokenRequest) -> Token:
    # NOTE: demo only — replace with real credential verification and JWT signing.
    if not req.username or not req.password:
        raise HTTPException(status_code=400, detail="username and password required")
    return Token(access_token=f"demo.{uuid4().hex}", token_type="bearer")
