import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AboutView: React.FC = () => {
  const { storeInfo, goHome, products } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-[fadeIn_0.2s_ease-out]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 mx-auto mb-4">
          <i className="fa-solid fa-circle-info text-2xl" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">About ApexStore</h1>
        <p className="text-xs text-purple-400 mt-1 uppercase tracking-widest font-bold">
          Excellence in E-Commerce
        </p>
      </div>

      <div className="bg-[#13131a] rounded-3xl border border-purple-900/40 p-6 sm:p-8 mb-6 shadow-xl shadow-purple-950/40">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
            alt="Founder Avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-3 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] shrink-0"
            draggable={false}
          />
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-white">{storeInfo.owner}</h2>
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
              Founder & Owner
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-800/40">
                <i className="fa-solid fa-location-dot text-purple-400" />
                <span>{storeInfo.city}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-800/40">
                <i className="fa-solid fa-phone text-purple-400" />
                <span>{storeInfo.phone}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-800/40">
                <i className="fa-solid fa-envelope text-purple-400" />
                <span>{storeInfo.email}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 pt-6 border-t border-purple-900/30 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 sm:p-4 bg-[#0a0a0f] rounded-2xl border border-purple-950/80">
            <p className="text-xl sm:text-2xl font-black text-purple-300">2K+</p>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">
              Customers
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-[#0a0a0f] rounded-2xl border border-purple-950/80">
            <p className="text-xl sm:text-2xl font-black text-purple-300">
              {Math.max(500, products.length * 20)}+
            </p>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">
              Products
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-[#0a0a0f] rounded-2xl border border-purple-950/80">
            <p className="text-xl sm:text-2xl font-black text-purple-300">4.9★</p>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">
              Rating
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={goHome}
        className="mt-6 w-full bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 text-white font-black py-4 rounded-xl transition shadow-lg shadow-purple-950/50 cursor-pointer uppercase tracking-wider text-xs sm:text-sm"
      >
        Back to Home
      </button>
    </div>
  );
};
