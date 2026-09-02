import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center p-8 border border-border-dark rounded-lg text-center bg-bg-charcoal min-h-[200px]">
    <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center mb-4">
      <AlertCircle className="w-5 h-5 text-text-muted" />
    </div>
    <h3 className="text-[14px] font-medium text-text-main mb-1">{title}</h3>
    <p className="text-[13px] text-text-sec max-w-sm mb-6">{description}</p>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingState = ({ message = "Analyzing data..." }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-bg-charcoal border border-border-dark rounded-lg min-h-[200px]">
    <div className="relative w-8 h-8 mb-4">
      <div className="absolute inset-0 border-2 border-border-dark rounded-full"></div>
      <div className="absolute inset-0 border-2 border-brand rounded-full border-t-transparent animate-spin"></div>
    </div>
    <p className="text-[13px] text-text-sec">{message}</p>
  </div>
);

export const ErrorState = ({ message = "We couldn't complete the AI analysis. Please try again.", onRetry }) => (
  <div className="flex flex-col items-start p-6 bg-bg-charcoal border border-border-dark rounded-lg">
    <div className="flex items-center gap-3 mb-2">
      <AlertCircle className="w-5 h-5 text-[#F87171]" />
      <h3 className="text-[14px] font-medium text-text-main">Analysis unavailable</h3>
    </div>
    <p className="text-[13px] text-text-sec ml-8 mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="ml-8 px-4 py-1.5 bg-bg-surface hover:bg-border-dark text-text-main text-[13px] font-medium rounded transition-colors border border-border-dark"
      >
        Try Again
      </button>
    )}
  </div>
);
