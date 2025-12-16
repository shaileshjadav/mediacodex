import React, { useState, useRef, useCallback } from 'react';
import { XMarkIcon, CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { getVideoUploadUrl, uploadOnObjectStore } from '../apis/video';
import type { VideoUploadUrlRequest, VideoUploadUrlResponse } from '../types/video';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (videoId: string) => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/webm',
  'video/mkv',
  'video/m4v',
  'video/3gp',
  'video/quicktime'
];

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes
const MAX_FILES = 5;

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload a video file (${ACCEPTED_VIDEO_TYPES.map(type => type.split('/')[1]).join(', ')}).`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (uploadFiles.length + fileArray.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }

    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);

      newUploadFiles.push({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        status: validationError ? 'error' : 'pending',
        error: validationError || undefined,
      });
    });

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  }, [uploadFiles.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const simulateUpload = async (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;

        setUploadFiles(prev => prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, progress: Math.min(progress, 100), status: 'uploading' }
            : f
        ));

        if (progress >= 100) {
          clearInterval(interval);

          // Simulate occasional upload failures for demonstration
          const shouldFail = Math.random() < 0.1; // 10% failure rate

          if (shouldFail) {
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
                : f
            ));
            reject(new Error('Upload failed'));
          } else {
            setUploadFiles(prev => prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, progress: 100, status: 'completed' }
                : f
            ));
            resolve();
          }
        }
      }, 200);
    });
  };

  const processFileUpload = async (uploadFile: UploadFile): Promise<void> => {
    const videoUploadReqData: VideoUploadUrlRequest = {
      contentType: 'video/mp4',
      fileName: uploadFile.file.name,
    };
    const fileUploadResponse: VideoUploadUrlResponse = await getVideoUploadUrl(videoUploadReqData);
    await uploadOnObjectStore(fileUploadResponse.uploadUrl, uploadFile.file, (progress) => {
      setUploadFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? { ...f, progress: Math.min(progress, 100), status: 'uploading' }
          : f
      ));

      if (progress >= 100) {
        setUploadFiles(prev => prev.map(f =>
          f.id === uploadFile.id
            ? { ...f, progress: 100, status: 'completed' }
            : f
        ));
      }
    });

    // return new Promise((resolve, reject) => {
    //   let progress = 0;
    //   const interval = setInterval(() => {
    //     progress += Math.random() * 15;

    //     setUploadFiles(prev => prev.map(f => 
    //       f.id === uploadFile.id 
    //         ? { ...f, progress: Math.min(progress, 100), status: 'uploading' }
    //         : f
    //     ));

    //     if (progress >= 100) {
    //       clearInterval(interval);

    //       // Simulate occasional upload failures for demonstration
    //       const shouldFail = Math.random() < 0.1; // 10% failure rate

    //       if (shouldFail) {
    //         setUploadFiles(prev => prev.map(f => 
    //           f.id === uploadFile.id 
    //             ? { ...f, status: 'error', error: 'Upload failed. Please try again.' }
    //             : f
    //         ));
    //         reject(new Error('Upload failed'));
    //       } else {
    //         setUploadFiles(prev => prev.map(f => 
    //           f.id === uploadFile.id 
    //             ? { ...f, progress: 100, status: 'completed' }
    //             : f
    //         ));
    //         resolve();
    //       }
    //     }
    //   }, 200);
    // });
  };

  const startUpload = async () => {
    const validFiles = uploadFiles.filter(f => f.status === 'pending');

    if (validFiles.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (const uploadFile of validFiles) {
        try {
          // await simulateUpload(uploadFile);
          await processFileUpload(uploadFile);
        } catch (error) {
          console.error(`Failed to upload ${uploadFile.file.name}:`, error);
        }
      }

      // Check if any uploads completed successfully
      const completedFiles = uploadFiles.filter(f => f.status === 'completed');
      if (completedFiles.length > 0) {
        // For demo purposes, use the first completed file's ID
        const videoId = `video-${Date.now()}`;
        onUploadComplete(videoId);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (isUploading) {
      const confirmClose = window.confirm('Upload in progress. Are you sure you want to close?');
      if (!confirmClose) return;
    }

    setUploadFiles([]);
    setIsDragOver(false);
    setIsUploading(false);
    onClose();
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'uploading':
        return (
          <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="relative inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-3xl mx-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CloudArrowUpIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload Videos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Share your content with the world
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
                disabled={isUploading}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-8 py-8">
            {/* Drag and drop area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragOver
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`transition-all duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <CloudArrowUpIcon className={`h-10 w-10 transition-colors duration-300 ${isDragOver ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                </div>
                <div className="mb-6">
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {isDragOver ? 'Drop your videos now!' : 'Drop your videos here'}
                  </p>
                  <p className="text-gray-600 mb-4">
                    or{' '}
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      browse from your device
                    </button>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-6 mb-2">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Up to {formatFileSize(MAX_FILE_SIZE)}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Max {MAX_FILES} files
                    </span>
                  </div>
                  <p className="text-xs">
                    Supports: MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V, 3GP, QuickTime
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_VIDEO_TYPES.join(',')}
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {/* File list */}
            {uploadFiles.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Selected Files
                  </h4>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {uploadFiles.length}/{MAX_FILES}
                  </span>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {uploadFiles.map((uploadFile) => (
                    <div
                      key={uploadFile.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getStatusIcon(uploadFile.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {uploadFile.file.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {formatFileSize(uploadFile.file.size)}
                            </p>
                            {uploadFile.status === 'completed' && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                Complete
                              </span>
                            )}
                            {uploadFile.status === 'error' && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                                Failed
                              </span>
                            )}
                          </div>
                          {uploadFile.error && (
                            <p className="text-xs text-red-600 mt-1 bg-red-50 px-2 py-1 rounded">
                              {uploadFile.error}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      {uploadFile.status === 'uploading' && (
                        <div className="flex-1 mx-4 min-w-0">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-1 text-center font-medium">
                            {Math.round(uploadFile.progress)}%
                          </p>
                        </div>
                      )}

                      {/* Remove button */}
                      {uploadFile.status !== 'uploading' && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-all duration-200 ml-2"
                          disabled={isUploading}
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {uploadFiles.length > 0 && (
                <span>
                  {uploadFiles.filter(f => f.status === 'completed').length} of {uploadFiles.length} files ready
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={startUpload}
                disabled={
                  isUploading ||
                  uploadFiles.length === 0 ||
                  uploadFiles.every(f => f.status === 'error' || f.status === 'completed')
                }
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                    Upload Videos
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};