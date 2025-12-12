## TODO
- UI for video upload and display list of video
  - Create a dashboard UI where a list of videos 
  - Have add file button
  - Display popup to drag and drop video
  - On list video, each video have 2 button. 1. copy URL 2. Show preview (which open video in modal with different options like change quality)

- UI for display live status for video processing
  - Create a new page where live status of video is being displays
  - Have button to view logs
  - on view logs display live logs like vercel

Backend:
- Upload video using signed URL
    - Generate signed URL
    - Upload video using frontend
    - Display logs in frontend
- Implement realtime sockets event or long pulling for logs and status
