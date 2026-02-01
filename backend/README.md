# video-transcoding


## Architecure
- When ever video uploaded, SQS notification trigger
- When SQS notification trigger. worker trigger generate trigger container as S3 task.
- S3 task download a video to another bucket.
- Display video to frontend.

