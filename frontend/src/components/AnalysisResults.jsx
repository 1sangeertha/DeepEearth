import React from 'react';
import { CLASS_NAMES, CLASS_COLORS, SEVERITY_CONFIG } from '../utils/constants';

export default function AnalysisResults({ results, onClose }) {
  const { stats, region, timestamp } = results;
  const severity = SEVERITY_CONFIG[stats?.severity] || SEVERITY_CONFIG.CLEAR;

  return (
    <div className="absolute top-4 left-4 w-[300px] max-h-[calc(100vh-120px)] z-20 animate-slide-in">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="p-4 border-b border-gfw-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold text-gfw-text">{region || 'Analysis Results'}</h3>
            <p className="text-[10px] text-gfw-muted mt-0.5">
              {new Date(timestamp).toLocaleString()}
            </p>
          </div>
          <button
            id="results-close"
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gfw-muted"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Severity Badge */}
        <div
          className="mx-4 mt-3 py-2.5 px-3 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: severity.bg }}
        >
          <span className="text-xl">{severity.icon}</span>
          <div>
            <div className="text-xs font-bold" style={{ color: severity.color }}>
              {stats.severity} ALERT
            </div>
            <div className="text-[10px] text-gfw-muted">
              Score: {stats.alert_score}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="px-4 py-3 grid grid-cols-2 gap-2">
          <MetricCard
            label="Forest Loss"
            value={`${stats.forest_loss_pct}%`}
            color="#e74c3c"
          />
          <MetricCard
            label="Urban Growth"
            value={`${stats.urban_growth_pct}%`}
            color="#9b59b6"
          />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {/* Top Issues */}
          <h4 className="text-xs font-bold text-gfw-text mb-2 uppercase tracking-wider">
            Detected Issues
          </h4>
          <div className="space-y-2 mb-4">
            {stats.top_issues?.map((issue, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CLASS_COLORS[
                    CLASS_NAMES.indexOf(issue.class_name)
                  ] || '#999' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gfw-text truncate">
                      {issue.class_name}
                    </span>
                    <span className="text-xs font-semibold text-gfw-text ml-2">
                      {issue.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(issue.percentage * 5, 100)}%`,
                        backgroundColor: CLASS_COLORS[
                          CLASS_NAMES.indexOf(issue.class_name)
                        ] || '#999',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Class Distribution */}
          <h4 className="text-xs font-bold text-gfw-text mb-2 uppercase tracking-wider">
            Full Distribution
          </h4>
          <div className="space-y-1.5">
            {stats.distribution &&
              Object.entries(stats.distribution)
                .filter(([_, val]) => val.percentage > 0.1)
                .sort((a, b) => b[1].percentage - a[1].percentage)
                .map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2 text-[11px]">
                    <span
                      className="w-2 h-2 rounded-sm shrink-0"
                      style={{ backgroundColor: CLASS_COLORS[parseInt(key)] || '#999' }}
                    />
                    <span className="flex-1 text-gfw-muted truncate">
                      {val.name}
                    </span>
                    <span className="text-gfw-text font-medium">
                      {val.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-gfw-border flex gap-2 shrink-0">
          <button className="flex-1 py-2 bg-forest-500 hover:bg-forest-600 text-white text-xs font-bold rounded tracking-wider uppercase transition-colors">
            Download Report
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gfw-border text-xs font-semibold text-gfw-muted rounded hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gfw-muted uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
