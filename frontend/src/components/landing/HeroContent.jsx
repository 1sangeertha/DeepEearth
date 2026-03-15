import React from 'react';
import { useNavigate } from 'react-router-dom';
import headingImg from '../../assets/Monitor Planet with AI.png';

export default function HeroContent() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col justify-center px-8 md:px-14 pb-12 pt-4 relative z-10">
      {/* Heading Image — use the exported styled text asset */}
      <div className="mb-6 animate-[fadeInUp_0.8s_ease-out_both]">
        <img
          src={headingImg}
          alt="Monitor Planet with AI"
          className="w-[340px] md:w-[420px] lg:w-[480px] object-contain drop-shadow-lg select-none"
          draggable={false}
        />
      </div>

      {/* Description */}
      <p className="text-white/80 text-[15px] md:text-base leading-relaxed max-w-md mb-8
                    animate-[fadeInUp_0.8s_ease-out_0.15s_both] font-light tracking-wide">
        DeepEarth detects environmental changes using satellite AI.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-4 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
        <button
          id="btn-monitor"
          onClick={() => navigate('/map')}
          className="px-8 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase
                     bg-white/20 text-white border border-white/30
                     backdrop-blur-md shadow-lg shadow-black/10
                     hover:bg-white/30 hover:border-white/50 hover:shadow-xl hover:scale-[1.04]
                     active:scale-[0.97]
                     transition-all duration-300 ease-out"
        >
          Monitor
        </button>
        <button
          id="btn-alerts"
          onClick={() => navigate('/map')}
          className="px-8 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase
                     bg-white/10 text-white/90 border border-white/20
                     backdrop-blur-md
                     hover:bg-white/20 hover:border-white/35 hover:scale-[1.04]
                     active:scale-[0.97]
                     transition-all duration-300 ease-out"
        >
          Alerts
        </button>
      </div>
    </div>
  );
}
