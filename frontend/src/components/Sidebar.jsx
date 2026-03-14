import React from 'react';
import { SIDEBAR_ITEMS, SIDEBAR_BOTTOM } from '../utils/constants';

export default function Sidebar({ activeCategory, onCategoryChange }) {
  return (
    <aside className="w-[50px] bg-gfw-sidebar flex flex-col items-center py-2 z-30 shrink-0">
      {/* Top Category Icons */}
      <div className="flex flex-col items-center gap-0.5">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            onClick={() => onCategoryChange(item.id)}
            className={`w-full px-1 py-2.5 flex flex-col items-center gap-0.5 text-center
              transition-all duration-150 relative group
              ${activeCategory === item.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            {activeCategory === item.id && (
              <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-forest-500 rounded-r" />
            )}
            <span className="text-base leading-none">{item.icon}</span>
            <span className="text-[7px] font-semibold tracking-wider leading-tight uppercase">
              {item.label}
            </span>
            {item.hasNotif && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-forest-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-white/20 my-3" />

      {/* Bottom Links */}
      <div className="flex flex-col items-center gap-0.5 mt-auto">
        {SIDEBAR_BOTTOM.map((item) => (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            className="w-full px-1 py-2.5 flex flex-col items-center gap-0.5
              text-white/50 hover:text-white hover:bg-white/5 transition-all text-center"
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span className="text-[7px] font-semibold tracking-wider uppercase">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
