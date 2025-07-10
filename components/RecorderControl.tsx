
import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicIcon } from './icons/MicIcon';
import { StopIcon } from './icons/StopIcon';

interface RecorderControlProps {
  onStop: (blob: Blob) => void;
  onCancel: () => void;
  disabled: boolean;
}

export const RecorderControl: React.FC<RecorderControlProps> = ({ onStop, onCancel, disabled }) => {
  const { recorderState, startRecording, stopRecording, permission, error, elapsedTime } = useAudioRecorder(onStop);

  if (!permission && error) {
    return (
      <div className="text-center p-4 bg-red-900/50 rounded-lg text-red-300">
        <h3 className="font-bold text-lg">Permission Error</h3>
        <p>{error}</p>
        <p className="mt-2 text-sm">Please allow microphone access in your browser settings and refresh the page.</p>
      </div>
    );
  }
  
  if (!permission) {
    return (
       <div className="text-center p-4 bg-yellow-900/50 rounded-lg text-yellow-300">
        <h3 className="font-bold text-lg">Microphone Access Required</h3>
        <p>Please grant permission to use your microphone to begin recording.</p>
      </div>
    )
  }

  const isRecording = recorderState === 'recording';

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`relative flex items-center justify-center w-28 h-28 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-400'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          )}
          {isRecording ? <StopIcon /> : <MicIcon />}
        </button>
      </div>
      <div className="text-center">
        <p className="text-2xl font-mono tracking-widest text-gray-300">{elapsedTime}</p>
        <p className="text-lg font-semibold text-gray-400 mt-1">
          {isRecording ? 'Recording in Progress...' : 'Press the button to start recording'}
        </p>
      </div>
        {isRecording && (
            <button
                onClick={stopRecording}
                className="mt-4 px-6 py-3 bg-red-600/80 hover:bg-red-700 rounded-lg font-bold transition-colors"
            >
                Stop Recording
            </button>
        )}
        {!isRecording && (
             <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
        )}
    </div>
  );
};
