import React, { useState } from 'react';

const PREDICTION_LEGEND = [
  { cls: 0,  label: 'No Change',               color: '#D3D3D3' },
  { cls: 1,  label: 'Temporary Veg Loss',       color: '#FFA726' },
  { cls: 2,  label: 'Permanent Deforestation',   color: '#EF1010' },
  { cls: 3,  label: 'Forest Degradation',        color: '#B71C1C' },
  { cls: 4,  label: 'Urban Expansion',           color: '#9C27B0' },
  { cls: 5,  label: 'Industrial Zone',           color: '#6A1B9A' },
  { cls: 6,  label: 'Mining Activity',           color: '#8D6E63' },
  { cls: 7,  label: 'Sand Mining',               color: '#FFD600' },
  { cls: 8,  label: 'Water Body Shrinkage',      color: '#039BE5' },
  { cls: 9,  label: 'Burn Scars',                color: '#FF6D00' },
  { cls: 10, label: 'Agricultural Expansion',    color: '#43A047' },
];

export default function AnalysisPanel({
  onToggleLayer,
  layers,
  showPredictionLayer = false,
  hasPrediction = false,
}) {
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <div className="absolute top-4 left-4 w-[260px] z-20 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gfw-border">
          <button
            id="tab-legend"
            onClick={() => setActiveTab('legend')}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5
              transition-colors ${activeTab === 'legend'
                ? 'text-gfw-text border-b-2 border-forest-500'
                : 'text-gfw-muted hover:text-gfw-text'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            LEGEND
          </button>
          <button
            id="tab-analysis"
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5
              transition-colors ${activeTab === 'analysis'
                ? 'text-gfw-text border-b-2 border-forest-500'
                : 'text-gfw-muted hover:text-gfw-text'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 3v18h18" /><polyline points="18,17 13,7 8,14 3,9" />
            </svg>
            ANALYSIS
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'analysis' ? (
            <AnalysisContent onToggleLayer={onToggleLayer} layers={layers} />
          ) : (
            <LegendContent
              layers={layers}
              onToggleLayer={onToggleLayer}
              showPredictionLayer={showPredictionLayer}
              hasPrediction={hasPrediction}
            />
          )}
        </div>
      </div>

      {/* GFW Interactive Map badge */}
      <div className="mt-2 bg-white/80 rounded px-2 py-1 text-[10px] text-gfw-muted inline-block shadow-sm backdrop-blur-sm">
        DeepEarth Interactive Map
      </div>
    </div>
  );
}

function AnalysisContent({ onToggleLayer, layers }) {
  return (
    <div className="animate-fade-up">
      <h3 className="text-sm font-bold text-gfw-text tracking-wide mb-4 uppercase">
        Analyze and Track Forest Change
      </h3>

      <div className="flex gap-4 mb-5">
        <button id="btn-click-layer" className="flex flex-col items-center gap-1.5 group flex-1">
          <div className="w-10 h-10 rounded-lg border-2 border-forest-500 text-forest-600 flex items-center justify-center
            group-hover:bg-forest-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 15l-2 5L9 9l11 4-5 2z" /><path d="M14.828 14.828L21 21" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-forest-600 tracking-wide text-center uppercase leading-tight">
            Click a Layer<br />on the Map
          </span>
          <div className="w-full h-0.5 bg-forest-500 rounded-full mt-0.5" />
        </button>

        <button id="btn-draw-shape" className="flex flex-col items-center gap-1.5 group flex-1">
          <div className="w-10 h-10 rounded-lg border-2 border-gray-300 text-gfw-muted flex items-center justify-center
            group-hover:border-forest-400 group-hover:text-forest-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold text-gfw-muted tracking-wide text-center uppercase leading-tight">
            Draw or Upload<br />Shape
          </span>
        </button>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gfw-text mb-1.5 block">Analysis on shape or:</label>
        <div className="relative">
          <select
            id="select-boundaries"
            className="w-full appearance-none border border-forest-300 rounded-full py-2 px-4 pr-10 text-sm text-gfw-text
              bg-white focus:outline-none focus:ring-2 focus:ring-forest-300 cursor-pointer"
            defaultValue="political"
          >
            <option value="political">Political boundaries</option>
            <option value="custom">Custom shape</option>
            <option value="protected">Protected areas</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-500 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-gfw-muted leading-relaxed">
        Analysis is also available by default for most data layers under the{' '}
        <a href="#" className="text-forest-600 font-semibold hover:underline">land use</a> and{' '}
        <a href="#" className="text-forest-600 font-semibold hover:underline">biodiversity</a> tabs.
      </p>
    </div>
  );
}

function LegendContent({ layers, onToggleLayer, showPredictionLayer, hasPrediction }) {
  const legendItems = [
    { key: 'forestCover', label: 'Tree Cover (2000)', color: '#2E7D32', desc: 'Hansen/UMD tree cover baseline' },
    { key: 'forestLoss', label: 'Tree Cover Loss', color: '#FF4081', desc: 'Year of gross tree cover loss' },
  ];

  return (
    <div className="animate-fade-up">
      <h3 className="text-sm font-bold text-gfw-text tracking-wide mb-3 uppercase">
        Map Layers
      </h3>
      <div className="space-y-3">
        {legendItems.map((item) => (
          <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={layers[item.key]}
              onChange={() => onToggleLayer(item.key)}
              className="mt-0.5 w-4 h-4 rounded accent-forest-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-gfw-text">{item.label}</span>
              </div>
              <p className="text-[10px] text-gfw-muted mt-0.5">{item.desc}</p>
            </div>
          </label>
        ))}

        {/* AI Prediction Layer Toggle — only shown when a prediction exists */}
        {hasPrediction && (
          <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-gfw-border">
            <input
              type="checkbox"
              checked={showPredictionLayer}
              onChange={() => onToggleLayer('prediction')}
              className="mt-0.5 w-4 h-4 rounded accent-purple-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EF1010, #9C27B0, #039BE5, #43A047)' }} />
                <span className="text-xs font-semibold text-gfw-text">AI Prediction Layer</span>
              </div>
              <p className="text-[10px] text-gfw-muted mt-0.5">
                AI model environmental classification
              </p>
            </div>
          </label>
        )}
      </div>

      {/* AI Prediction Class Legend — shown when prediction exists */}
      {hasPrediction && (
        <div className="mt-4 pt-3 border-t border-gfw-border">
          <h4 className="text-[10px] font-bold text-gfw-text tracking-wider uppercase mb-2">
            AI Classification Legend
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {PREDICTION_LEGEND.map((item) => (
              <div key={item.cls} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0 border border-gray-200"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-gfw-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasPrediction && (
        <div className="mt-4 pt-3 border-t border-gfw-border">
          <p className="text-[10px] text-gfw-muted">
            Click a region on the map and press <strong>ANALYZE</strong> to generate
            an AI prediction overlay showing environmental change classes.
          </p>
        </div>
      )}
    </div>
  );
}
