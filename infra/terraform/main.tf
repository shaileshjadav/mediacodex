# S3 Buckets
resource "aws_s3_bucket" "raw_bucket" {
  bucket = var.raw_bucket_name
}

resource "aws_s3_bucket" "processed_bucket" {
  bucket = var.processed_bucket_name
}

# CORS Configuration for raw bucket
resource "aws_s3_bucket_cors_configuration" "raw_bucket_cors" {
  bucket = aws_s3_bucket.raw_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
  }
}

# CORS Configuration for processed bucket
resource "aws_s3_bucket_cors_configuration" "processed_bucket_cors" {
  bucket = aws_s3_bucket.processed_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
  }
}

# ECR Repository
resource "aws_ecr_repository" "video_transcoder_repository" {
  name = var.ecr_repository_name
}

# ECS Cluster
resource "aws_ecs_cluster" "video_transcoding_cluster" {
  name = var.ecs_cluster_name
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = var.ecs_iam_task_role

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Attach policy to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/video-transcoder"
  retention_in_days = 7
}

# ECS Task Definition
resource "aws_ecs_task_definition" "video_transcoder_task" {
  family                   = "video-transcoder-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "transcoder"
      image     = "${aws_ecr_repository.video_transcoder_repository.repository_url}:latest"
      essential = true
      environment = [
        {
          name  = "INPUT_BUCKET"
          value = var.raw_bucket_name
        },
        {
          name  = "OUTPUT_BUCKET"
          value = var.processed_bucket_name
        },
        {
          name  = "AWS_REGION"
          value = var.region
        },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  depends_on = [
    aws_cloudwatch_log_group.ecs_log_group,
    aws_iam_role_policy_attachment.ecs_task_execution_role_policy
  ]
}

# SQS Queue
resource "aws_sqs_queue" "video_upload_events" {
  name = var.sqs_queue_name
}

# SQS Queue Policy to allow S3 to send messages
resource "aws_sqs_queue_policy" "video_upload_events_policy" {
  queue_url = aws_sqs_queue.video_upload_events.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.video_upload_events.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_s3_bucket.raw_bucket.arn
          }
        }
      }
    ]
  })
}

# S3 Bucket Notification Configuration
resource "aws_s3_bucket_notification" "raw_bucket_notification" {
  bucket = aws_s3_bucket.raw_bucket.id

  queue {
    queue_arn = aws_sqs_queue.video_upload_events.arn
    events    = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_sqs_queue_policy.video_upload_events_policy]
}

# ECS Task Definition for Video Transcoding
resource "aws_ecs_task_definition" "video_transcoder_task" {
  family                   = "video-transcoder-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  # runtime_platform {
  #   operating_system_family = "LINUX"
  #   cpu_architecture        = "X86_64"
  # }
  
  container_definitions = jsonencode([
    {
      name      = "transcoder"
      image     = "${aws_ecr_repository.video_transcoder_repository.repository_url}:latest"
      essential = true
      
      environment = [
        {
          name  = "INPUT_BUCKET"
          value = aws_s3_bucket.raw_bucket.id
        },
        {
          name  = "OUTPUT_BUCKET"
          value = aws_s3_bucket.processed_bucket.id
        },
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# Outputs
output "raw_bucket_name" {
  description = "Name of the raw videos bucket"
  value       = aws_s3_bucket.raw_bucket.id
}

output "processed_bucket_name" {
  description = "Name of the processed videos bucket"
  value       = aws_s3_bucket.processed_bucket.id
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.video_transcoder_repository.repository_url
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.video_transcoder_repository.name
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.video_transcoding_cluster.name
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.video_transcoder_task.arn
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.video_upload_events.url
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue"
  value       = aws_sqs_queue.video_upload_events.arn
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.video_transcoder_task.arn
}

