export interface VideoUploadUrlResponse {
  uploadUrl: string;
  key: string;
}

export interface VideoUploadUrlRequest {
  fileName: string;
  contentType: string;
}
