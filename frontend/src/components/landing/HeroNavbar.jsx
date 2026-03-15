import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/DeepEarth.png';

export default function HeroNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 relative z-10">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <img src={logoImg} alt="DeepEarth" className="h-7 object-contain" />
      </div>

      {/* Center Nav Links */}
      <ul className="hidden md:flex items-center gap-10">
        {['Home', 'LiveMap', 'About Us'].map((item) => (
          <li key={item}>
            <button
              onClick={() => {
                if (item === 'LiveMap') navigate('/map');
              }}
              className="text-[15px] font-medium text-white/90 hover:text-white
                         tracking-wide transition-colors duration-200 bg-transparent
                         border-none cursor-pointer relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white/70
                               rounded-full transition-all duration-300 group-hover:w-full" />
            </button>
          </li>
        ))}
      </ul>

      {/* Grid Menu Icon */}
      <button className="w-9 h-9 flex items-center justify-center rounded-lg
                         hover:bg-white/10 transition-colors duration-200">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.85" />
          <rect x="8" y="1" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.85" />
          <rect x="15" y="1" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.6" />
          <rect x="1" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.85" />
          <rect x="8" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.85" />
          <rect x="15" y="8" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.6" />
          <rect x="1" y="15" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.6" />
          <rect x="8" y="15" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.6" />
          <rect x="15" y="15" width="5" height="5" rx="1.2" fill="white" fillOpacity="0.6" />
        </svg>
      </button>
    </nav>
  );
}
