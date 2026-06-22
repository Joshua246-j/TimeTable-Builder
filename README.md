# IIS Platform

Microservices platform built with **FastAPI**, containerized with **Docker**, and
deployed to **AWS ECS Fargate** behind an internal **ALB** fronted by **API Gateway**,
with **Aurora Serverless v2 (PostgreSQL)** for persistence.

## Services

| Service          | Route prefix      | Responsibility                                  |
|------------------|-------------------|-------------------------------------------------|
| `iam`            | `/iam`            | Identity, users, roles, tokens                  |
| `campus`         | `/campus`         | Students, courses, enrollments                  |
| `commerce`       | `/commerce`       | Invoices, payments                              |
| `observability`  | `/observability`  | Log/metric ingestion, service status            |

Each service is a **self-contained project** under `services/<name>/` with its own
`requirements.txt`, `Dockerfile`, and tests — independently buildable and deployable.

## Architecture

```
Client ──HTTPS──> API Gateway (HTTP API)
                      │  VPC Link (private integration)
                      ▼
              Internal ALB (path routing)
                      │  /iam/*  /campus/*  /commerce/*  /observability/*
                      ▼
            ECS Fargate services (awsvpc, private subnets)
                      │
                      ▼
        Aurora Serverless v2 · PostgreSQL (private subnets)
```

## Local development

```bash
docker compose up --build
# IAM:           http://localhost:8001/iam/...   health: /health
# campus:        http://localhost:8002/campus/...
# commerce:      http://localhost:8003/commerce/...
# observability: http://localhost:8004/observability/...
```

Run a single service without Docker:

```bash
cd services/iam
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Tests

```bash
cd services/iam && pytest -q
```

## Deploy

1. **Infra** — provision the stack (see `infra/cloudformation/README.md`):
   ```bash
   aws cloudformation deploy \
     --template-file infra/cloudformation/template.yaml \
     --stack-name iis-dev \
     --capabilities CAPABILITY_NAMED_IAM \
     --parameter-overrides file://infra/cloudformation/parameters.json
   ```
2. **CI/CD** — push to the `deployment` branch; the GitHub Actions workflow
   (`.github/workflows/deploy.yml`) tests and builds each image, pushes to ECR,
   then the `provision_infra` job runs `aws cloudformation deploy` to **create the
   stack if it is missing** (or update it), rolling out the new images via
   `ImageTag=$GITHUB_SHA`. The first push provisions the whole stack end-to-end.

See `.github/workflows/deploy.yml` for the pipeline and `infra/cloudformation/README.md`
for required parameters and the GitHub Actions secrets/variables.
