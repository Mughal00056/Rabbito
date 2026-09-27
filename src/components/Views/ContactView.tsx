import React from 'react';
import { useStore } from '../../context/StoreContext';

export const ContactView: React.FC = () => {
  const { storeInfo, goHome } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-[fadeIn_0.2s_ease-out]">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-900/50 mx-auto mb-4">
          <i className="fa-solid fa-envelope text-2xl" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Contact Us</h1>
        <p className="text-sm text-purple-400 mt-1">We'd love to hear from you!</p>
      </div>

      <div className="bg-[#13131a] rounded-3xl border border-purple-900/40 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#0a0a0f] border border-purple-950/80">
          <div className="w-11 h-11 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/40">
            <i className="fa-solid fa-envelope text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Email</p>
            <p className="text-sm font-bold text-white">{storeInfo.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#0a0a0f] border border-purple-950/80">
          <div className="w-11 h-11 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/40">
            <i className="fa-solid fa-phone text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Phone</p>
            <p className="text-sm font-bold text-white">{storeInfo.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#0a0a0f] border border-purple-950/80">
          <div className="w-11 h-11 rounded-xl bg-green-950/60 text-green-400 flex items-center justify-center shrink-0 border border-green-800/40">
            <i className="fa-brands fa-whatsapp text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">WhatsApp Channel</p>
            <a
              href={storeInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-green-400 hover:text-green-300 underline"
            >
              Join Official Channel
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#0a0a0f] border border-purple-950/80">
          <div className="w-11 h-11 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0 border border-purple-800/40">
            <i className="fa-solid fa-location-dot text-base" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Address</p>
            <p className="text-sm font-bold text-white">{storeInfo.city}</p>
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
