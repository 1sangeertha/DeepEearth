import React from 'react';

export default function RegionPopup({ region, onClose, onAnalyze, isAnalyzing }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-30"
        onClick={onClose}
      />

      {/* Centered Popup Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-pop-in">
        <div className="bg-white rounded-lg shadow-xl w-[280px] overflow-hidden">
          {/* Close button */}
          <button
            id="popup-close"
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center
              text-gfw-muted hover:text-gfw-text transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 text-center">
            {/* Title */}
            <h4 className="text-sm font-semibold text-gfw-text mb-3">
              Political boundaries
            </h4>

            {/* Crosshair divider */}
            <div className="flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-gfw-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
            </div>

            {/* Region Info */}
            <p className="text-sm text-gfw-text mb-1">
              <strong>{region.name}</strong>
            </p>
            <p className="text-xs text-gfw-muted mb-5">
              with a total area of <strong>{region.area} Mha</strong>
            </p>

            {/* Coordinates */}
            <p className="text-[10px] text-gfw-muted mb-4">
              {region.clickLat}°N, {region.clickLon}°E
            </p>

            {/* Analyze Button */}
            <button
              id="btn-analyze"
              onClick={() => onAnalyze(region)}
              disabled={isAnalyzing}
              className={`w-full py-2.5 rounded text-sm font-bold tracking-wider uppercase
                transition-all duration-200
                ${isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-wait'
                  : 'bg-forest-500 hover:bg-forest-600 text-white shadow-md hover:shadow-lg'
                }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'ANALYZE'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
