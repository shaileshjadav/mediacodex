-- migrate:up
CREATE TABLE "users" (
    "id" BIGSERIAL PRIMARY KEY,
    "clerkUserId" VARCHAR(255) NOT NULL UNIQUE,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "videos" (
    "id" BIGSERIAL PRIMARY KEY,
    "videoId" TEXT NOT NULL, -- UUID 
    "userId" VARCHAR(255) NOT NULL REFERENCES users("clerkUserId"),
    "status" VARCHAR(20) NOT NULL 
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- migrate:down

DROP TABLE IF EXISTS "videos";
DROP TABLE IF EXISTS "users";