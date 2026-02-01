variable "access_key" {
    description = "AWS access key"
    type        = string
    sensitive   = true
}

variable "secret_key" {
    description = "AWS secret key"
    type        = string
    sensitive   = true
}

variable "region" {
    description = "AWS region"
    type        = string
}

variable "raw_bucket_name" {
    description = "AWS raw video upload bucket"
    type        = string
    default     = "raw-videos"
}

variable "processed_bucket_name" {
    description = "AWS processed video bucket"
    type        = string
    default     = "processed-videos"
}

variable "sqs_queue_name" {
    description = "SQS queue name for video upload events"
    type        = string
    default     = "video-upload-events"
}

variable "ecr_repository_name" {
    description = "ECR repository name for video transcoder"
    type        = string
    default     = "video-transcoder-repository"
}

variable "ecs_cluster_name" {
    description = "ECS cluster name for video transcoding"
    type        = string
    default     = "video-transcoding-cluster"
}

variable "ecs_task_execution_role" {
    description = "ECS role for task execution for video transcoding"
    type        = string
    default     = "video-transcoding-ecsTaskExecutionRole"
}

variable "ecs_task_role" {
    description = "ECS role for task container to access AWS services"
    type        = string
    default     = "video-transcoding-ecsTaskRole"
}

variable "cloudfront_distribution_comment" {
    description = "Comment for CloudFront distribution"
    type        = string
    default     = "HLS Video Streaming Distribution"
}

variable "cloudfront_price_class" {
    description = "CloudFront price class"
    type        = string
    default     = "PriceClass_100"
}

variable "cloudfront_public_key_path" {
    description = "Path to CloudFront public key file"
    type        = string
    default     = "./certs/cloudfront_public_key.pem"
}