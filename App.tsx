
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
        <div className="w-full max-w-md mx-auto bg-white/5 rounded-xl shadow-lg p-8 flex flex-col items-center gap-8">
          <RecorderControl onStop={handleRecordingStop} onCancel={handleBackToHistory} disabled={false} />
        </div>
      );
    }

    if (selectedMeeting) {
      return (
        <div className="w-full">
          <ResultsDisplay result={selectedMeeting} onBack={handleBackToHistory} />
        </div>
      );
    }
    
    // Default to history view
    return (
      <div className="w-full flex flex-col gap-10">
        <HistoryView meetings={meetings} onNewMeeting={handleStartRecording} onSelectMeeting={setSelectedMeeting} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <header className="w-full text-center mt-10 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">Meeting Minutes AI</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">Transform your meetings into actionable insights with AI-powered analysis</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
            <span className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-blue-300">
              <span className="status-indicator complete"></span>Powered by Gemini
            </span>
            <span className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-green-300">
              <span className="status-indicator complete"></span>Real-time Analysis
            </span>
            <span className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-xs font-medium text-teal-300">
              <span className="status-indicator complete"></span>Secure & Private
            </span>
          </div>
        </header>

        <main className="w-full flex-grow flex flex-col items-center justify-center p-0">
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
            <div className="w-full animate-fade-in">
              {renderContent()}
            </div>
          )}
        </main>

        <footer className="w-full text-center text-gray-400 mt-16 mb-4 animate-fade-in">
          <p className="text-xs">
            Built with ❤️ using React, TypeScript, and Gemini AI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
