
import React from 'react';
import { MeetingAnalysis } from '../types';

interface HistoryViewProps {
  meetings: MeetingAnalysis[];
  onNewMeeting: () => void;
  onSelectMeeting: (meeting: MeetingAnalysis) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ meetings, onNewMeeting, onSelectMeeting }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <button
        onClick={onNewMeeting}
        className="mb-8 w-full max-w-sm px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors text-xl shadow-lg"
      >
        Record New Meeting
      </button>

      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-300 border-b border-gray-700 pb-2 mb-4">
          Meeting History
        </h2>
        {meetings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No saved meetings yet.</p>
            <p>Your recorded meetings will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {meetings.map((meeting) => (
              <li
                key={meeting.date}
                onClick={() => onSelectMeeting(meeting)}
                className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/80 transition-colors border border-transparent hover:border-blue-500"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-blue-300 truncate pr-4">{meeting.title}</h3>
                  <p className="text-sm text-gray-400 flex-shrink-0">{formatDate(meeting.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
