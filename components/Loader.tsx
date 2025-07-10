
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-fade-in">
      <div className="relative">
        <div className="loading-spinner"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-200">{message}</h3>
        <p className="text-gray-400 text-sm">
          Please wait while we process your audio...
        </p>
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span className="status-indicator processing"></span>
        <span>Processing with Gemini AI</span>
      </div>
    </div>
  );
};
