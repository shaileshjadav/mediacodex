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
    "userId" BIGINT NOT NULL REFERENCES users(id),
    "originalFilename" VARCHAR(255) NOT NULL,
    "storagePath" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL 
        CHECK (status IN ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED')),
    "fileSize" BIGINT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- migrate:down

DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "videos";