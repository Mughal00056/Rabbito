import React from 'react';
import { useStore } from '../context/StoreContext';

export const LaunchCountdown: React.FC = () => {
  const { launchConfig } = useStore();

  if (launchConfig.mode !== 'public' || !launchConfig.isRunning) return null;

  const totalSecs = Math.max(0, launchConfig.secondsLeft || 0);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;

  return (
    <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 text-white text-xs relative overflow-hidden border-b border-purple-600/50 shadow-md">
      <div className="absolute inset-0 countdown-shine pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 relative z-10">
        <div className="flex items-center gap-1.5 shrink-0">
          <i className="fa-solid fa-rocket text-purple-200 text-sm countdown-pulse" />
          <span className="font-black uppercase tracking-wider text-[10px] sm:text-xs hidden sm:inline">
            Next Launch In
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="bg-black/50 backdrop-blur rounded-md px-2 py-0.5 min-w-[28px] text-center border border-purple-500/30">
            <span className="font-mono font-black text-sm text-purple-200">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[8px] uppercase text-purple-300/80 block -mt-1">min</span>
          </div>

          <span className="font-black text-purple-300">:</span>

          <div className="bg-black/50 backdrop-blur rounded-md px-2 py-0.5 min-w-[28px] text-center border border-purple-500/30">
            <span className="font-mono font-black text-sm text-purple-200">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[8px] uppercase text-purple-300/80 block -mt-1">sec</span>
          </div>
        </div>

        <div className="items-center gap-1.5 shrink-0 hidden md:flex">
          <span className="text-[11px] text-purple-100 font-medium bg-black/30 px-2 py-0.5 rounded-full border border-purple-400/20">
            New product drops automatically!
          </span>
        </div>
      </div>
    </div>
  );
};
