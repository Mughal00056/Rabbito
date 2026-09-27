import React, { useState, useEffect, useRef } from 'react';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

export const Splash: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Progress Counter
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2500);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // 3D Parallax Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 28;
    const rotateY = (x / rect.width) * 28;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out splash-3d-space select-none ${
        fading
          ? 'opacity-0 pointer-events-none scale-110 filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #1f0b3b 0%, #0c0818 50%, #030206 100%)'
      }}
    >
      {/* 3D Cosmic Background Nebulas */}
      <div className="splash-orb splash-orb-1 pointer-events-none" />
      <div className="splash-orb splash-orb-2 pointer-events-none" />
      <div className="splash-orb splash-orb-3 pointer-events-none" />

      {/* Floating 3D Starfield particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-300"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 19) % 100}%`,
              left: `${(i * 29) % 100}%`,
              opacity: 0.2 + (i % 6) * 0.12,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 8px rgba(192, 132, 252, 0.8)',
              animation: `splashDotPulse ${2 + (i % 3)}s ease-in-out infinite ${(i * 0.2)}s`
            }}
          />
        ))}
      </div>

      {/* 3D Holographic Orbit Rings */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <div className="orbit-ring orbit-ring-1" />
        <div className="orbit-ring orbit-ring-2" />
      </div>

      {/* 3D Tiltable Central Showcase */}
      <div
        className="splash-3d-card relative z-10 flex flex-col items-center cursor-pointer"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
      >
        {/* 3D Logo Cube & Glass Prism */}
        <div className="relative flex items-center justify-center">
          <div className="splash-logo-mark-3d group">
            <img
              src={LOGO_URL}
              alt="ApexStore 3D Logo"
              className="w-full h-full object-cover relative z-10 pointer-events-none rounded-[28px] p-0.5"
              draggable={false}
            />

            {/* Dynamic Glass Glare */}
            <div
              className="absolute inset-0 pointer-events-none z-20 rounded-[28px] opacity-40 transition-opacity"
              style={{
                background: `radial-gradient(circle at ${50 + tilt.y * 1.5}% ${50 - tilt.x * 1.5}%, rgba(255,255,255,0.7) 0%, transparent 60%)`
              }}
            />
          </div>

          {/* Underglow 3D Shadow Plate */}
          <div className="absolute -bottom-6 w-32 h-6 bg-purple-600/40 rounded-full blur-xl transform scale-y-50" />
        </div>

        {/* 3D Typography */}
        <div className="mt-8 text-4xl sm:text-6xl font-black tracking-tighter text-white leading-none text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Apex
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-200 bg-clip-text text-transparent ml-0.5 filter drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
            Store
          </span>
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <span className="h-px w-8 bg-purple-500/50" />
          <div className="text-[11px] sm:text-xs font-black text-purple-300/90 tracking-[7px] uppercase filter drop-shadow">
            PREMIUM SHOPPING
          </div>
          <span className="h-px w-8 bg-purple-500/50" />
        </div>

        {/* Interactive Progress Bar */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="w-52 h-1.5 bg-[#1a0f30] rounded-full overflow-hidden border border-purple-500/30 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-200 rounded-full transition-all duration-75 shadow-[0_0_15px_rgba(192,132,252,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] font-mono font-bold text-purple-400/80 tracking-widest">
            LOADING EXPERIENCE {progress}%
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2.5 mt-5">
          <span className="w-2 h-2 rounded-full bg-purple-400/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite]" />
          <span className="w-2 h-2 rounded-full bg-purple-400/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite_0.2s]" />
          <span className="w-2 h-2 rounded-full bg-purple-400/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite_0.4s]" />
        </div>

        {/* Quick Skip Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFading(true);
            setTimeout(() => setVisible(false), 300);
          }}
          className="mt-6 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-purple-300/80 hover:text-white text-[10px] font-extrabold tracking-widest uppercase border border-purple-500/20 backdrop-blur-md transition-all cursor-pointer"
        >
          ENTER STORE <i className="fa-solid fa-arrow-right ml-1 text-[9px]" />
        </button>
      </div>

      {/* Laser Horizon Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[2px] animate-[splashGlowPulse_2s_ease-in-out_infinite]" />
    </div>
  );
};
