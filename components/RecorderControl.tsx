
import React, { useState, useEffect } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicIcon } from './icons/MicIcon';
import { StopIcon } from './icons/StopIcon';

interface RecorderControlProps {
  onStop: (audioBlob: Blob) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const RecorderControl: React.FC<RecorderControlProps> = ({ onStop, onCancel, disabled }) => {
  const { recorderState, startRecording, stopRecording, permission, error, elapsedTime } = useAudioRecorder(onStop);

  const isRecording = recorderState === 'recording';

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-center glass-dark p-6 rounded-2xl border border-red-500/20 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <span className="status-indicator recording"></span>
          <h3 className="text-lg font-semibold text-red-300">Permission Error</h3>
        </div>
        <p className="text-red-200 mb-4">{error}</p>
        <p className="text-sm text-gray-400 mb-4">
          Please allow microphone access in your browser settings and refresh the page.
        </p>
        <button onClick={onCancel} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  if (!isRecording && !elapsedTime) {
    return (
      <div className="w-full max-w-md mx-auto text-center glass-dark p-8 rounded-2xl border border-yellow-500/20 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <span className="status-indicator processing"></span>
          <h3 className="text-lg font-semibold text-yellow-300">Microphone Access Required</h3>
        </div>
        <p className="text-yellow-200 mb-6">
          Please grant permission to use your microphone to begin recording.
        </p>
        <button onClick={startRecording} className="btn-primary mb-4">
          Grant Permission & Start Recording
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-8 animate-fade-in">
      {/* Recording Status */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="status-indicator recording"></span>
          <h3 className="text-xl font-semibold text-red-300">Recording in Progress</h3>
        </div>
        <p className="text-gray-400">Your meeting is being recorded...</p>
      </div>

      {/* Recording Button */}
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`record-button ${isRecording ? 'recording' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <StopIcon />
          ) : (
            <MicIcon />
          )}
          {isRecording && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          )}
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center">
        <div className="timer mb-2">{elapsedTime}</div>
        <p className="text-lg font-semibold text-gray-400">
          {isRecording ? 'Recording...' : 'Ready to record'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {isRecording && (
          <button
            onClick={stopRecording}
            className="btn-danger flex items-center space-x-2"
          >
            <StopIcon />
            <span>Stop Recording</span>
          </button>
        )}
        
        <button
          onClick={onCancel}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Cancel</span>
        </button>
      </div>

      {/* Recording Tips */}
      <div className="w-full max-w-md text-center p-4 glass rounded-xl border border-gray-700/30">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Recording Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Minimize background noise</li>
          <li>• Keep your microphone close</li>
          <li>• Recording will automatically analyze when stopped</li>
        </ul>
      </div>
    </div>
  );
};
