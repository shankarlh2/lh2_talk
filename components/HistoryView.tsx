
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // New: handle delete
  const handleDelete = (date: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      const updated = meetings.filter(m => m.date !== date);
      localStorage.setItem('meetingsHistory', JSON.stringify(updated));
      window.location.reload(); // quick way to refresh, or lift state up for better UX
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-8">
        <button
          onClick={onNewMeeting}
          className="btn-primary text-lg px-8 py-4 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <span style={{ width: 12, height: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, flexGrow: 0 }}>
              <svg width={12} height={12} style={{ minWidth: 12, minHeight: 12, maxWidth: 12, maxHeight: 12, display: 'block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span>Record New Meeting</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">
            Meeting History
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="status-indicator complete"></span>
            <span>{meetings.length} meeting{meetings.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {meetings.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl border border-gray-700/30">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-700/30 flex items-center justify-center">
              <svg width={16} height={16} style={{ minWidth: 16, minHeight: 16, maxWidth: 16, maxHeight: 16, display: 'block' }} className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No meetings yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Start by recording your first meeting. Your meeting history will appear here once you have some recordings.
            </p>
          </div>
        ) : (
          <div className="meeting-list">
            {meetings.map((meeting, index) => (
              <div
                key={meeting.date}
                onClick={() => onSelectMeeting(meeting)}
                className="meeting-item group cursor-pointer flex justify-between items-center"
              >
                <div className="flex-1 min-w-0" style={{ minWidth: 0 }}>
                  <h3 className="font-semibold text-lg text-blue-300 truncate group-hover:text-blue-200 transition-colors">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <svg width={12} height={12} style={{ minWidth: 12, minHeight: 12, maxWidth: 12, maxHeight: 12, display: 'block', marginRight: 4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(meeting.date)}
                    </span>
                    <span className="flex items-center">
                      <svg width={12} height={12} style={{ minWidth: 12, minHeight: 12, maxWidth: 12, maxHeight: 12, display: 'block', marginRight: 4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {meeting.minutesOfMeeting?.length || 0} topics
                    </span>
                    <span className="flex items-center">
                      <svg width={12} height={12} style={{ minWidth: 12, minHeight: 12, maxWidth: 12, maxHeight: 12, display: 'block', marginRight: 4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      {meeting.actionItems?.length || 0} actions
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <span className="status-indicator complete"></span>
                  <svg width={12} height={12} style={{ minWidth: 12, minHeight: 12, maxWidth: 12, maxHeight: 12, display: 'block' }} className="text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {/* Delete button */}
                  <button
                    className="ml-2 p-1 rounded hover:bg-red-100/10"
                    title="Delete meeting"
                    onClick={e => { e.stopPropagation(); handleDelete(meeting.date); }}
                  >
                    <svg width={14} height={14} style={{ minWidth: 14, minHeight: 14, maxWidth: 14, maxHeight: 14, display: 'block' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
