import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/helpers';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, cart } = useStore();

  if (!quickViewProduct) return null;

  const inCart = cart.some((i) => i.id === quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl bg-[#13131a] rounded-3xl overflow-hidden border border-purple-900/40 shadow-2xl shadow-purple-950/70 animate-[slideUpFade_0.3s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#1a1a24] hover:bg-purple-900/50 text-purple-300 flex items-center justify-center shadow transition cursor-pointer"
          aria-label="Close"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-[#1a1a24] p-6 flex items-center justify-center">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="rounded-2xl max-h-72 object-cover shadow-lg pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">
                {quickViewProduct.category}
              </span>
              <h2 className="text-lg font-black text-white mb-2 leading-snug">
                {quickViewProduct.name}
              </h2>

              <div className="flex items-center gap-2 mb-3 text-xs">
                <i className="fa-solid fa-star text-amber-400" />
                <span className="font-bold text-purple-200">
                  {quickViewProduct.rating || 4.5}
                </span>
                <span className="text-purple-400/60">
                  ({quickViewProduct.reviews || 0} reviews)
                </span>
              </div>

              <p className="text-xs text-purple-200/80 leading-relaxed mb-4">
                {quickViewProduct.description || 'Premium craftsmanship engineered for perfection.'}
              </p>
            </div>

            <div>
              <div className="text-2xl font-black text-purple-300 mb-5">
                {formatPKR(quickViewProduct.price)}
                {quickViewProduct.oldPrice && (
                  <span className="text-xs text-purple-400/60 line-through ml-2 font-normal">
                    {formatPKR(quickViewProduct.oldPrice)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(quickViewProduct.id);
                  setQuickViewProduct(null);
                }}
                className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-[0.98] ${
                  inCart
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-purple-900/50'
                }`}
              >
                <i className={`fa-solid ${inCart ? 'fa-check' : 'fa-cart-plus'}`} />
                <span>{inCart ? 'ADDED TO CART' : 'ADD TO CART'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
