import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const config: S3ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const isLocalstack = process.env.AWS_ENDPOINT_MODE === "localstack";

if (isLocalstack) {
  config.endpoint = process.env.AWS_ENDPOINT_URL;
  config.forcePathStyle = true;
}

export const s3Client = new S3Client(config);
