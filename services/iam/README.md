# iam service

Identity & Access — users, roles, token issuance.

Domain endpoints are served under the `/iam` prefix; `/health` and `/ready`
sit at the root for ALB/ECS probes.

## Structure (MVC)

```
app/
  models/        # M — Pydantic data models, one module per resource
  controllers/   # C — business logic, HTTP-agnostic (raise app.core.exceptions)
  views/         # V — thin APIRouters delegating to controllers
  core/          # config, database, domain exceptions
```

`app.core.exceptions.DomainError` subclasses carry a `status_code`; a single
handler in `app.main` maps them to responses, so controllers stay decoupled
from FastAPI.

### Endpoints

| Method | Path              | Purpose             |
|--------|-------------------|---------------------|
| GET    | `/iam/users`      | List users          |
| POST   | `/iam/users`      | Create user         |
| GET    | `/iam/users/{id}` | Get user            |
| PATCH  | `/iam/users/{id}` | Partial-update user |
| DELETE | `/iam/users/{id}` | Delete user         |
| GET    | `/iam/roles`      | List roles          |
| POST   | `/iam/roles`      | Create role         |
| POST   | `/iam/token`      | Issue token (demo)  |

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# docs: http://localhost:8000/docs
```

## Test

```bash
pip install pytest
pytest -q
```

## Configuration (environment variables)

| Variable        | Default        | Notes                                   |
|-----------------|----------------|-----------------------------------------|
| `SERVICE_NAME`  | `iam`           | Reported in /health                     |
| `ROUTE_PREFIX`  | `/iam`          | Path prefix for domain routes           |
| `DATABASE_URL`  | —              | Full async DSN; overrides DB_* parts    |
| `DB_HOST`       | —              | RDS endpoint                            |
| `DB_PORT`       | `5432`         |                                         |
| `DB_NAME`       | `iis`          |                                         |
| `DB_USER`       | —              | Injected from Secrets Manager on ECS    |
| `DB_PASSWORD`   | —              | Injected from Secrets Manager on ECS    |
| `LOG_LEVEL`     | `INFO`         |                                         |
