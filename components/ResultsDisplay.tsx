
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
    switch (activeTab) {
      case 'summary':
        return <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{result.summary}</div>;
      case 'minutes':
        return (
          <div className="space-y-6">
            {result.minutesOfMeeting.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800/70 rounded-lg">
                <h4 className="font-bold text-lg text-blue-300">{item.topic}</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                  {item.points.map((point, pIndex) => (
                    <li key={pIndex}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'learnings':
        return (
          <ul className="space-y-3">
            {result.keyLearnings.map((learning, index) => (
              <li key={index} className="p-4 bg-gray-800/70 rounded-lg flex items-start space-x-4">
                <span className="text-yellow-400 font-bold text-xl mt-1">&#10022;</span>
                <div>
                  <p className="text-gray-200">{learning}</p>
                </div>
              </li>
            ))}
          </ul>
        );
      case 'actions':
        return (
          <ul className="space-y-3">
            {result.actionItems.map((item, index) => (
              <li key={index} className="p-4 bg-gray-800/70 rounded-lg flex items-start space-x-4">
                <span className="text-blue-400 font-bold text-xl mt-1">&#10148;</span>
                <div>
                  <p className="text-gray-200">{item.task}</p>
                  {item.assignee && (
                    <span className="text-xs font-semibold px-2 py-1 bg-teal-800 text-teal-200 rounded-full mt-2 inline-block">
                      {item.assignee}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        );
      case 'transcript':
        return <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap p-4 bg-gray-800/70 rounded-lg">{result.transcript}</div>;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabId: Tab; label: string }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 font-semibold rounded-md transition-colors text-sm sm:text-base ${
        activeTab === tabId
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
             <h2 className="text-2xl font-bold text-gray-200 truncate" title={result.title}>{result.title}</h2>
             <span className="text-sm text-gray-400 flex-shrink-0">{new Date(result.date).toLocaleString()}</span>
        </div>
      <div className="flex flex-wrap items-center justify-start border-b border-gray-700 mb-6 pb-2 gap-2">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto">
          <TabButton tabId="summary" label="Summary" />
          <TabButton tabId="minutes" label="Minutes" />
          <TabButton tabId="learnings" label="Learnings" />
          <TabButton tabId="actions" label="Actions" />
          <TabButton tabId="transcript" label="Transcript" />
        </div>
      </div>
      <div className="animate-fade-in mb-8">{renderContent()}</div>
       <div className="text-center mt-8">
            <button 
                onClick={onBack} 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors text-lg">
                &larr; Back to History
            </button>
        </div>
    </div>
  );
};
