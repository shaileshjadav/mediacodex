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

    