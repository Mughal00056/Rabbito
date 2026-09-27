import React, { useState, useEffect } from 'react';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

const SYSTEM_LOGS = [
  '⚡ [SYSTEM] Apex Hyper-Engine v5.4 Initializing...',
  '🛡️ [SECURITY] 256-Bit SSL Payment Guard Active',
  '💎 [CATALOG] 100% Verified Authentic Inventory Loaded',
  '🚀 [STATUS] Systems Armed • Ready for Launch'
];

export const Splash: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    return !sessionStorage.getItem('apex_splash_shown');
  });
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(12);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;

    // Fast dynamic progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + delta);
      });
    }, 60);

    // Fast cycling system logs
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % SYSTEM_LOGS.length);
    }, 450);

    // Smooth auto-fade
    const fadeTimer = setTimeout(() => {
      setFading(true);
      sessionStorage.setItem('apex_splash_shown', 'true');
    }, 2200);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2700);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [visible]);

  const handleEnter = () => {
    setFading(true);
    sessionStorage.setItem('apex_splash_shown', 'true');
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-out select-none cursor-pointer ${
        fading
          ? 'opacity-0 pointer-events-none scale-105 filter blur-md'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #18082e 0%, #0c0418 55%, #030108 100%)'
      }}
    >
      {/* Background Animated Cyber Mesh & Nebula Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/30 via-fuchsia-600/20 to-transparent rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-900/30 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-fuchsia-900/25 rounded-full blur-3xl" />
      </div>

      {/* Cyber Grid Lines (Subtle High-Tech Texture) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Central Powerful Showcase */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center animate-[slideUpFade_0.5s_cubic-bezier(0.22,1,0.36,1)]">
        
        {/* Holographic Glowing 3D Emblem Container */}
        <div className="relative mb-7 flex items-center justify-center">
          {/* Outer Pulsing Rotating Glow Ring */}
          <div className="absolute -inset-4 rounded-full border border-purple-500/30 animate-[spin_8s_linear_infinite] pointer-events-none shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
          <div className="absolute -inset-2 rounded-full border border-fuchsia-500/40 animate-[spin_5s_linear_infinite_reverse] pointer-events-none" />

          {/* Logo Card with 3D Glass & Neon Bezel */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#0d071b] p-2 border-2 border-purple-400/60 shadow-[0_0_60px_rgba(168,85,247,0.7)] overflow-hidden flex items-center justify-center relative group">
            <img
              src={LOGO_URL}
              alt="ApexStore Crest"
              className="w-full h-full object-cover rounded-2xl pointer-events-none transition-transform duration-500 group-hover:scale-105"
              draggable={false}
            />
            {/* Holographic dynamic light shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none animate-[pulse_2s_infinite]" />
          </div>

          {/* Core Under-Glow */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 rounded-full blur-xl opacity-80" />
        </div>

        {/* Brand Header with Electric Gradient */}
        <div className="space-y-1 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-[10px] font-black uppercase tracking-[3px] text-purple-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>OFFICIAL FLAGSHIP STORE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_15px_rgba(168,85,247,0.6)]">
            APEX<span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">STORE</span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold tracking-wide text-purple-200/90 uppercase">
            The Pinnacle of Luxury Shopping
          </p>
        </div>

        {/* Live Cyber Diagnostic Telemetry Log */}
        <div className="w-full max-w-xs bg-black/60 backdrop-blur-md rounded-xl border border-purple-800/50 py-1.5 px-3 mb-5 min-h-[28px] flex items-center justify-center">
          <span className="text-[11px] font-mono text-purple-300 truncate">
            {SYSTEM_LOGS[logIndex]}
          </span>
        </div>

        {/* Dynamic Voltage Progress Bar */}
        <div className="w-full max-w-xs mb-5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-purple-300 mb-1.5 px-1">
            <span>CORE BOOT</span>
            <span className="text-white font-black">{progress}%</span>
          </div>
          <div className="w-full bg-[#150a2b] h-2 rounded-full overflow-hidden border border-purple-700/60 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-amber-300 rounded-full transition-all duration-100 ease-out shadow-[0_0_15px_rgba(217,70,239,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ENTER STORE Powerful CTA */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="group px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-purple-950/80 border border-purple-400/50 hover:border-purple-300 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2.5"
          >
            <span>ENTER STORE NOW</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
          </button>

          <span className="text-[10px] font-semibold text-purple-400/60 uppercase tracking-widest mt-1">
            Tap anywhere to skip
          </span>
        </div>

      </div>
    </div>
  );
};
