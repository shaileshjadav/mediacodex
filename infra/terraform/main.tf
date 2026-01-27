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


# 1. The task execution role is responsible for having access to the container in ECR and giving access to run the task itself,
# 2. The task role is responsible for your docker container making API requests to other authorized AWS services.

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = var.ecs_task_execution_role

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      /* ECS tasks must “assume” an IAM role at runtime to get temporary credentials, 
      and AWS requires explicit permission for that via sts:AssumeRole.
      */
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

/**
  assume_role_policy = WHO can use the role
  policy = WHAT the role is allowed to do
**/

resource "aws_iam_role" "ecs_task_role" {
  name = var.ecs_task_role

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      /* ECS tasks must “assume” an IAM role at runtime to get temporary credentials, 
      and AWS requires explicit permission for that via sts:AssumeRole.
      */
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

resource "aws_iam_policy" "ecs_s3_policy" {
  name = "video-transcoder-s3-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ReadRawBucket"
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.raw_bucket.arn}/*"
      },
      {
        Sid      = "ListRawBucket"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = "${aws_s3_bucket.raw_bucket.arn}"
      },
      {
        Sid      = "WriteProcessedBucket"
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = "${aws_s3_bucket.processed_bucket.arn}/*"
      }
    ]
  })
}


# Attach policy to ECS Task Execution Role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  #  ECS is allowed to pull images, write logs, and inject secrets
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" # this is AWS-managed service role policy
}

# Attach policy to ECS Task Role
resource "aws_iam_role_policy_attachment" "ecs_task_role_policy" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_s3_policy.arn
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/video-transcoder"
  retention_in_days = 7
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
  task_role_arn            = aws_iam_role.ecs_task_role.arn
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

# Block public access to processed bucket (CloudFront will access via OAC)
resource "aws_s3_bucket_public_access_block" "processed_bucket_public_access_block" {
  bucket = aws_s3_bucket.processed_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Control for S3 for restricts bucket access to only CloudFront
resource "aws_cloudfront_origin_access_control" "processed_bucket_oac" {
  name                              = "processed-bucket-oac"
  description                       = "Origin Access Control for processed videos bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}


# CloudFront Public Key (for signed URLs)
resource "aws_cloudfront_public_key" "hls_public_key" {
  count       = 1
  name        = "hls-streaming-public-key"
  encoded_key = file(var.cloudfront_public_key_path)
  comment     = "Public key for HLS streaming signed URLs"
}

# CloudFront Key Group
resource "aws_cloudfront_key_group" "hls_key_group" {
  count   = 1
  name    = "hls-streaming-key-group"
  comment = "Key group for HLS streaming signed URLs"
  items   = [aws_cloudfront_public_key.hls_public_key[0].id]
}


# CloudFront Distribution for HLS Streaming
resource "aws_cloudfront_distribution" "hls_distribution" {
  origin {
    domain_name              = aws_s3_bucket.processed_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.processed_bucket_oac.id
    origin_id                = "S3-${aws_s3_bucket.processed_bucket.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = var.cloudfront_distribution_comment
  default_root_object = "index.html"

  # Cache behavior for HLS files (.m3u8 and .ts)
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.processed_bucket.id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true

    # Enable signed URLs if key group is created
    trusted_key_groups = [aws_cloudfront_key_group.hls_key_group[0].id]
  }

  # Specific cache behavior for .m3u8 files (shorter TTL for playlist updates)
  ordered_cache_behavior {
    path_pattern     = "*.m3u8"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.processed_bucket.id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 5
    max_ttl                = 60
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    # Enable signed URLs if key group is created
    trusted_key_groups = [aws_cloudfront_key_group.hls_key_group[0].id]
  }

  # Cache behavior for .ts segments (longer TTL as they don't change)
  ordered_cache_behavior {
    path_pattern     = "*.ts"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.processed_bucket.id}"

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    # Enable signed URLs if key group is created
    trusted_key_groups = [aws_cloudfront_key_group.hls_key_group[0].id]
  }

  price_class = var.cloudfront_price_class

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name        = "HLS-Streaming-Distribution"
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# S3 Bucket Policy to allow CloudFront OAC access
resource "aws_s3_bucket_policy" "processed_bucket_policy" {
  bucket = aws_s3_bucket.processed_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.processed_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.hls_distribution.arn
          }
        }
      }
    ]
  })
}

# Additional CloudFront outputs
output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.hls_distribution.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.hls_distribution.arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.hls_distribution.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront Route 53 zone ID"
  value       = aws_cloudfront_distribution.hls_distribution.hosted_zone_id
}

