import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR } from '../../utils/helpers';

export const AllProductsView: React.FC = () => {
  const {
    allViewTitle,
    allViewFilter,
    visibleProducts,
    goHome,
    setQuickViewProduct,
    addToCart,
    cart
  } = useStore();

  const filter = allViewFilter.toLowerCase();
  const list = visibleProducts.filter((p) => {
    if (!filter || filter === 'all') return true;
    switch (filter) {
      case 'headphone':
        return p.name.toLowerCase().includes('headphone') || p.category === 'Audio';
      case 'watch':
        return p.name.toLowerCase().includes('watch') || p.category === 'Wearables';
      case 'shoe':
        return /shoe|sneaker|loafer/i.test(p.name) || p.category === 'Footwear';
      case 'glasses':
        return /glass|sunglass/i.test(p.name) || p.category === 'Accessories';
      case 'electronics':
        return p.category === 'Electronics';
      case 'audio':
        return p.category === 'Audio';
      case 'wearables':
        return p.category === 'Wearables';
      case 'accessories':
        return p.category === 'Accessories';
      case 'footwear':
        return p.category === 'Footwear';
      default:
        return p.category.toLowerCase().includes(filter) || p.name.toLowerCase().includes(filter);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 animate-[fadeIn_0.2s_ease-out] w-full overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-900/40">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white">{allViewTitle}</h2>
          <span className="text-xs text-purple-400 font-bold">{list.length} products available</span>
        </div>
        <button
          onClick={goHome}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-lg bg-[#181822] border border-purple-900/40 transition"
        >
          <i className="fa-solid fa-arrow-left" /> Back to Home
        </button>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center text-purple-400">
          <p className="font-bold text-white text-base">No products found in this category</p>
          <p className="text-xs text-purple-400/80 mt-1">Check back soon for fresh arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12 w-full">
          {list.map((p) => {
            const inCart = cart.some((i) => i.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => setQuickViewProduct(p)}
                className="product-card-3d bg-[#13131a] rounded-2xl overflow-hidden border border-purple-900/40 cursor-pointer flex flex-col justify-between shadow-lg group max-w-full"
              >
                <div className="relative aspect-video sm:aspect-[4/3] bg-[#1a1a24] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                    }}
                  />
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md animate-pulse">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-transparent to-transparent opacity-50" />
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-white line-clamp-2 mb-1.5 min-h-[32px] group-hover:text-purple-300 transition-colors break-words">
                      {p.name}
                    </h3>
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-2">
                      {p.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-purple-900/20">
                    <span className="text-xs sm:text-base font-black text-purple-300 truncate">
                      {formatPKR(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id, e);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-extrabold py-1.5 px-2.5 sm:px-3 rounded-xl border transition-all duration-200 cursor-pointer active:scale-90 shrink-0 ${
                        inCart
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/50'
                          : 'bg-[#1a1a24] text-purple-200 border-purple-800/60 hover:bg-purple-900 hover:text-white hover:border-purple-400'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <i className="fa-solid fa-check text-[10px]" />
                          <span className="hidden xs:inline">ADDED</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus text-[10px]" />
                          <span className="hidden xs:inline">ADD</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
