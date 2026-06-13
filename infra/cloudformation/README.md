# Infrastructure — CloudFormation

Single-stack provisioning for the IIS platform:

```
API Gateway (HTTP API)
  └─ VPC Link ──> internal ALB ──path rules──> ECS Fargate services
                                                  └─> RDS PostgreSQL
```

## What the template creates

- **VPC** with 2 public + 2 private subnets, IGW, single NAT gateway, route tables.
- **Security groups** chained least-privilege:
  VPC Link → ALB(:80) → ECS(:8000) → RDS(:5432).
- **RDS PostgreSQL** (private, encrypted), with master credentials stored in
  **Secrets Manager** and injected into tasks as `DB_USER` / `DB_PASSWORD`.
- **ECS Fargate cluster** with a task definition + service + target group +
  ALB listener rule for each of `iam`, `campus`, `commerce`, `observability`.
- **Internal ALB** routing by path (`/iam/*`, `/campus/*`, …).
- **API Gateway HTTP API** with a **VPC Link** private integration to the ALB,
  exposing `ANY /<service>/{proxy+}` routes on the `$default` stage.

## Prerequisites

1. ECR images must exist before the ECS services can pull them. Either let the
   first CircleCI run push `:latest`, or build/push manually:
   ```bash
   ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
   for s in iam campus commerce observability; do
     aws ecr create-repository --repository-name "iis-$s" 2>/dev/null || true
     docker build -t "$REGISTRY/iis-$s:latest" "services/$s"
     aws ecr get-login-password | docker login --username AWS --password-stdin "$REGISTRY"
     docker push "$REGISTRY/iis-$s:latest"
   done
   ```

## Deploy

```bash
cp infra/cloudformation/parameters.example.json infra/cloudformation/parameters.json
# edit parameters.json — set EcrRegistry and a strong DBPassword

aws cloudformation deploy \
  --template-file infra/cloudformation/template.yaml \
  --stack-name iis-dev \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides file://infra/cloudformation/parameters.json
```

> `parameters.json` is git-ignored because it contains the DB password. For real
> environments, prefer `--parameter-overrides DBPassword=...` from a secret store
> or use a dynamic reference instead of a plaintext value.

## After deploy

```bash
aws cloudformation describe-stacks --stack-name iis-dev \
  --query 'Stacks[0].Outputs' --output table
```

Test the public endpoint (`ApiEndpoint` output):

```bash
API=$(aws cloudformation describe-stacks --stack-name iis-dev \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" --output text)
curl "$API/iam/health"          # -> proxied to the iam service /health
curl "$API/commerce/invoices"
```

## CircleCI wiring

The pipeline provisions this stack automatically: the `provision_infra` job runs
`aws cloudformation deploy` against `iis-${ENVIRONMENT}`, **creating the stack if it
does not exist** and otherwise applying changes. It passes `ImageTag=$CIRCLE_SHA1`,
so CloudFormation updates the ECS task definitions and rolls out the new images — no
manual `cloudformation deploy` is required after the first setup.

Set these on a CircleCI **Context** named `aws-iis` (referenced in `.circleci/config.yml`):

| Variable             | Source                                                        |
|----------------------|--------------------------------------------------------------|
| `AWS_REGION`         | your region, e.g. `us-east-1`                                 |
| `ENVIRONMENT`        | stack name + `EnvironmentName` (e.g. `dev` → stack `iis-dev`) |
| `DB_PASSWORD`        | RDS master password (≥ 8 chars); must stay constant across runs |
| `DB_USERNAME`        | (optional) RDS master username; defaults to `iis_admin`      |
| `AWS_OIDC_ROLE_ARN`  | IAM role for CircleCI OIDC (or use access-key env vars)      |

> The very first push to `main` creates the entire stack end-to-end: images are built
> and pushed to ECR, then `provision_infra` stands up the VPC, ALB, RDS, ECS cluster,
> and services. The manual `cloudformation deploy` below is only needed if you prefer
> to provision before the first CI run.

## Teardown

```bash
aws cloudformation delete-stack --stack-name iis-dev
```

The RDS instance has `DeletionPolicy: Snapshot`, so a final snapshot is taken on
delete. ECR repositories are created outside this stack and are not removed.
