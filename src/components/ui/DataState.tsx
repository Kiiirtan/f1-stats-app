import React from 'react';
import { Link } from 'react-router-dom';

type StateType = 'error' | 'empty' | 'not-found';

interface DataStateProps {
  type: StateType;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  actionLink?: string;
  className?: string;
}

export default function DataState({ 
  type, 
  title, 
  message, 
  actionText, 
  onAction, 
  actionLink,
  className = ''
}: DataStateProps) {
  
  // Default configurations based on type
  const config = {
    error: {
      icon: 'warning',
      defaultTitle: 'TELEMETRY FAILURE',
      defaultMessage: 'Unable to establish connection with data source. Check network uplink.',
      defaultAction: 'RETRY CONNECTION',
      color: 'text-primary-container',
      bgPulse: 'bg-primary-container',
      glow: 'drop-shadow-[0_0_15px_rgba(225,6,0,0.4)]'
    },
    empty: {
      icon: 'search_off',
      defaultTitle: 'NO DATA FOUND',
      defaultMessage: 'The current filter parameters yielded zero valid telemetry readings.',
      defaultAction: 'CLEAR SETTINGS',
      color: 'text-on-surface-variant',
      bgPulse: 'bg-on-surface-variant',
      glow: ''
    },
    'not-found': {
      icon: 'wrong_location',
      defaultTitle: 'OFF TRACK',
      defaultMessage: 'The requested entity could not be located in the current database.',
      defaultAction: 'RETURN TO GRID',
      color: 'text-[#66FCF1]',
      bgPulse: 'bg-[#66FCF1]',
      glow: 'drop-shadow-[0_0_15px_rgba(102,252,241,0.4)]'
    }
  };

  const curr = config[type];
  const displayTitle = title || curr.defaultTitle;
  const displayMessage = message || curr.defaultMessage;
  const displayAction = actionText || curr.defaultAction;

  return (
    <div className={`w-full py-24 flex flex-col items-center justify-center text-center px-6 ${className}`}>
      {/* Icon Indicator */}
      <div className="mb-8 flex items-center justify-center opacity-80">
        <div className={`w-8 md:w-16 h-[2px] ${curr.bgPulse} opacity-50`}></div>
        <span className={`material-symbols-outlined ${curr.color} mx-4 text-4xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
          {curr.icon}
        </span>
        <div className={`w-8 md:w-16 h-[2px] ${curr.bgPulse} opacity-50`}></div>
      </div>

      {/* Heading */}
      <h2 className={`font-headline font-black italic uppercase tracking-tighter mb-4 text-3xl md:text-5xl ${curr.color} ${curr.glow}`}>
        {displayTitle}
      </h2>

      {/* Subtext */}
      <p className="text-on-surface-variant max-w-[400px] mb-10 text-sm font-medium leading-relaxed">
        {displayMessage}
      </p>

      {/* Action Button / Link */}
      {(onAction || actionLink) && (
        <div className="flex justify-center">
          {actionLink ? (
            <Link 
              to={actionLink} 
              className={`border border-outline-variant/30 px-8 py-3 font-headline font-bold italic uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 active:scale-95 text-on-surface`}
            >
              {displayAction}
            </Link>
          ) : (
            <button 
              onClick={onAction}
              className={`border border-outline-variant/30 px-8 py-3 font-headline font-bold italic uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 active:scale-95 text-on-surface hover:${curr.color}`}
            >
              {displayAction}
            </button>
          )}
        </div>
      )}
      
      {/* Decorative tech metadata */}
      {type === 'error' && (
        <div className="mt-12 flex justify-center gap-6 opacity-20 text-[10px] font-mono">
           <span>ERR_CODE: X_503</span>
           <span>SEC_LATENCY: ---</span>
           <span>STATUS: DISCONNECTED</span>
        </div>
      )}
    </div>
  );
}
