import { useState, useRef, useCallback } from 'react';
import RecordRTC from 'recordrtc';

interface RecordingOptions {
  includeAudio?: boolean;
  quality?: '720p' | '1080p' | '4k';
}

export const useScreenRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async (options: RecordingOptions = {}) => {
    try {
      const constraints: DisplayMediaStreamOptions = {
        video: {
          width: options.quality === '4k' ? 3840 : options.quality === '1080p' ? 1920 : 1280,
          height: options.quality === '4k' ? 2160 : options.quality === '1080p' ? 1080 : 720,
        } as MediaTrackConstraints,
        audio: options.includeAudio || false,
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        bitsPerSecond: options.quality === '4k' ? 8000000 : options.quality === '1080p' ? 5000000 : 2500000,
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Handle stream end (user stops sharing)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current && isPaused) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  }, [isPaused]);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current!.getBlob();
          
          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }

          // Clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          setIsRecording(false);
          setIsPaused(false);
          recorderRef.current = null;
          streamRef.current = null;

          resolve(blob);
        });
      }
    });
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isRecording,
    isPaused,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};
