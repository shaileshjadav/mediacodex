-- migrate:up
CREATE TABLE "users" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "videos" (
    "id" BIGSERIAL PRIMARY KEY,
    "videoId" TEXT NOT NULL, -- UUID 
    "userId" BIGINT NOT NULL REFERENCES users(id),
    "status" VARCHAR(20) NOT NULL 
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- migrate:down

DROP TABLE IF EXISTS "videos";
DROP TABLE IF EXISTS "users";