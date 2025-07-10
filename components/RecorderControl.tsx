
import React from 'react';
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
      <div className="text-center" style={{ color: '#f87171', fontWeight: 500 }}>
        <p>{error}</p>
        <button className="btn-secondary mt-4" onClick={onCancel}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>{isRecording ? 'Recording in Progress' : 'Ready to Record'}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', color: '#fff', letterSpacing: '0.1em' }}>{elapsedTime}</span>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {!isRecording && (
          <button
            className="record-btn"
            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 2px 8px rgba(239,68,68,0.15)', cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={startRecording}
            disabled={disabled}
            title="Start Recording"
          >
            <MicIcon />
          </button>
        )}
        {isRecording && (
          <button
            className="record-btn"
            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 2px 8px rgba(239,68,68,0.15)', cursor: 'pointer', transition: 'background 0.2s' }}
            onClick={stopRecording}
            disabled={disabled}
            title="Stop Recording"
          >
            <StopIcon />
          </button>
        )}
        <button
          className="record-btn"
          style={{ background: '#232946', color: '#a5b4fc', border: 'none', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', cursor: 'pointer', transition: 'background 0.2s' }}
          onClick={onCancel}
          title="Cancel"
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
      <div style={{ marginTop: '1.5rem', width: '100%' }}>
        <h4 style={{ color: '#a5b4fc', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>Recording Tips</h4>
        <ul style={{ color: '#cbd5e1', fontSize: '0.95rem', paddingLeft: '1.2rem', margin: 0 }}>
          <li>Speak clearly and at a normal pace</li>
          <li>Minimize background noise</li>
          <li>Keep your microphone close</li>
          <li>Recording will automatically analyze when stopped</li>
        </ul>
      </div>
    </div>
  );
};
