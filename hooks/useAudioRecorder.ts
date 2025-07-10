
import { useState, useRef, useCallback, useEffect } from 'react';

type RecorderState = 'idle' | 'recording' | 'stopped';

export const useAudioRecorder = (onStop: (blob: Blob) => void) => {
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerInterval = useRef<number | null>(null);

  const getMicrophonePermission = useCallback(async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Microphone access denied.');
        setPermission(false);
      }
    } else {
      setError("The MediaRecorder API is not supported in your browser.");
      setPermission(false);
    }
  }, []);
  
  useEffect(() => {
      getMicrophonePermission();
  }, [getMicrophonePermission]);

  const startRecording = useCallback(() => {
    if (!permission || !stream) {
      setError("Microphone permission not granted.");
      getMicrophonePermission(); // try again
      return;
    }

    setRecorderState('recording');
    const recorder = new MediaRecorder(stream);
    mediaRecorder.current = recorder;
    mediaRecorder.current.start();

    setElapsedTime(0);
    timerInterval.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
    }, 1000);

    audioChunks.current = [];
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
  }, [permission, stream, getMicrophonePermission]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      if (timerInterval.current) {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm;codecs=opus" });
        onStop(audioBlob);
        setRecorderState('stopped');
        audioChunks.current = [];
      };
    }
  }, [onStop]);

  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }

  return { recorderState, startRecording, stopRecording, permission, error, elapsedTime: formatTime(elapsedTime) };
};
