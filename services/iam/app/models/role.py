from pydantic import BaseModel, Field


class Role(BaseModel):
    id: str
    name: str
    permissions: list[str] = Field(default_factory=list)
