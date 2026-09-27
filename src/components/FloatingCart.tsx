import React from 'react';
import { useStore } from '../context/StoreContext';

export const FloatingCart: React.FC = () => {
  const {
    cart,
    cartCount,
    setCartDrawerOpen,
    currentView,
    cartDrawerOpen,
    paymentModalOpen,
    quickViewProduct,
    receiptOrder
  } = useStore();

  const isVisible =
    cart.length > 0 &&
    currentView === 'home' &&
    !cartDrawerOpen &&
    !paymentModalOpen &&
    !quickViewProduct &&
    !receiptOrder;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-[slideUpFade_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
      <button
        onClick={() => setCartDrawerOpen(true)}
        className="flex items-center gap-3 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 text-white px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(168,85,247,0.6)] cursor-pointer hover:scale-105 active:scale-95 transition-transform min-w-[280px] sm:min-w-[320px]"
      >
        {/* Stacked Thumbs */}
        <div className="flex items-center">
          {cart.slice(0, 3).map((item, idx) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.name}
              className={`w-9 h-9 rounded-full object-cover border-2 border-white pointer-events-none ${
                idx > 0 ? '-ml-3' : ''
              }`}
              draggable={false}
            />
          ))}
        </div>

        {/* Count Badge */}
        <div className="bg-white/25 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border border-white/40">
          {cartCount}
        </div>

        {/* Text */}
        <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase flex-1 text-center">
          VIEW CART
        </span>

        {/* Arrow */}
        <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-xs">
          <i className="fa-solid fa-arrow-right" />
        </div>
      </button>
    </div>
  );
};
