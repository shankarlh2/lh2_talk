
import React, { useState } from 'react';
import { MeetingAnalysis } from '../types';

interface ResultsDisplayProps {
  result: MeetingAnalysis;
  onBack: () => void;
}

type Tab = 'summary' | 'minutes' | 'learnings' | 'actions' | 'transcript';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const renderContent = () => {
    if (activeTab === 'summary') {
      return <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{result.summary}</div>;
    }

    if (activeTab === 'minutes') {
      return (
        <div className="space-y-6">
          {result.minutesOfMeeting.map((item, index) => (
            <div key={index} className="card">
              <h4 className="font-bold text-lg text-blue-300 mb-3">{item.topic}</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                {item.points.map((point, pIndex) => (
                  <li key={pIndex} className="text-gray-200">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'learnings') {
      return (
        <div className="space-y-4">
          {result.keyLearnings.map((learning, index) => (
            <div key={index} className="card flex items-start space-x-4">
              <span className="text-yellow-400 font-bold text-xl mt-1">&#10022;</span>
              <div>
                <p className="text-gray-200">{learning}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'actions') {
      return (
        <div className="space-y-4">
          {result.actionItems.map((item, index) => (
            <div key={index} className="card flex items-start space-x-4">
              <span className="text-blue-400 font-bold text-xl mt-1">&#10148;</span>
              <div>
                <p className="text-gray-200">{item.task}</p>
                {item.assignee && (
                  <span className="text-xs font-semibold px-2 py-1 bg-teal-800 text-teal-200 rounded-full mt-2 inline-block">
                    {item.assignee}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'transcript') {
      return <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap p-4 glass rounded-lg">{result.transcript}</div>;
    }

    return null;
  };

  const TabButton: React.FC<{ tabId: Tab; label: string; count?: number }> = ({ tabId, label, count }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`tab-button ${activeTab === tabId ? 'active' : ''}`}
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold text-gray-200 truncate" title={result.title}>
            {result.title}
          </h2>
          <span className="text-sm text-gray-400 flex-shrink-0">
            {new Date(result.date).toLocaleString()}
          </span>
        </div>
        <button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to History</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start border-b border-gray-700 mb-6 pb-2 gap-2">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
          <TabButton tabId="summary" label="Summary" />
          <TabButton 
            tabId="minutes" 
            label="Minutes" 
            count={result.minutesOfMeeting?.length || 0} 
          />
          <TabButton 
            tabId="learnings" 
            label="Key Learnings" 
            count={result.keyLearnings?.length || 0} 
          />
          <TabButton 
            tabId="actions" 
            label="Action Items" 
            count={result.actionItems?.length || 0} 
          />
          <TabButton tabId="transcript" label="Transcript" />
        </div>
      </div>

      <div className="animate-fade-in mb-8">
        {renderContent()}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onBack}
          className="btn-primary text-lg">
          Back to History
        </button>
      </div>
    </div>
  );
};
