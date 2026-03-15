import React from 'react';
import { SIDEBAR_ITEMS } from '../utils/constants';

/**
 * Sidebar — Green Paradise organic style
 * Dark forest background · circular icon buttons · leaf accent on active
 */
export default function Sidebar({ activeCategory, onCategoryChange }) {
  return (
    <div className="w-[54px] shrink-0 flex flex-col items-center py-3 gap-1.5 z-20 overflow-y-auto
                    bg-paradise-forest border-r border-paradise-forest">
      {SIDEBAR_ITEMS.map(item => {
        const isActive = activeCategory === item.id;
        return (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            onClick={() => onCategoryChange(item.id)}
            title={item.label}
            className={`relative w-[42px] h-[42px] rounded-2xl flex flex-col items-center justify-center
                       transition-all duration-300 group
                       ${isActive
                         ? 'bg-paradise-green text-white shadow-organic'
                         : 'bg-transparent text-white/50 hover:bg-white/8 hover:text-white/80'
                       }`}
          >
            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -left-[7px] w-[3px] h-5 rounded-r-full bg-paradise-mint" />
            )}
            <span className="text-[14px] leading-none">{item.icon}</span>
            <span className="text-[7px] mt-0.5 leading-tight font-medium tracking-wider uppercase text-center px-0.5 truncate w-full">
              {item.label.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
