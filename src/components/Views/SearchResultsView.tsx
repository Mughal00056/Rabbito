import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR } from '../../utils/helpers';

export const SearchResultsView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    visibleProducts,
    goHome,
    setQuickViewProduct,
    addToCart,
    cart,
    setSearchSuggestionsOpen
  } = useStore();

  const query = searchQuery.toLowerCase().trim();

  const results = visibleProducts.filter(
    (p) =>
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-[fadeIn_0.2s_ease-out]">
      {/* Top Search Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-purple-800/80 rounded-2xl overflow-hidden bg-[#13131a] shadow-lg">
          <div className="flex-1 px-4 py-2.5">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">
              Search Catalog
            </p>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base font-semibold text-white outline-none bg-transparent placeholder-purple-600"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 text-purple-400 hover:text-purple-300 transition cursor-pointer"
            >
              <i className="fa-solid fa-circle-xmark text-xl" />
            </button>
          )}
          <div className="w-px h-8 bg-purple-900/60" />
          <button
            onClick={() => setSearchSuggestionsOpen(true)}
            className="px-4 text-purple-400 hover:text-purple-300 transition cursor-pointer"
          >
            <i className="fa-solid fa-magnifying-glass text-xl" />
          </button>
        </div>
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-900/40">
        <span className="text-sm font-bold text-purple-300">
          {results.length} result{results.length === 1 ? '' : 's'} for "{searchQuery || 'all'}"
        </span>
        <button
          onClick={goHome}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left" /> Back to Home
        </button>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="py-20 text-center text-purple-400">
          <i className="fa-solid fa-box-open text-5xl mb-3 text-purple-500" />
          <p className="font-bold text-white text-base">No products found</p>
          <p className="text-xs text-purple-400/80 mt-1">Try another search keyword or check our categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
          {results.map((p) => {
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
