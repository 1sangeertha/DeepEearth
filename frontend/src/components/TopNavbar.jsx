import React from 'react';

export default function TopNavbar({ activePage, onPageChange }) {
  const navItems = [
    { id: 'map', label: 'MAP' },
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'help', label: 'HELP', hasDropdown: true },
    { id: 'about', label: 'ABOUT', hasDropdown: true },
    { id: 'blog', label: 'BLOG' },
    { id: 'tools', label: 'OTHER TOOLS', hasDropdown: true },
  ];

  return (
    <header className="h-12 bg-white border-b border-gfw-border flex items-center px-0 z-50 shrink-0 shadow-sm">
      {/* Brand */}
      <div className="h-full bg-forest-800 flex items-center px-3 gap-2">
        <div className="w-8 h-8 bg-forest-500 rounded flex items-center justify-center">
          <span className="text-white text-lg">🌍</span>
        </div>
        <div className="text-white leading-tight">
          <div className="text-[10px] font-bold tracking-wider">DEEP</div>
          <div className="text-[10px] font-bold tracking-wider">EARTH</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center h-full ml-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onPageChange(item.id)}
            className={`h-full px-4 flex items-center text-xs font-semibold tracking-wider
              transition-colors duration-150 relative
              ${activePage === item.id
                ? 'text-forest-700 border-b-2 border-forest-500'
                : 'text-gfw-text hover:text-forest-600 hover:bg-forest-50'
              }`}
          >
            {item.label}
            {item.hasDropdown && (
              <svg className="w-3 h-3 ml-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center h-full gap-1 pr-3">
        <span className="text-xs text-gfw-muted mr-2">ENGLISH</span>
        <svg className="w-3 h-3 text-gfw-muted" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>

        {/* Search */}
        <button id="nav-search" className="w-9 h-9 rounded-full bg-forest-500 hover:bg-forest-600 text-white flex items-center justify-center ml-3 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        {/* Notifications */}
        <button id="nav-notif" className="w-9 h-9 rounded-full bg-forest-500 hover:bg-forest-600 text-white flex items-center justify-center transition-colors relative">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
        </button>

        {/* Profile */}
        <button id="nav-profile" className="w-9 h-9 rounded-full bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
