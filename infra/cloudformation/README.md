# Infrastructure — CloudFormation

Single-stack provisioning for the IIS platform:

```
API Gateway (HTTP API)
  └─ VPC Link ──> internal ALB ──path rules──> ECS Fargate services
                                                  └─> Aurora Serverless v2 (PostgreSQL)
```

## What the template creates

- **VPC** with 2 public + 2 private subnets, IGW, single NAT gateway, route tables.
- **Security groups** chained least-privilege:
  VPC Link → ALB(:80) → ECS(:8000) → Aurora(:5432).
- **Aurora Serverless v2 (PostgreSQL)** cluster + `db.serverless` instance, private
  and encrypted, scaling between `AuroraMinCapacity` and `AuroraMaxCapacity` ACUs.
- **ECS Fargate cluster** with a task definition + service + target group +
  ALB listener rule for each of `iam`, `campus`, `commerce`, `observability`.
- **Internal ALB** routing by path (`/iam/*`, `/campus/*`, …).
- **API Gateway HTTP API** with a **VPC Link** private integration to the ALB,
  exposing `ANY /<service>/{proxy+}` routes on the `$default` stage.

## Database password handling (per environment)

The `IsProd` condition (`EnvironmentName == prod`) switches the secrets backend:

| | Non-prod (`dev`, `staging`, …) | Prod |
|---|---|---|
| Backend | **SSM SecureString** `/iis/<env>/db-password` ($0) | **Secrets Manager**, Aurora-managed |
| Rotation | manual | automatic (Aurora `ManageMasterUserPassword`) |
| Aurora master password | `MasterUserPassword` from the `DBPassword` param | generated + owned by Aurora |
| ECS reads `DB_PASSWORD` from | the SSM SecureString ARN | the managed secret ARN |
| ECS reads `DB_USER` from | plain env (`DBUsername`) | the managed secret (`:username::`) |
| Exec-role grant | `ssm:GetParameters` + `kms:Decrypt` | `secretsmanager:GetSecretValue` |

> CloudFormation cannot create `SecureString` SSM parameters, so for non-prod the
> GitHub Actions `provision_infra` job writes `/iis/<env>/db-password` with
> `aws ssm put-parameter --type SecureString` **before** `cloudformation deploy`.
> For a manual non-prod deploy, create that parameter yourself first (see below).

## Prerequisites

1. ECR images must exist before the ECS services can pull them. Either let the
   first GitHub Actions run push `:latest`, or build/push manually:
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

## Deploy (manual)

**Non-prod** — create the SSM SecureString first, then deploy:

```bash
aws ssm put-parameter \
  --name "/iis/dev/db-password" --type SecureString \
  --value "CHANGE_ME_strong_password" --overwrite

aws cloudformation deploy \
  --template-file infra/cloudformation/template.yaml \
  --stack-name iis-dev \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EnvironmentName=dev \
    EcrRegistry=123456789012.dkr.ecr.us-east-1.amazonaws.com \
    DBPassword=CHANGE_ME_strong_password
```

**Prod** — no password needed; Aurora manages it in Secrets Manager:

```bash
aws cloudformation deploy \
  --template-file infra/cloudformation/template.yaml \
  --stack-name iis-prod \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EnvironmentName=prod \
    EcrRegistry=123456789012.dkr.ecr.us-east-1.amazonaws.com
```

> In normal operation GitHub Actions does all of this for you (see below). The
> `parameters.example.json` file is provided for reference; `parameters.json` is
> git-ignored so it never holds a plaintext password.

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

## GitHub Actions wiring

The pipeline provisions this stack automatically on pushes to the **`deployment`**
branch: the `provision_infra` job runs `aws cloudformation deploy` against
`iis-${ENVIRONMENT}`, **creating the stack if it does not exist** and otherwise
applying changes. It passes `ImageTag=$GITHUB_SHA`, so CloudFormation updates the ECS
task definitions and rolls out the new images — no manual `cloudformation deploy` is
required after the first setup.

Configure these under **Settings → Secrets and variables → Actions**
(referenced in `.github/workflows/deploy.yml`):

| Name                 | Kind     | Source                                                       |
|----------------------|----------|--------------------------------------------------------------|
| `AWS_REGION`         | Variable | your region, e.g. `us-east-1`                                |
| `ENVIRONMENT`        | Variable | stack name + `EnvironmentName` (e.g. `dev` → stack `iis-dev`) |
| `DB_USERNAME`        | Variable | (optional) Aurora master username; defaults to `iis_admin`   |
| `AWS_OIDC_ROLE_ARN`  | Secret   | IAM role assumed via GitHub OIDC                             |
| `DB_PASSWORD`        | Secret   | Aurora master password (≥ 8 chars). **Non-prod only** — written to SSM each run. Not needed for `prod`. |

AWS auth uses GitHub OIDC (`aws-actions/configure-aws-credentials`); the assumed role's
trust policy must allow this repo's `token.actions.githubusercontent.com` subject. The
role additionally needs `ssm:PutParameter` (non-prod, to write the SecureString) and
`cloudformation:*` / `iam:*` / service permissions to create the stack.

> The very first push to `deployment` creates the entire stack end-to-end: images are
> built and pushed to ECR, then `provision_infra` stands up the VPC, ALB, Aurora, ECS
> cluster, and services. The manual `cloudformation deploy` above is only needed if you
> prefer to provision before the first CI run.

## Teardown

```bash
aws cloudformation delete-stack --stack-name iis-dev
```

The Aurora cluster has `DeletionPolicy: Snapshot`, so a final snapshot is taken on
delete. ECR repositories and the non-prod SSM SecureString are created outside this
stack and are not removed automatically:

```bash
aws ssm delete-parameter --name "/iis/dev/db-password"   # non-prod only
```
