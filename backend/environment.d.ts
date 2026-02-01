declare global {
    namespace NodeJS {
      interface ProcessEnv {
        ENVIRONMENT:string;
        AWS_SQS_QUEUE_NAME: string;
        AWS_SQS_URL: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_ACCESS_KEY: string;
        AWS_REGION: string;
        AWS_RAW_BUCKET: string;
        AWS_PROCESSED_BUCKET: string;
        AWS_ENDPOINT_MODE:string;
      }
    }
  }
  
  export {};