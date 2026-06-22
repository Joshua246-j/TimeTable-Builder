# iam service

Identity & Access — users, roles, token issuance.

Domain endpoints are served under the `/iam` prefix; `/health` and `/ready`
sit at the root for ALB/ECS probes.

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
