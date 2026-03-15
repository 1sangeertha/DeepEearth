import React from 'react';

/**
 * RegionPopup — Green Paradise organic style
 */
export default function RegionPopup({ region, onClose, onAnalyze, isAnalyzing }) {
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-30 bg-black/5" onClick={onClose} />

      {/* Centered popup ── organic card ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-pop-in">
        <div className="organic-card w-[285px] overflow-hidden relative">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-paradise-green via-paradise-leaf to-paradise-sage" />

          {/* Close */}
          <button id="popup-close" onClick={onClose}
            className="absolute top-4 right-3 w-7 h-7 flex items-center justify-center
                      text-paradise-muted hover:text-paradise-dark hover:bg-paradise-sand/60
                      rounded-full transition-all duration-200 z-10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div className="p-6 text-center">
            <h4 className="text-[13px] font-semibold text-paradise-muted mb-3 tracking-wider uppercase">
              political boundaries
            </h4>

            {/* Location icon */}
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full bg-paradise-bg border border-paradise-border flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-paradise-green" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
                </svg>
              </div>
            </div>

            {/* Region Info */}
            <p className="text-base text-paradise-dark mb-0.5">
              <strong className="font-display text-lg">{region.name}</strong>
            </p>
            <p className="text-[12px] text-paradise-muted mb-4">
              total area <strong className="text-paradise-green">{region.area} Mha</strong>
            </p>

            {/* Coordinates */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paradise-bg border border-paradise-border mb-5">
              <svg className="w-3 h-3 text-paradise-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-[10px] text-paradise-muted font-medium">{region.clickLat}°N, {region.clickLon}°E</span>
            </div>

            {/* Analyze Button */}
            <button
              id="btn-analyze"
              onClick={() => onAnalyze(region)}
              disabled={isAnalyzing}
              className={`w-full py-3 rounded-full text-[13px] font-bold tracking-[0.1em] uppercase
                transition-all duration-350
                ${isAnalyzing
                  ? 'bg-paradise-sand text-paradise-stone cursor-wait'
                  : 'btn-capsule-primary hover:shadow-organic-lg'
                }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  analyzing…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
                  </svg>
                  analyze
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
