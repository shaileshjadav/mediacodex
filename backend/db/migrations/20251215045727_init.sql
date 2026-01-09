-- migrate:up
CREATE TABLE "videos" (
    "id" BIGSERIAL PRIMARY KEY,
    "videoId" TEXT NOT NULL, -- UUID 
    "userId" VARCHAR(255) NOT NULL, -- Clerk UserId
    "status" VARCHAR(20) NOT NULL 
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
-- Unique video Id
CREATE UNIQUE INDEX idx_videos_video_id ON "videos" ("videoId");
-- UserId indexing
CREATE INDEX idx_videos_user_id ON "videos" ("userId");

-- migrate:down
DROP TABLE IF EXISTS "videos";