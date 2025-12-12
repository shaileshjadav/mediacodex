import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ProcessingStatus, ProcessingLog } from '../types';

interface StatusPageProps {
  videoId?: string;
  processingStatus?: ProcessingStatus;
  logs?: ProcessingLog[];
}

const StatusPage: React.FC<StatusPageProps> = ({ 
  videoId: propVideoId, 
  processingStatus: propProcessingStatus, 
  logs: propLogs 
}) => {
  const { videoId: paramVideoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  
  const videoId = propVideoId || paramVideoId;
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(propProcessingStatus || null);
  const [logs, setLogs] = useState<ProcessingLog[]>(propLogs || []);
  const [isLoading, setIsLoading] = useState(!propProcessingStatus);

  // Mock data for development - in real implementation this would come from API/WebSocket
  useEffect(() => {
    if (!videoId) return;

    // Simulate loading status if not provided as props
    if (!propProcessingStatus) {
      const mockStatus: ProcessingStatus = {
        videoId,
        status: 'processing',
        progress: 45,
        currentStage: 'Transcoding to 720p',
        logs: [],
        createdAt: new Date(Date.now() - 120000), // 2 minutes ago
        updatedAt: new Date(),
      };

      const mockLogs: ProcessingLog[] = [
        {
          id: '1',
          videoId,
          level: 'info',
          message: 'Video upload completed successfully',
          timestamp: new Date(Date.now() - 120000),
          stage: 'upload'
        },
        {
          id: '2',
          videoId,
          level: 'info',
          message: 'Starting video analysis...',
          timestamp: new Date(Date.now() - 110000),
          stage: 'analysis'
        },
        {
          id: '3',
          videoId,
          level: 'info',
          message: 'Video format: MP4, Resolution: 1920x1080, Duration: 00:02:34',
          timestamp: new Date(Date.now() - 100000),
          stage: 'analysis'
        },
        {
          id: '4',
          videoId,
          level: 'info',
          message: 'Beginning transcoding process...',
          timestamp: new Date(Date.now() - 90000),
          stage: 'transcoding'
        },
        {
          id: '5',
          videoId,
          level: 'info',
          message: 'Transcoding to 1080p... 100% complete',
          timestamp: new Date(Date.now() - 60000),
          stage: 'transcoding'
        },
        {
          id: '6',
          videoId,
          level: 'info',
          message: 'Transcoding to 720p... 45% complete',
          timestamp: new Date(Date.now() - 30000),
          stage: 'transcoding'
        }
      ];

      setTimeout(() => {
        setProcessingStatus(mockStatus);
        setLogs(mockLogs);
        setIsLoading(false);
      }, 1000);
    }
  }, [videoId, propProcessingStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600';
      case 'processing':
        return 'text-blue-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warn':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info':
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Status</h2>
          <p className="text-gray-600">Fetching processing information...</p>
        </div>
      </div>
    );
  }

  if (!processingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Video Not Found</h2>
          <p className="text-gray-600 mb-4">The requested video processing status could not be found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Video Processing Status</h1>
          </div>
          <p className="text-gray-600">Video ID: {videoId}</p>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(processingStatus.status)}
              <div>
                <h2 className={`text-xl font-semibold ${getStatusColor(processingStatus.status)}`}>
                  {processingStatus.status.charAt(0).toUpperCase() + processingStatus.status.slice(1)}
                </h2>
                <p className="text-gray-600">{processingStatus.currentStage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold text-gray-900">
                {formatDuration(processingStatus.createdAt, processingStatus.status === 'completed' ? processingStatus.updatedAt : undefined)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{processingStatus.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  processingStatus.status === 'completed' 
                    ? 'bg-emerald-500' 
                    : processingStatus.status === 'failed'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${processingStatus.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation Links */}
          {processingStatus.status === 'completed' && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/video/${videoId}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Video
              </button>
              <button
                onClick={() => navigate(`/embed/${videoId}`)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Get Embed Code
              </button>
            </div>
          )}
        </div>

        {/* Processing Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Processing Logs</h3>
            <p className="text-gray-600 text-sm">Real-time processing information and status updates</p>
          </div>
          
          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No logs available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${getLogLevelColor(log.level)}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        log.level === 'error' ? 'bg-red-500' :
                        log.level === 'warn' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {log.stage}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;