from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True


class User(UserCreate):
    id: str


class Role(BaseModel):
    id: str
    name: str
    permissions: list[str] = Field(default_factory=list)


class TokenRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
