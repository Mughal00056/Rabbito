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

  const filterProducts = () => {
    if (!allViewFilter || allViewFilter === 'all') return visibleProducts;
    const f = allViewFilter.toLowerCase();
    switch (f) {
      case 'headphone':
        return visibleProducts.filter((p) => p.name.toLowerCase().includes('headphone') || p.category === 'Audio');
      case 'watch':
        return visibleProducts.filter((p) => p.name.toLowerCase().includes('watch') || p.category === 'Wearables');
      case 'shoe':
        return visibleProducts.filter((p) => /shoe|sneaker|loafer/i.test(p.name) || p.category === 'Footwear');
      case 'glasses':
        return visibleProducts.filter((p) => /glass|sunglass/i.test(p.name) || p.category === 'Accessories');
      case 'electronics':
        return visibleProducts.filter((p) => p.category === 'Electronics');
      default:
        return visibleProducts.filter(
          (p) => p.category.toLowerCase().includes(f) || p.name.toLowerCase().includes(f)
        );
    }
  };

  const list = filterProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goHome}
          className="p-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
          aria-label="Back to home"
        >
          <i className="fa-solid fa-arrow-left text-lg" />
        </button>
        <h1 className="text-2xl font-black text-white">{allViewTitle}</h1>
        <span className="bg-purple-950 text-purple-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-800/40">
          {list.length}
        </span>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="py-20 text-center text-purple-400">
          <i className="fa-solid fa-box-open text-5xl mb-3 text-purple-500" />
          <p className="font-bold text-white">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
          {list.map((p) => {
            const inCart = cart.some((i) => i.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => setQuickViewProduct(p)}
                className="bg-[#13131a] rounded-2xl overflow-hidden border border-purple-900/30 hover:border-purple-500 transition cursor-pointer flex flex-col justify-between shadow-md hover:-translate-y-1"
              >
                <div className="relative aspect-video sm:aspect-[4/3] bg-[#1a1a24] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover pointer-events-none hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    draggable={false}
                  />
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase rounded bg-purple-600 text-white">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-2 mb-1.5 min-h-[30px]">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2 text-[11px]">
                      <i className="fa-solid fa-star text-amber-400 text-[10px]" />
                      <span className="text-purple-200 font-bold">{p.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-900/20">
                    <span className="text-sm font-black text-purple-300">
                      {formatPKR(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold py-1.5 px-3 rounded-lg border transition cursor-pointer ${
                        inCart
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-[#1a1a24] text-purple-200 border-purple-900/60 hover:bg-purple-950'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <i className="fa-solid fa-check text-[10px]" />
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus text-[10px]" />
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
