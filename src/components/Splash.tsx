import React, { useState, useEffect } from 'react';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

export const Splash: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    // Only show once per session for the best user experience
    return !sessionStorage.getItem('apex_splash_shown');
  });
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!visible) return;

    // Smooth snappy loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 6;
      });
    }, 45);

    const fadeTimer = setTimeout(() => {
      setFading(true);
      sessionStorage.setItem('apex_splash_shown', 'true');
    }, 1800);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [visible]);

  const handleSkip = () => {
    setFading(true);
    sessionStorage.setItem('apex_splash_shown', 'true');
    setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ease-out select-none cursor-pointer ${
        fading
          ? 'opacity-0 pointer-events-none scale-105 filter blur-sm'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #1f0b3b 0%, #0d0818 60%, #05030a 100%)'
      }}
    >
      {/* Background Glow Orbs */}
      <div className="splash-orb splash-orb-1 pointer-events-none opacity-50" />
      <div className="splash-orb splash-orb-2 pointer-events-none opacity-40" />

      {/* Central 3D Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center animate-[slideUpFade_0.6s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Logo with 3D Hologram Glow */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0a0a0f] p-1.5 border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.5)] overflow-hidden flex items-center justify-center relative">
            <img
              src={LOGO_URL}
              alt="ApexStore Logo"
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
              draggable={false}
            />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          </div>

          {/* Underglow shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-purple-600/40 rounded-full blur-lg" />
        </div>

        {/* Brand Name */}
        <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1 drop-shadow-md">
          Apex<span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-200 bg-clip-text text-transparent">Store</span>
        </div>

        <div className="text-[11px] font-bold tracking-[5px] text-purple-300/80 uppercase mb-8">
          Premium Shopping
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 bg-[#140c24] h-1.5 rounded-full overflow-hidden border border-purple-800/40 p-0.5 mb-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-300 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Skip hint */}
        <span className="text-[10px] font-semibold text-purple-400/60 uppercase tracking-widest hover:text-purple-300 transition">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};
