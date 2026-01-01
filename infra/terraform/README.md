# Terraform Configuration

## Setup Steps

1. **Start services**

   ```bash
   docker-compose up -d
   ```

2. **Copy the example variables file**

   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Configure your variables**
   Edit `terraform.tfvars` and update the values as needed for your environment.

3. **Apply the Terraform configuration**

   ```bash
   terraform init
   ```

   ```bash
   terraform plan
   ```

   ```bash
   terraform apply
   ```

## Docker ECR Setup (LocalStack)

After applying the Terraform configuration, you'll need to set up Docker with the ECR repository:


1. **Tag your Docker image**
   ```bash
   docker tag video-transcoder localhost:4566/video-transcoder-repository:latest
   ```

2. **Push image to ECR**
   ```bash
   docker push localhost:4566/video-transcoder-repository:latest
   ```

3. **List images in repository**
   ```bash
   aws --endpoint-url=http://localhost:4566 \
     ecr list-images --repository-name video-transcoder-repository
   ```

## ECS Setup (LocalStack)

After applying the Terraform configuration, you can set up ECS tasks manually if needed:

1. **Create ECS cluster** (if not using Terraform)
   ```bash
   aws --endpoint-url=http://localhost:4566 ecs create-cluster \
     --cluster-name video-transcoding-cluster
   ```

2. **Create IAM role** (if not using Terraform)
   ```bash
   aws --endpoint-url=http://localhost:4566 iam create-role \
     --role-name ecsTaskExecutionRole \
     --assume-role-policy-document file://ecs-task-trust.json
   ```

3. **Attach policy to role** (if not using Terraform)
   ```bash
   aws --endpoint-url=http://localhost:4566 iam attach-role-policy \
     --role-name ecsTaskExecutionRole \
     --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
   ```

4. **Register task definition**
   ```bash
   aws --endpoint-url=http://localhost:4566 ecs register-task-definition \
     --cli-input-json file://task-definition.json
   ```

5. **Verify task definition registration**
   ```bash
   aws --endpoint-url=http://localhost:4566 ecs list-task-definitions
   ```

### Configuration Files

The following JSON files are included for ECS setup:

- `ecs-task-trust.json`: IAM trust policy for ECS task execution role
- `task-definition.json`: ECS task definition for the video transcoder

**Note:** Update the bucket names and region in `task-definition.json` to match your configuration.

## Troubleshooting

### Security Token Invalid Error

If you get "The security token included in the request is invalid" errors:

1. **Ensure LocalStack is running**
   ```bash
   docker-compose ps localstack
   ```

2. **Check LocalStack health**
   ```bash
   curl http://localhost:4566/_localstack/health
   ```

3. **Restart LocalStack if needed**
   ```bash
   docker-compose restart localstack
   ```

4. **Verify services are enabled**
   LocalStack should show ECR, ECS, IAM, and CloudWatch Logs as available services.

### Region Mismatch

Ensure all configurations use the same region:
- `terraform.tfvars`: `region = "ap-south-1"`
- `docker-compose.yml`: `DEFAULT_REGION=ap-south-1`
- `task-definition.json`: `awslogs-region: "ap-south-1"`

## Prerequisites

- Terraform installed and configured
- Required credentials and permissions for your cloud provider
- Valid `terraform.tfvars` file with appropriate variable values
````
