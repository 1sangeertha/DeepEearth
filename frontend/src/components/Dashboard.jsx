import React, { useState, useEffect } from 'react';
import { SEVERITY_CONFIG } from '../utils/constants';

// Demo alert data for the dashboard
const DEMO_ALERTS = [
  { region: 'Jharkhand', severity: 'CRITICAL', score: 85.2, forest_loss_pct: 12.3, timestamp: '2024-12-15T10:30:00' },
  { region: 'Western Ghats', severity: 'HIGH', score: 52.1, forest_loss_pct: 8.7, timestamp: '2024-12-14T14:20:00' },
  { region: 'Sundarbans', severity: 'HIGH', score: 45.8, forest_loss_pct: 6.2, timestamp: '2024-12-13T09:15:00' },
  { region: 'Assam', severity: 'MEDIUM', score: 28.4, forest_loss_pct: 4.1, timestamp: '2024-12-12T16:45:00' },
  { region: 'Bellary', severity: 'MEDIUM', score: 22.1, forest_loss_pct: 3.8, timestamp: '2024-12-11T11:00:00' },
  { region: 'Delhi NCR', severity: 'HIGH', score: 48.3, forest_loss_pct: 2.1, timestamp: '2024-12-10T08:30:00' },
  { region: 'Kerala Coast', severity: 'LOW', score: 8.5, forest_loss_pct: 1.2, timestamp: '2024-12-09T13:00:00' },
  { region: 'Rajasthan', severity: 'LOW', score: 5.3, forest_loss_pct: 0.8, timestamp: '2024-12-08T15:30:00' },
];

const STATS = [
  { label: 'Regions Monitored', value: '22', icon: '🛰️', color: '#4CAF50' },
  { label: 'Active Alerts', value: '5', icon: '🚨', color: '#e74c3c' },
  { label: 'Forest Loss (avg)', value: '6.2%', icon: '🌲', color: '#FF4081' },
  { label: 'Last Scan', value: '2h ago', icon: '⏱️', color: '#2196F3' },
];

export default function Dashboard({ onBack }) {
  return (
    <div className="flex-1 bg-gfw-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gfw-text flex items-center gap-2">
              <span className="text-3xl">🌍</span>
              DeepEarth Dashboard
            </h1>
            <p className="text-sm text-gfw-muted mt-1">
              AI-Powered Environmental Monitoring — Pan-India Overview
            </p>
          </div>
          <button
            id="btn-back-to-map"
            onClick={onBack}
            className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white text-sm font-semibold rounded-lg
              flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Map
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gfw-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gfw-border">
            <h2 className="text-base font-bold text-gfw-text flex items-center gap-2">
              🚨 Recent Environmental Alerts
            </h2>
            <p className="text-xs text-gfw-muted mt-1">
              Sorted by severity score — highest risk first
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gfw-muted">
                  <th className="text-left py-3 px-5 font-semibold">Region</th>
                  <th className="text-left py-3 px-5 font-semibold">Severity</th>
                  <th className="text-left py-3 px-5 font-semibold">Alert Score</th>
                  <th className="text-left py-3 px-5 font-semibold">Forest Loss</th>
                  <th className="text-left py-3 px-5 font-semibold">Detected</th>
                  <th className="text-right py-3 px-5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ALERTS.map((alert, i) => {
                  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.CLEAR;
                  return (
                    <tr
                      key={i}
                      className="border-t border-gfw-border hover:bg-forest-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <span className="text-sm font-semibold text-gfw-text">
                          {alert.region}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: sev.bg, color: sev.color }}
                        >
                          {sev.icon} {alert.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(alert.score, 100)}%`,
                                backgroundColor: sev.color,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gfw-text">
                            {alert.score}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-sm font-semibold text-loss-400">
                          {alert.forest_loss_pct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-xs text-gfw-muted">
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button className="text-xs font-semibold text-forest-600 hover:text-forest-800 hover:underline transition-colors">
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gfw-muted">
            DeepEarth V2 — Powered by UNetV3 + ConvLSTM • Sentinel-2 • Google Earth Engine
          </p>
        </div>
      </div>
    </div>
  );
}
