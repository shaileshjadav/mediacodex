import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import type { S3Event } from "aws-lambda";

import { transcodeVideo } from "./dockerode";
import { insertVideo } from "../api/services/video.service";
import { InsertedVideo } from "../types/video.types";

const client = new SQSClient({
  region: process.env.AWS_REGION,
  endpoint: "http://localhost:4566", // For localstack
});

const extractIdFromPath = (path: string) => {
  const fileName = path.split("/").pop() || '';
  return fileName.split(".")[0];
}

export async function init() {
  const queueName = process.env.AWS_SQS_QUEUE_NAME;
  if (!queueName) {
    throw new Error("queueName is not defined!");
  }
  const queueUrl = process.env.AWS_SQS_URL;
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  });

  while (true) {
    const { Messages } = await client.send(command);
    console.log("Messages", Messages);
    if (!Messages) {
      console.log("no message found");
      continue;
    }
    for (const message of Messages) {
      const { MessageId, Body, ReceiptHandle } = message;

      // validate event
      if (!Body) continue;

      const event = JSON.parse(Body) as S3Event;

      if ("Service" in event && "Event" in event) {
        // ignore the test event
        if (event.Event === "s3:TestEvent") continue;
      }

      for (const record of event.Records) {
        const { s3 } = record;
        const {
          bucket,
          object: { key },
        } = s3;
        console.log(`New video uploaded: ${bucket.name}/${key}`);

        const rawBucket = process.env.AWS_RAW_BUCKET;
        if (!rawBucket) throw new Error('AWS_RAW_BUCKET env var is required');

        const processedBucket = process.env.AWS_PROCESSED_BUCKET;
        if (!processedBucket) throw new Error('AWS_PROCESSED_BUCKET env var is required');

        const awsRegion = process.env.AWS_REGION;
        if (!awsRegion) throw new Error('AWS_REGION env var is required');


        const videoId = extractIdFromPath(key);
        // Spin container
        await transcodeVideo(
          key,
          rawBucket,
          processedBucket,
          awsRegion
        );
        
        const videoData = insertVideo({
          //TODO: make dynmaic after auth-flow
          userId: '1',
          videoId,
          status: 'PROCESSING',
        })
      }

      //  Delete message from queue
      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle,
      };
      const command = new DeleteMessageCommand(deleteParams);
      const data = await client.send(command);
    }
  }
}
