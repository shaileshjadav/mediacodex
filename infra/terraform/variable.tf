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
