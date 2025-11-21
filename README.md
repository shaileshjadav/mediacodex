# 🎥 Video Transcoding Pipeline (LocalStack + Node.js) — Minimal Setup

This is a minimal demo project that shows how to trigger an SQS message whenever a video is uploaded to an S3 bucket in **LocalStack**.  
It simulates the event-driven pipeline used in cloud-based video processing systems.

---

## 🧱 Tech Stack
- LocalStack (S3 + SQS)
- Node.js
- AWS CLI
- Docker Compose

---

## 🚀 How It Works
1. User uploads a video → `raw-videos` bucket.
2. S3 event fires → sends message to SQS.
3. Node.js listener receives event.
4. (Future step) Trigger Docker-based transcoding.

---

## 📁 Project Structure

```
video-transcoding-pipeline/
│
├── docker-compose.yml       # LocalStack instance
├── infra/
│   └── setup.sh             # Creates S3 buckets + SQS + notifications
├── src/
│   └── sqs-listener.js      # Node.js listener for events
├── README.md
```

---

## ▶️ Getting Started

### 1. Start LocalStack
```sh
docker-compose up -d
```

### 2. Run setup script
```sh
./infra/setup.sh
```

### 3. Upload a video
```sh
aws --endpoint-url=http://localhost:4566 s3 cp sample.mp4 s3://raw-videos/
```

### 4. Run the Node.js listener
```sh
node src/sqs-listener.js
```

You should see the S3 event printed in the console.

---

## 📌 Next Steps (Optional)
- Add Dockerode transcoder worker
- Upload transcoded output to `processed-videos` bucket
- Add React upload UI
- Add job status tracking

---

## 📃 License
MIT
