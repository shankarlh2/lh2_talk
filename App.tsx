
import React, { useState, useCallback, useEffect } from 'react';
import { RecorderControl } from './components/RecorderControl';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { analyzeMeetingAudio } from './services/geminiService';
import { MeetingAnalysis } from './types';
import { HistoryView } from './components/HistoryView';

type AppState = 'history' | 'recording' | 'processing';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('history');
  const [meetings, setMeetings] = useState<MeetingAnalysis[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedMeetings = localStorage.getItem('meetingsHistory');
      if (savedMeetings) {
        setMeetings(JSON.parse(savedMeetings));
      }
    } catch (e) {
      console.error("Failed to load meetings from localStorage", e);
      setError("Could not load your meeting history.");
    }
  }, []);

  const handleRecordingStop = useCallback(async (audioBlob: Blob) => {
    setAppState('processing');
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        if (typeof reader.result !== 'string') {
            setError('Failed to read audio file.');
            setAppState('history');
            return;
        }
        const base64Audio = reader.result.split(',')[1];
        
        try {
            const result = await analyzeMeetingAudio(base64Audio, audioBlob.type);
            const newMeeting: MeetingAnalysis = {
                ...result,
                date: new Date().toISOString(),
            };
            
            setMeetings(prevMeetings => {
                const updatedMeetings = [newMeeting, ...prevMeetings];
                localStorage.setItem('meetingsHistory', JSON.stringify(updatedMeetings));
                return updatedMeetings;
            });
            setSelectedMeeting(newMeeting);
            setAppState('history'); // Go back to history, which will show the result
        } catch (e) {
            console.error(e);
            setError('Failed to analyze the meeting. Please try again.');
            setAppState('history');
        }
      };
      reader.onerror = () => {
        setError('Error reading audio blob.');
        setAppState('history');
      };

    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred.');
      setAppState('history');
    }
  }, []);

  const handleResetError = () => {
    setError(null);
  }
  
  const handleStartRecording = () => {
    setError(null);
    setSelectedMeeting(null);
    setAppState('recording');
  }
  
  const handleBackToHistory = () => {
      setSelectedMeeting(null);
      setAppState('history');
  }

  const renderContent = () => {
    if (appState === 'processing') {
      return <Loader message="Analyzing your meeting... this may take a few moments." />;
    }

    if (appState === 'recording') {
      return (
        <div className="card max-w-xl mx-auto">
          <RecorderControl onStop={handleRecordingStop} onCancel={handleBackToHistory} disabled={false} />
        </div>
      );
    }

    if (selectedMeeting) {
      return (
        <div className="card max-w-xl mx-auto">
          <ResultsDisplay result={selectedMeeting} onBack={handleBackToHistory} />
        </div>
      );
    }
    
    // Default to history view
    return (
      <div className="card max-w-xl mx-auto">
        <HistoryView meetings={meetings} onNewMeeting={handleStartRecording} onSelectMeeting={setSelectedMeeting} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card max-w-xl mx-auto" style={{ marginTop: '2.5rem', marginBottom: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)' }}>
        <header className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Meeting Minutes AI</h1>
          <p style={{ color: '#a5b4fc', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Transform your meetings into actionable insights with AI-powered analysis</p>
          <div className="status-bar">
            <span className="status-pill"><span className="status-indicator complete"></span>Powered by Gemini</span>
            <span className="status-pill"><span className="status-indicator complete"></span>Real-time Analysis</span>
            <span className="status-pill"><span className="status-indicator complete"></span>Secure & Private</span>
          </div>
        </header>
        {error && (
          <div className="w-full max-w-md mx-auto text-center bg-red-900/50 p-4 rounded-lg border border-red-500/20 mb-8">
            <h3 className="text-lg font-semibold text-red-300 mb-2">An Error Occurred</h3>
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={handleResetError} 
              className="btn-primary">
              Try Again
            </button>
          </div>
        )}
        {!error && (
          <div className="w-full animate-fade-in flex flex-col items-center">
            {renderContent()}
          </div>
        )}
      </div>
      <footer>
        <p>Built with <span style={{ color: '#f87171' }}>❤️</span> using React, TypeScript, and Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
