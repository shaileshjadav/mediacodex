import Docker from "dockerode";

// const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const docker = new Docker();

export async function transcodeVideo(key:string, inputBucket:string, outputBucket:string, awsRegion:string) {
    const container = await docker.createContainer({
      Image: "videotrancoder:latest",
      name: `transcoder-${Date.now()}`,
      Env: [
        `AWS_REGION=${awsRegion}`,
        `KEY=${key}`,
        `AWS_BUCKET_NAME=${inputBucket}`,
        `UPLOAD_BUCKET_NAME=${outputBucket}`,
        ],
      HostConfig: {
        AutoRemove: true,
        NetworkMode:'localstack-network', // Same network as docker-compose
      }
    });
  
    console.log("Created FFmpeg container...");
  
    await container.start();
    console.log("FFmpeg transcoding started...");
  
    // Collect logs
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true
    });
  
    stream.on("data", data => console.log(data.toString()));
  }
