import { z } from 'zod';

const getUploadUrlSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
//   fileSize: z.number().positive('File size must be positive'),
  contentType: z.string().regex(/^video\//, 'Content type must be a video format'),  
});

export type GetUploadUrlRequest = z.infer<typeof getUploadUrlSchema>;
export { getUploadUrlSchema };
