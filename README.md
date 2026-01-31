# Mediacodex



---

## 🧱 Tech Stack
- AWS (S3 + SQS + Cloudfront + ECR + Farget)
- Node.js
- Reactjs


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


openssl genrsa -out certs/cloudfront_private_key.pem 2048

openssl rsa -pubout -in certs/cloudfront_private_key.pem -out certs/cloudfront_public_key.pem

## 📃 License
MIT
