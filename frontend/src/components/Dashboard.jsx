import React, { useState, useEffect } from 'react';
import { SEVERITY_CONFIG } from '../utils/constants';

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
  { label: 'regions monitored', value: '22', icon: '🛰️', color: '#4A7C59' },
  { label: 'active alerts', value: '5', icon: '🚨', color: '#D64545' },
  { label: 'forest loss (avg)', value: '6.2%', icon: '🌲', color: '#E67E22' },
  { label: 'last scan', value: '2h ago', icon: '⏱️', color: '#2E86C1' },
];

function AnimatedStatCard({ stat, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div className={`organic-card p-5 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-paradise-bg border border-paradise-border">
          {stat.icon}
        </div>
        <div>
          <div className="text-2xl font-bold font-display" style={{ color: stat.color }}>{stat.value}</div>
          <div className="text-[10px] text-paradise-muted uppercase tracking-[0.12em] font-medium">{stat.label}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ onBack }) {
  return (
    <div className="flex-1 bg-paradise-bg overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-paradise-dark flex items-center gap-3 font-display">
              <div className="w-10 h-10 rounded-2xl bg-paradise-green/10 border border-paradise-green/20 flex items-center justify-center">
                <span className="text-xl">🌍</span>
              </div>
              deepearth dashboard
            </h1>
            <p className="text-sm text-paradise-muted mt-1.5 ml-[52px]">
              ai-powered environmental monitoring — pan-india overview
            </p>
          </div>
          <button id="btn-back-to-map" onClick={onBack}
            className="btn-capsule btn-capsule-primary text-[13px]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            back to map
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <AnimatedStatCard key={stat.label} stat={stat} delay={i * 100} />
          ))}
        </div>

        {/* Alerts Table */}
        <div className="organic-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-paradise-green via-paradise-sage to-paradise-mint" />

          <div className="p-5 border-b border-paradise-border flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-2xl flex items-center justify-center">
              <span className="text-lg">🚨</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-paradise-dark font-display">recent environmental alerts</h2>
              <p className="text-[11px] text-paradise-muted mt-0.5">sorted by severity score — highest risk first</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-paradise-bg/50 text-[10px] uppercase tracking-[0.12em] text-paradise-muted">
                  <th className="text-left py-3 px-5 font-semibold">region</th>
                  <th className="text-left py-3 px-5 font-semibold">severity</th>
                  <th className="text-left py-3 px-5 font-semibold">alert score</th>
                  <th className="text-left py-3 px-5 font-semibold">forest loss</th>
                  <th className="text-left py-3 px-5 font-semibold">detected</th>
                  <th className="text-right py-3 px-5 font-semibold">action</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ALERTS.map((alert, i) => {
                  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.CLEAR;
                  const pulseClass = alert.severity === 'CRITICAL' ? 'alert-pulse-critical'
                    : alert.severity === 'HIGH' ? 'alert-pulse-high' : '';
                  return (
                    <tr key={i} className="border-t border-paradise-border hover:bg-paradise-bg/40 transition-colors duration-200">
                      <td className="py-3.5 px-5">
                        <span className="text-[13px] font-semibold text-paradise-dark font-display">{alert.region}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${pulseClass}`}
                          style={{ backgroundColor: sev.bg, color: sev.color, border: `1px solid ${sev.color}15` }}>
                          {sev.icon} {alert.severity.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-paradise-sand rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(alert.score, 100)}%`, backgroundColor: sev.color }} />
                          </div>
                          <span className="text-[11px] font-semibold text-paradise-dark">{alert.score}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[13px] font-semibold text-loss-400">{alert.forest_loss_pct}%</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] text-paradise-muted">{new Date(alert.timestamp).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button className="text-[11px] font-semibold text-paradise-green hover:text-paradise-dark hover:underline
                          transition-colors px-3 py-1 rounded-full hover:bg-paradise-bg">view details →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-paradise-cream/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-organic border border-paradise-border">
            <svg className="w-4 h-4 text-paradise-green" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
            </svg>
            <p className="text-[11px] text-paradise-muted">deepearth v2 — powered by unet + convlstm • sentinel-2 • google earth engine</p>
          </div>
        </div>
      </div>
    </div>
  );
}
