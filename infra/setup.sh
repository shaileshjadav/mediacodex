#!/bin/bash

set -e

ENDPOINT="http://localhost:4566"

echo "Creating S3 buckets..."
aws --endpoint-url=$ENDPOINT s3 mb s3://raw-videos
aws --endpoint-url=$ENDPOINT s3 mb s3://processed-videos

echo "Configuring CORS for raw-videos bucket..."
aws --endpoint-url=$ENDPOINT s3api put-bucket-cors --bucket raw-videos --cors-configuration file://cors-config.json


echo "Configuring CORS for processed-videos bucket..."
aws --endpoint-url=$ENDPOINT s3api put-bucket-cors --bucket processed-videos --cors-configuration file://cors-config.json


echo "Creating SQS queue..."
aws --endpoint-url=$ENDPOINT sqs create-queue --queue-name video-upload-events

QUEUE_URL=$(aws --endpoint-url=$ENDPOINT sqs get-queue-url \
  --queue-name video-upload-events --output text)

QUEUE_ARN=$(aws --endpoint-url=$ENDPOINT sqs get-queue-attributes \
  --queue-url $QUEUE_URL --attribute-names QueueArn --query "Attributes.QueueArn" --output text)

echo "Linking S3 event -> SQS"
aws --endpoint-url=$ENDPOINT s3api put-bucket-notification-configuration \
  --bucket raw-videos \
  --notification-configuration "{
    \"QueueConfigurations\": [
      {
        \"QueueArn\": \"$QUEUE_ARN\",
        \"Events\": [\"s3:ObjectCreated:*\"]

      }
    ]
  }"

echo "LocalStack setup completed!"
echo "Queue URL: $QUEUE_URL"
echo "Queue ARN: $QUEUE_ARN"
