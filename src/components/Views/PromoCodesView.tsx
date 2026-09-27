import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { copyToClipboard } from '../../utils/helpers';

export const PromoCodesView: React.FC = () => {
  const { promoCodes, applyPromoCode, goHome, setCartDrawerOpen, showToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(code);
      showToast(`Promo ${code} copied!`);
      setTimeout(() => setCopiedCode(null), 1800);
    }
  };

  const handleApply = (code: string) => {
    applyPromoCode(code);
    setCartDrawerOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={goHome}
          className="p-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Promo Codes</h1>
          <p className="text-xs text-purple-400 mt-0.5">Exclusive discounts and promotional offers</p>
        </div>
        <span className="bg-purple-950 text-purple-300 text-sm font-black px-3.5 py-1 rounded-full border border-purple-800/40">
          {promoCodes.length}
        </span>
      </div>

      {/* Grid */}
      {promoCodes.length === 0 ? (
        <div className="text-center py-20 text-purple-400">
          <i className="fa-solid fa-tags text-5xl mb-3 text-purple-500" />
          <p className="font-bold text-white text-base">No promo codes available right now</p>
          <p className="text-xs text-purple-400/80 mt-1">Check back soon for new offers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-12">
          {promoCodes.map((p) => {
            const isCopied = copiedCode === p.code;
            return (
              <div
                key={p.code}
                className="bg-gradient-to-br from-[#1a0a2e] to-[#2d1155] border-2 border-dashed border-purple-600/70 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-purple-950/40 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

                <div>
                  <div className="inline-block bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider mb-3">
                    {p.badge || 'PROMO'}
                  </div>

                  <div className="font-mono text-3xl font-black text-purple-300 tracking-wider mb-1 select-all break-all">
                    {p.code}
                  </div>

                  <div className="text-sm font-black text-purple-400 mb-1">
                    {Math.round(p.discount * 100)}% OFF ENTIRE ORDER
                  </div>

                  <p className="text-xs text-purple-200/80 font-medium leading-relaxed mb-6">
                    {p.desc || 'Limited time promotional code applicable at checkout.'}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(p.code)}
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#0a0a0f] text-purple-300 border-purple-800/80 hover:bg-purple-950'
                    }`}
                  >
                    <i className={`fa-regular ${isCopied ? 'fa-circle-check' : 'fa-copy'}`} />
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApply(p.code)}
                    className="flex-1 bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/50 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-bolt" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
