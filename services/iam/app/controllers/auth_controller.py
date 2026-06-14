"""Authentication business logic."""

from uuid import uuid4

from app.core.exceptions import BadRequestError
from app.models import Token, TokenRequest


class AuthController:
    def issue_token(self, req: TokenRequest) -> Token:
        # NOTE: demo only — replace with real credential verification and JWT signing.
        if not req.username or not req.password:
            raise BadRequestError("username and password required")
        return Token(access_token=f"demo.{uuid4().hex}", token_type="bearer")


auth_controller = AuthController()
