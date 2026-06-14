"""Domain errors raised by controllers.

Controllers stay HTTP-agnostic by raising these; a single handler in
`app.main` maps them to responses (see DomainError.status_code).
"""


class DomainError(Exception):
    status_code: int = 400

    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)


class NotFoundError(DomainError):
    status_code = 404


class BadRequestError(DomainError):
    status_code = 400
