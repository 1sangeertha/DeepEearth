import React from 'react';
import birdImg from '../../assets/bird.png';
import leavesImg from '../../assets/leaves3d.png';
import potImg from '../../assets/pot.png';

export default function HeroDecorations() {
  return (
    <>
      {/* ── Bird — top-right area, floating animation ──────────────────── */}
      <img
        src={birdImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute -top-6 right-16 w-28 md:w-36 lg:w-44
                   pointer-events-none select-none z-20 drop-shadow-2xl
                   animate-[float_4s_ease-in-out_infinite]"
      />

      {/* ── Leaves — right side, midway ────────────────────────────────── */}
      <img
        src={leavesImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-48 md:w-64 lg:w-72
                   pointer-events-none select-none z-20 drop-shadow-xl
                   animate-[floatSlow_6s_ease-in-out_infinite]"
      />

      {/* ── Pot — bottom-left ──────────────────────────────────────────── */}
      <img
        src={potImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute -bottom-4 left-8 w-24 md:w-32 lg:w-36
                   pointer-events-none select-none z-20 drop-shadow-xl
                   animate-[fadeInUp_1s_ease-out_0.5s_both]"
      />

      {/* ── Extra decorative leaves — top-left corner ─────────────────── */}
      <img
        src={leavesImg}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute -top-10 -left-10 w-36 md:w-44 rotate-[140deg] opacity-60
                   pointer-events-none select-none z-20
                   animate-[floatSlow_7s_ease-in-out_1s_infinite]"
      />
    </>
  );
}
