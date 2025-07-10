
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
      return <RecorderControl onStop={handleRecordingStop} onCancel={handleBackToHistory} disabled={false} />;
    }

    if (selectedMeeting) {
      return (
        <div className="w-full">
          <ResultsDisplay result={selectedMeeting} onBack={handleBackToHistory} />
        </div>
      );
    }
    
    // Default to history view
    return <HistoryView meetings={meetings} onNewMeeting={handleStartRecording} onSelectMeeting={setSelectedMeeting} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="w-full text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Meeting Minutes AI
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Record, save, and review your meetings instantly.
          </p>
        </header>

        <main className="w-full flex-grow flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl shadow-2xl border border-gray-700 min-h-[500px]">
          {error && (
             <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                <p className="font-semibold">An Error Occurred</p>
                <p>{error}</p>
                <button 
                  onClick={handleResetError} 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors">
                  Acknowledge
                </button>
             </div>
          )}
          {!error && renderContent()}
        </main>

        <footer className="w-full text-center text-gray-500 mt-12 mb-4">
          <p>Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
