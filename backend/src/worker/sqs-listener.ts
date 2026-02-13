import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import type { S3Event } from "aws-lambda";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

// import { transcodeVideo } from "./dockerode";
import { insertVideo } from "../api/services/video.service";

const config: {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
} = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};
const isLocalstack = process.env.AWS_ENDPOINT_MODE === "localstack";

if (isLocalstack) {
  config.endpoint = process.env.AWS_ENDPOINT_URL; // For localstack
}

const client = new SQSClient(config);
const ecsClient = new ECSClient(config);

const extractIdFromPath = (path: string) => {
  const fileName = path.split("/").pop() || "";
  return fileName.split(".")[0];
};

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
    
    if (!Messages) {
      continue;
    }
    for (const message of Messages) {
      const { MessageId, Body, ReceiptHandle } = message;

      // validate event
      if (!Body) continue;

      const event = JSON.parse(Body) as S3Event;

      if ("Service" in event && "Event" in event) {
        // ignore the test event
        if (event.Event === "s3:TestEvent") {
          // Delete message from queue
          await client.send(new DeleteMessageCommand({
            QueueUrl: process.env.AWS_SQS_URL,
            ReceiptHandle: message.ReceiptHandle,
          }))
          console.log("Ignored test event");
          continue;
        };
      }

      for (const record of event.Records) {
        const { s3 } = record;
        const {
          bucket,
          object: { key },
        } = s3;
        console.log(`New video uploaded: ${bucket.name}/${key}`);

        const rawBucket = process.env.AWS_RAW_BUCKET;
        if (!rawBucket) throw new Error("AWS_RAW_BUCKET env var is required");

        const processedBucket = process.env.AWS_PROCESSED_BUCKET;
        if (!processedBucket)
          throw new Error("AWS_PROCESSED_BUCKET env var is required");

        const awsRegion = process.env.AWS_REGION;
        if (!awsRegion) throw new Error("AWS_REGION env var is required");
        const [userId, fileName] = key.split('/');
        const videoId = fileName.split(".")[0];
        // Spin container
        // await transcodeVideo(key, rawBucket, processedBucket, awsRegion);
        try {
          // Run ECS Task
          const runTaskCommand = new RunTaskCommand({
            cluster: process.env.ECS_CLUSTER_ARN,
            launchType: "FARGATE",
            taskDefinition: process.env.ECS_TASK_ARN,
            count: 1,
            platformVersion: "LATEST",
            networkConfiguration: {
              awsvpcConfiguration: {
                subnets: process.env.ECS_TASK_SUBNETS?.split(","),
                securityGroups: [process.env.ECS_SECURITY_GROUP || ''],
                assignPublicIp: "ENABLED",
              },
            },
            overrides: {
              containerOverrides: [
                {
                  name: process.env.ECR_CONTAINER_NAME,
                  environment: [
                    {
                      name: "AWS_REGION",
                      value: process.env.AWS_REGION,
                    },
                    { 
                      name: "INPUT_BUCKET",
                      value: process.env.AWS_RAW_BUCKET,
                    },
                    { 
                      name: "OUTPUT_BUCKET",
                      value: process.env.AWS_PROCESSED_BUCKET,
                    },
                    { 
                      name: "FILE_NAME",
                      value: key,
                    },
                    { 
                      name: "VIDEO_ID",
                      value: videoId,
                    },
                  ],

                }
              ]
            },
          });
          const response = await ecsClient.send(runTaskCommand);
          console.log("ECS Task started:", response.tasks?.[0].taskArn);
        }
        catch (error) {
          console.error("Error in transcoding video:", error);

        }


        const videoData = insertVideo({
          userId: userId,
          videoId,
          status: "PROCESSING",
        });
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
