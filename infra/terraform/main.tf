resource "aws_s3_bucket" "raw_bucket" {
  bucket =var.raw_bucket_name
}

resource "aws_s3_bucket" "processed_bucket" {
  bucket = var.processed_bucket_name
}

