import { SQSClient, ReceiveMessageCommand, Message, CreateQueueCommand, GetQueueUrlCommand, SQSServiceException,  } from "@aws-sdk/client-sqs";
import * as dotenv from "dotenv";
import type {S3Event} from "aws-lambda";

dotenv.config();

const client = new SQSClient({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function ensureQueue(queueName:string){
    // check is SQS Queue is exists if not exists then create a new SQS Queue

    try{
        const queueName = process.env.AWS_SQS_QUEUE_NAME;

        const getQueueUrlCommand = new GetQueueUrlCommand({ QueueName: queueName });
        const getQueueUrlResponse = await client.send(getQueueUrlCommand);
        return getQueueUrlResponse.QueueUrl;
    }
    catch(error: unknown){
        if (error instanceof SQSServiceException && error.name === "QueueDoesNotExist") {
            console.log("Queue not found. Creating...");
            const createQueueCommand = new CreateQueueCommand({ QueueName: queueName });
            const createQueueResponse = await client.send(createQueueCommand);
            return createQueueResponse.QueueUrl;
        }
        
        // Other errors → throw
        throw error;
    }
}


async function init () {
 
    const queueName = process.env.AWS_SQS_QUEUE_NAME;
    const queueUrl = await ensureQueue(queueName);

    const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds:20,

    })
    
    while(true){
        const {Messages} = await client.send(command);
        if(!Messages){
            console.log("no message found");
            continue;
        }
        try {
            
            for(const message of Messages){
                
                const {MessageId, Body } = message;
                
                // validate event
                if(!Body) continue;
                
                const event = JSON.parse(Body) as S3Event;
                
                if("Service" in event && "Event" in event) {
                    // ignore the test event
                    if(event.Event === 's3:TestEvent') return true;
                }
                

                for(const record of event.Records) {
                    const {s3} = record;
                    const { bucket , object: { key }} = s3;
                    
                    // Spin container
                    
                }


                // TODO: Delete message from queue
            }
        }
        catch(e){

        }

        
    }   
}
init();