import React, { useState, useEffect } from 'react';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

export const Splash: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2200);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, #2d1155 0%, #0a0a0f 60%, #000000 100%)'
      }}
    >
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      <div className="relative z-10 flex flex-col items-center animate-[splashFadeInUp_1s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="splash-logo-mark">
          <img
            src={LOGO_URL}
            alt="ApexStore Logo"
            className="w-full h-full object-cover relative z-10 pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="mt-7 text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">
          Apex<span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-200 bg-clip-text text-transparent">Store</span>
        </div>

        <div className="mt-3 text-[11px] font-bold text-purple-300/80 tracking-[6px] uppercase">
          Premium Shopping
        </div>

        <div className="mt-10 w-44 h-1 bg-purple-900/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-300 rounded-full animate-[splashProgress_2.2s_cubic-bezier(0.65,0,0.35,1)_forwards] shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        </div>

        <div className="flex gap-2 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite]" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite_0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40 animate-[splashDotPulse_1.4s_ease-in-out_infinite_0.4s]" />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[1px] animate-[splashGlowPulse_2s_ease-in-out_infinite]" />
    </div>
  );
};
