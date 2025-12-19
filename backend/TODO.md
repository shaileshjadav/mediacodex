## TODO:

## DB schema design:

### users

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Table: videos

```sql
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    userId BIGINT NOT NULL REFERENCES users(id),
    originalFilename VARCHAR(255) NOT NULL,
    storagePath TEXT NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    fileSize BIGINT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Feature: Upload video feature

- Design db schema in postgres for video upload functionality(tablename=videos, columns = userId(1), objectURL)
- API for generate signed URL

## Feature: Run worker

- Start worker after video upload

## Feature: Display uploaded video list

### Backend:

    - When Video uploaded new insert for new video.
    - Check logs if Video uploaded success message found then update video upload status to completed.
    - API for video list which return all video of loggedin userId and and status.

### Frontend:

    - Display a list of videos.

## feature: Display a video in modal

### Frontend:

- Create a modal which display a video with quality change options
- HLS streamimg of video in modal

### Backend:

- Add video URLs in video list
  - Get list from s3

## Feature: Display a embedded script

## Frontend

    - Generate video-specific embed scripts -> Pending
        - Create a token and set to iframe code.
         ```
         <iframe src="https://yourapp.com/embed?token=abc123" />
        ```
       - Backend validates token and generate pre-signed URL
       - Frontend:
             - Create a new page
                ```
                https://player.yourapp.com/embed/:videoId
                ```
        Flow:
        Load embed page
            → Call backend: /api/player/session
            → Receive HLS signed URL
            → Initialize video player

        - Backend Playback Session API
                Endpoint
                POST /api/player/session

                Request
                {
                "videoId": "abc123",
                "token": "EMBED_TOKEN"
                }

        Verify token
            const payload = verifyJWT(token);

            // 2. Validate video access
            if (payload.videoId !== videoId) throw 403;

            // Optional domain validation
            if (payload.domain !== req.headers.origin) throw 403;

            // 3. Generate signed URL
            const signedUrl = generateSignedHLS(videoId);

            // 4. Return playback session
            res.json({
            playbackUrl: signedUrl,
            expiresIn: 300
            });

    - Display code with syntax highlighting and copy functionality -> Done
    - Add embed customization options -> Done
