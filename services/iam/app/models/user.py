from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True


class UserUpdate(BaseModel):
    """Partial update — only the fields provided are applied."""

    email: EmailStr | None = None
    full_name: str | None = None
    is_active: bool | None = None


class User(UserCreate):
    id: str
