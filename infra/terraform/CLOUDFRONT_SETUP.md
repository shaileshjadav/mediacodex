# CloudFront HLS Streaming Setup Guide

This guide explains how to set up CloudFront with signed URLs for secure HLS streaming.

## Architecture Overview

- **S3 Bucket (processed-videos)**: Stores HLS files (.m3u8 playlists and .ts segments)
- **CloudFront Distribution**: CDN for fast content delivery with Origin Access Control (OAC)
- **Signed URLs**: Restrict access to authorized users only
- **Key Groups**: Manage public keys for URL signing

## Setup Steps

### 1. Generate RSA Key Pair

CloudFront signed URLs require an RSA key pair. Generate one using OpenSSL:

```bash
# Generate private key (2048-bit RSA)
openssl genrsa -out private_key.pem 2048

# Generate public key from private key
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

**Important**: 
- Keep `private_key.pem` secure - this will be used by your backend to sign URLs
- `public_key.pem` will be uploaded to CloudFront

### 2. Configure Terraform Variables

Update your `terraform.tfvars` file:

```hcl
cloudfront_public_key_path = "./public_key.pem"
cloudfront_price_class = "PriceClass_100"  # North America and Europe
```

### 3. Deploy Infrastructure

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### 4. Note Important Outputs

After deployment, save these values:

```bash
terraform output cloudfront_distribution_domain
terraform output cloudfront_public_key_id
terraform output cloudfront_key_group_id
```

You'll need:
- **Public Key ID**: Required for generating signed URLs
- **Distribution Domain**: Base URL for your content
- **Private Key**: Keep secure, use in your backend

## Generating Signed URLs

### Option 1: Using AWS SDK (Node.js)

```javascript
const AWS = require('aws-sdk');
const fs = require('fs');

const cloudFront = new AWS.CloudFront.Signer(
  'YOUR_PUBLIC_KEY_ID',  // From terraform output
  fs.readFileSync('./private_key.pem', 'utf8')
);

const signedUrl = cloudFront.getSignedUrl({
  url: 'https://YOUR_DISTRIBUTION_DOMAIN/path/to/video.m3u8',
  expires: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour from now
});

console.log(signedUrl);
```

### Option 2: Using Python (boto3)

```python
from datetime import datetime, timedelta
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import base64
import json

def generate_signed_url(url, key_pair_id, private_key_path, expiration_hours=1):
    # Load private key
    with open(private_key_path, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )
    
    # Set expiration time
    expire_date = datetime.utcnow() + timedelta(hours=expiration_hours)
    expire_timestamp = int(expire_date.timestamp())
    
    # Create policy
    policy = {
        "Statement": [{
            "Resource": url,
            "Condition": {
                "DateLessThan": {
                    "AWS:EpochTime": expire_timestamp
                }
            }
        }]
    }
    
    # Sign policy
    policy_json = json.dumps(policy, separators=(',', ':'))
    signature = private_key.sign(
        policy_json.encode('utf-8'),
        padding.PKCS1v15(),
        hashes.SHA1()
    )
    
    # Encode for URL
    encoded_signature = base64.b64encode(signature).decode('utf-8')
    encoded_signature = encoded_signature.replace('+', '-').replace('=', '_').replace('/', '~')
    
    # Build signed URL
    signed_url = f"{url}?Expires={expire_timestamp}&Signature={encoded_signature}&Key-Pair-Id={key_pair_id}"
    
    return signed_url

# Usage
signed_url = generate_signed_url(
    'https://YOUR_DISTRIBUTION_DOMAIN/path/to/video.m3u8',
    'YOUR_PUBLIC_KEY_ID',
    './private_key.pem',
    expiration_hours=1
)
print(signed_url)
```

## CloudFront Configuration Details

### Origin Access Control (OAC)
- Replaces legacy Origin Access Identity (OAI)
- Uses AWS SigV4 for authentication
- More secure and supports additional features

### Cache Behaviors

1. **Default Behavior**: All content
   - TTL: 1 hour (3600s)
   - Compression: Enabled
   - Signed URLs: Required

2. **.m3u8 Files** (Manifest/Playlist)
   - TTL: 5-10 seconds (frequently updated)
   - Compression: Enabled
   - Signed URLs: Required

3. **.ts Files** (Video Segments)
   - TTL: 24 hours (86400s)
   - Compression: Disabled (already compressed)
   - Signed URLs: Required

### Price Class
- `PriceClass_100`: North America and Europe (lowest cost)
- `PriceClass_200`: North America, Europe, Asia, Middle East, Africa
- `PriceClass_All`: All edge locations (highest cost)

## Security Best Practices

1. **Private Key Security**
   - Never commit private keys to version control
   - Store in secure key management service (AWS Secrets Manager, HashiCorp Vault)
   - Rotate keys periodically

2. **URL Expiration**
   - Set appropriate expiration times (1-24 hours typical)
   - Shorter for sensitive content
   - Longer for public content with access control

3. **S3 Bucket Policy**
   - Bucket is private (no public access)
   - Only CloudFront can access via OAC
   - Policy automatically created by Terraform

4. **HTTPS Only**
   - All traffic redirected to HTTPS
   - Protects signed URLs from interception

## Troubleshooting

### 403 Forbidden Error
- Check S3 bucket policy includes CloudFront distribution ARN
- Verify OAC is properly configured
- Ensure signed URL hasn't expired

### Video Not Playing
- Check CORS configuration on S3 bucket
- Verify .m3u8 and .ts files are accessible
- Test with unsigned URL first (temporarily disable trusted key groups)

### Signed URL Not Working
- Verify public key ID matches the one in CloudFront
- Check private key format (PEM)
- Ensure clock synchronization (signed URLs are time-sensitive)

## Testing

### Test Without Signed URLs (Initial Setup)
1. Temporarily comment out `trusted_key_groups` in Terraform
2. Apply changes
3. Test direct CloudFront URL
4. Re-enable signed URLs once working

### Test With Signed URLs
```bash
# Generate a signed URL using your backend
# Then test with curl
curl -I "https://YOUR_DISTRIBUTION_DOMAIN/path/to/video.m3u8?Expires=...&Signature=...&Key-Pair-Id=..."
```

## Integration with Backend

Your backend should:
1. Store private key securely (environment variable or secrets manager)
2. Generate signed URLs on-demand when users request videos
3. Set appropriate expiration based on use case
4. Return signed URL to frontend

Example flow:
```
User Request → Backend API → Generate Signed URL → Return to Frontend → Video Player Uses Signed URL
```

## Cost Optimization

- Use `PriceClass_100` for North America/Europe only
- Set appropriate cache TTLs to reduce origin requests
- Monitor CloudFront usage in AWS Cost Explorer
- Consider CloudFront Reserved Capacity for predictable traffic

## Monitoring

Key metrics to monitor:
- CloudFront requests and data transfer
- Cache hit ratio (aim for >80%)
- 4xx/5xx error rates
- Origin latency

## Next Steps

1. Generate key pair
2. Update terraform.tfvars with public key path
3. Deploy infrastructure
4. Implement signed URL generation in backend
5. Test with video player
6. Monitor and optimize
