import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { formatPKR } from '../utils/helpers';

export const DynamicSections: React.FC = () => {
  const {
    visibleProducts,
    sections,
    activeCategory,
    openSectionAllView,
    setQuickViewProduct,
    addToCart,
    cart
  } = useStore();

  const filterProducts = (filter: string): Product[] => {
    if (!filter || filter === 'all') return visibleProducts;
    const f = filter.toLowerCase();
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
      case 'audio':
        return visibleProducts.filter((p) => p.category === 'Audio');
      case 'wearables':
        return visibleProducts.filter((p) => p.category === 'Wearables');
      case 'accessories':
        return visibleProducts.filter((p) => p.category === 'Accessories');
      case 'footwear':
        return visibleProducts.filter((p) => p.category === 'Footwear');
      default:
        return visibleProducts.filter(
          (p) => p.category.toLowerCase().includes(f) || p.name.toLowerCase().includes(f)
        );
    }
  };

  const renderProductCard = (p: Product, isHorizontal: boolean) => {
    const inCart = cart.some((i) => i.id === p.id);

    if (isHorizontal) {
      return (
        <div
          key={p.id}
          onClick={() => setQuickViewProduct(p)}
          className="min-w-[160px] max-w-[160px] shrink-0 bg-[#13131a] rounded-xl overflow-hidden border border-purple-900/30 shadow-md hover:-translate-y-1 hover:border-purple-500 hover:shadow-purple-900/40 transition cursor-pointer slide-up-card flex flex-col justify-between"
        >
          <div className="relative w-full aspect-video overflow-hidden bg-[#1a1a24]">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover pointer-events-none hover:scale-105 transition-transform duration-300"
              loading="lazy"
              draggable={false}
            />
            {p.badge && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-purple-600 text-white shadow">
                {p.badge}
              </span>
            )}
          </div>
          <div className="p-2.5 flex flex-col flex-1 justify-between">
            <div>
              <div className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2 min-h-[30px]">
                {p.name}
              </div>
              <div className="flex items-center gap-1 mb-1.5 text-[11px]">
                <i className="fa-solid fa-star text-amber-400 text-[10px]" />
                <span className="text-purple-200 font-bold">{p.rating || 4.5}</span>
                <span className="text-purple-400/60 text-[10px]">({p.reviews || 0})</span>
              </div>
              <div className="text-sm font-black text-purple-300 mb-2">
                {formatPKR(p.price)}
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p.id);
                }}
                className={`inline-flex items-center gap-1 text-[11px] font-bold py-1 px-3 rounded-lg border transition cursor-pointer ${
                  inCart
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-[#1a1a24] text-purple-200 border-purple-900/60 hover:bg-purple-950 hover:border-purple-500'
                }`}
              >
                {inCart ? (
                  <>
                    <i className="fa-solid fa-check text-[10px]" /> ADDED
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus text-[10px]" /> ADD
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Vertical Card
    return (
      <div
        key={p.id}
        onClick={() => setQuickViewProduct(p)}
        className="bg-[#13131a] rounded-xl overflow-hidden border border-purple-900/30 shadow-md hover:-translate-y-1 hover:border-purple-500 hover:shadow-purple-900/40 transition cursor-pointer slide-up-card flex flex-col justify-between"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#1a1a24]">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover pointer-events-none hover:scale-105 transition-transform duration-300"
            loading="lazy"
            draggable={false}
          />
          {p.badge && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase rounded bg-purple-600 text-white shadow">
              {p.badge}
            </span>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1 justify-between">
          <div>
            <div className="text-xs font-bold text-white leading-tight mb-1 line-clamp-2 min-h-[30px]">
              {p.name}
            </div>
            <div className="flex items-center gap-1 mb-1.5 text-[11px]">
              <i className="fa-solid fa-star text-amber-400 text-[10px]" />
              <span className="text-purple-200 font-bold">{p.rating || 4.5}</span>
              <span className="text-purple-400/60 text-[10px]">({p.reviews || 0})</span>
            </div>
            <div className="text-sm font-black text-purple-300 mb-2">
              {formatPKR(p.price)}
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(p.id);
              }}
              className={`inline-flex items-center gap-1 text-xs font-bold py-1.5 px-3.5 rounded-lg border transition cursor-pointer ${
                inCart
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-[#1a1a24] text-purple-200 border-purple-900/60 hover:bg-purple-950 hover:border-purple-500'
              }`}
            >
              {inCart ? (
                <>
                  <i className="fa-solid fa-check text-[10px]" /> ADDED
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus text-[10px]" /> ADD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // If a specific category is selected (not 'all')
  if (activeCategory !== 'all') {
    const filtered = filterProducts(activeCategory);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 section-fade-up">
        <div className="flex justify-between items-center px-1 mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {activeCategory.toUpperCase()} PRODUCTS
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-purple-400">
            <i className="fa-solid fa-box-open text-5xl mb-3 text-purple-500" />
            <p className="font-bold text-white">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {filtered.map((p) => renderProductCard(p, false))}
          </div>
        )}
      </div>
    );
  }

  // Multi-section home layout
  const activeSections = sections
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  if (activeSections.length === 0) {
    return (
      <div className="text-center py-20 text-purple-400">
        <i className="fa-solid fa-box-open text-5xl mb-3 text-purple-500" />
        <p className="font-bold text-white">No products available yet</p>
        <p className="text-xs text-purple-400/80 mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {activeSections.map((section) => {
        const items = filterProducts(section.filter);
        if (items.length === 0) return null;

        const isHorizontal = section.layout === 'horizontal' || !section.layout;

        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 section-fade-up">
            <div className="flex justify-between items-center px-1 mb-3">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {section.title}
              </h2>
              <button
                type="button"
                onClick={() => openSectionAllView(section.filter, section.title)}
                className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition cursor-pointer"
              >
                View all <i className="fa-solid fa-arrow-right text-[11px]" />
              </button>
            </div>

            {isHorizontal ? (
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-3 scroll-smooth no-scrollbar">
                {items.map((p) => renderProductCard(p, true))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5">
                {items.map((p) => renderProductCard(p, false))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
