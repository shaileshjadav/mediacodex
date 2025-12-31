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

# Outputs
output "raw_bucket_name" {
  description = "Name of the raw videos bucket"
  value       = aws_s3_bucket.raw_bucket.id
}

output "processed_bucket_name" {
  description = "Name of the processed videos bucket"
  value       = aws_s3_bucket.processed_bucket.id
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.video_upload_events.url
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue"
  value       = aws_sqs_queue.video_upload_events.arn
}

