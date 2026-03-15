import React from 'react';

/**
 * TopNavbar — Green Paradise style
 * Warm beige bar · lowercase labels · circular icon buttons · leaf accent
 */
export default function TopNavbar({ activePage, onPageChange }) {
  const navItems = [
    { key: 'map', label: 'map', icon: '🗺️' },
    { key: 'dashboard', label: 'dashboard', icon: '📊' },
    { key: 'help', label: 'help', icon: '❓' },
    { key: 'about', label: 'about', icon: '🌿' },
    { key: 'blog', label: 'blog', icon: '📝' },
    { key: 'tools', label: 'other tools', icon: '🔧' },
  ];

  return (
    <nav className="shrink-0 h-14 bg-paradise-cream border-b border-paradise-border
                    flex items-center justify-between px-5 z-30"
         style={{ backdropFilter: 'blur(10px)' }}>
      {/* ── Brand ── */}
      <a href="/" className="flex items-center gap-2.5 group select-none">
        <div className="w-9 h-9 rounded-full bg-paradise-green flex items-center justify-center
                       shadow-organic group-hover:shadow-glow transition-shadow duration-400">
          <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
          </svg>
        </div>
        <div>
          <span className="text-sm font-bold tracking-wide text-paradise-dark font-display">deep</span>
          <span className="text-sm font-bold tracking-wide text-paradise-green font-display">earth</span>
        </div>
      </a>

      {/* ── Center nav ── */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map(item => (
          <button
            key={item.key}
            id={`nav-${item.key}`}
            onClick={() => onPageChange(item.key)}
            className={`relative px-4 py-2 rounded-full text-[13px] font-medium tracking-wide
                       transition-all duration-300 flex items-center gap-2
                       ${activePage === item.key
                         ? 'bg-paradise-green text-white shadow-organic'
                         : 'text-paradise-text hover:bg-paradise-sand/60 hover:text-paradise-dark'
                       }`}
          >
            <span className="text-[12px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* ── Right Icons ── */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-paradise-sand/50 hover:bg-paradise-sand
                          flex items-center justify-center text-paradise-muted hover:text-paradise-dark
                          transition-all duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
        <button className="w-9 h-9 rounded-full bg-paradise-sand/50 hover:bg-paradise-sand
                          flex items-center justify-center text-paradise-muted hover:text-paradise-dark
                          transition-all duration-300 relative">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </button>
        <button className="w-9 h-9 rounded-full bg-paradise-sand/50 hover:bg-paradise-sand
                          flex items-center justify-center text-paradise-muted hover:text-paradise-dark
                          transition-all duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
