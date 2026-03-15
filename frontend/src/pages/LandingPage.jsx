import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import logoImg from '../assets/DeepEarth.png';
import birdImg from '../assets/bird.png';
import forestBg from '../assets/forest_bg.png';

/* ── Floating leaf shapes ── */
function FloatingLeaves() {
  const leaves = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    top: `${5 + Math.random() * 90}%`,
    size: 14 + Math.random() * 12,
    duration: 7 + Math.random() * 6,
    delay: Math.random() * 5,
    rotate: Math.random() * 60 - 30,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {leaves.map(l => (
        <svg
          key={l.id}
          className="floating-leaf absolute"
          style={{
            left: l.left, top: l.top,
            width: l.size, height: l.size,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
          }}
          viewBox="0 0 24 24" fill="#8B9E7C" opacity="0.35"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
        </svg>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [.22,1,.36,1] } },
  };
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: [.22,1,.36,1] } },
  };

  return (
    <div className="landing-root relative">
      {/* ── Background ── */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${forestBg})` }} />
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20" />
      <FloatingLeaves />

      {/* ── Main container ── */}
      <div className="relative z-10 h-screen w-screen flex items-center justify-center p-3 md:p-4">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="relative w-full h-full overflow-visible flex flex-col"
          style={{
            maxWidth: '95vw', maxHeight: '93vh',
            borderRadius: '24px',
            background: 'rgba(245, 240, 232, 0.12)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
          }}
        >
          {/* ── Bird decoration — large and prominent ── */}
          <motion.img src={birdImg} alt="" aria-hidden draggable={false} variants={scaleUp}
            className="absolute z-20 pointer-events-none select-none"
            style={{ top: '-10%', right: '-4%', width: '52%', maxWidth: '680px', animation: 'float 6s ease-in-out infinite' }} />

          {/* ── Navbar ── */}
          <motion.nav variants={fadeUp} className="relative z-10 flex items-center justify-between px-8 md:px-10 pt-6 pb-4">
            <div className="cursor-pointer select-none flex items-center gap-3" onClick={() => navigate('/')}>
              <img src={logoImg} alt="DeepEarth" className="h-7 object-contain" />
            </div>
            <ul className="hidden md:flex items-center gap-10">
              {['Home', 'LiveMap', 'About Us'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => { if (item === 'LiveMap') navigate('/map'); }}
                    className="text-[15px] font-medium text-white/85 hover:text-white
                               transition-all duration-300 bg-transparent border-none
                               cursor-pointer relative group tracking-wide"
                  >
                    {item.toLowerCase()}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-white/60
                                     rounded-full transition-all duration-400 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>
          </motion.nav>

          {/* ── Hero content ── */}
          <div className="flex-1 flex flex-col justify-center relative z-20 px-10 md:px-16">
            <motion.div variants={fadeUp} className="max-w-xl">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4 pl-1">
                ● environmental ai platform
              </span>
              <h1 className="font-display text-white leading-[1.1] mb-6"
                  style={{ fontSize: 'clamp(32px, 4.5vw, 72px)', fontWeight: 600 }}>
                Monitor<br />
                <span className="italic text-white/70">Planet</span> with<br />
                <span className="text-paradise-mint">AI</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg font-light tracking-wide">
                DeepEarth detects environmental changes across ecosystems
                using satellite imagery and deep learning.
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/map')}
                  className="btn-capsule btn-capsule-primary"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  Start Monitoring
                </motion.button>
                <motion.button
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/map')}
                  className="btn-capsule bg-white/10 text-white border border-white/20 hover:bg-white/20"
                >
                  View Alerts
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* ── Bottom info ── */}
          <motion.div variants={fadeUp} className="relative z-10 flex items-center justify-between px-8 md:px-10 pb-5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white font-display">22</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">regions</div>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <div className="text-xl font-bold text-white font-display">5</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">active alerts</div>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <div className="text-xl font-bold text-white font-display">AI</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">powered</div>
              </div>
            </div>
            <div className="text-[10px] text-white/40 tracking-wider">
              Powered by UNet + ConvLSTM • Sentinel-2
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
