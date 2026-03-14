import React from 'react';

export default function MapControls({ onZoomIn, onZoomOut }) {
  const buttons = [
    {
      id: 'ctrl-zoom-out',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14" />
        </svg>
      ),
      onClick: onZoomOut,
      label: 'Zoom out',
    },
    {
      id: 'ctrl-zoom-in',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
      onClick: onZoomIn,
      label: 'Zoom in',
    },
    { divider: true },
    {
      id: 'ctrl-share',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16,6 12,2 8,6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      ),
      label: 'Share',
    },
    {
      id: 'ctrl-settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      label: 'Settings',
    },
    {
      id: 'ctrl-help',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      label: 'Help',
    },
  ];

  return (
    <div className="absolute bottom-10 right-4 z-20 flex flex-col items-center gap-0.5 animate-fade-up">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {buttons.map((btn, i) =>
          btn.divider ? (
            <div key={i} className="h-px bg-gfw-border" />
          ) : (
            <button
              key={btn.id}
              id={btn.id}
              onClick={btn.onClick}
              title={btn.label}
              className="w-9 h-9 flex items-center justify-center text-gfw-text
                hover:bg-forest-50 hover:text-forest-600 transition-colors"
            >
              {btn.icon}
            </button>
          )
        )}
      </div>
    </div>
  );
}
