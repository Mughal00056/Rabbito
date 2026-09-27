import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPKR } from '../../utils/helpers';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

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

  const [isLoading, setIsLoading] = useState(false);

  // Loading transition when search changes
  useEffect(() => {
    if (!searchQuery) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const query = searchQuery.toLowerCase().trim();

  const results = visibleProducts.filter(
    (p) =>
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 animate-[fadeIn_0.2s_ease-out] w-full overflow-hidden">
      {/* Top Search Filter Bar - responsive & bounded */}
      <div className="mb-6 w-full">
        <div className="flex items-center border-2 border-purple-800/80 rounded-2xl overflow-hidden bg-[#13131a] shadow-lg focus-within:border-purple-500 transition-colors">
          <div className="flex-1 px-3 sm:px-4 py-2 min-w-0">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">
              Search Catalog
            </p>
            <input
              type="text"
              placeholder="Search products, brands, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm sm:text-base font-semibold text-white outline-none bg-transparent placeholder-purple-600 truncate"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 sm:px-3 text-purple-400 hover:text-purple-300 transition cursor-pointer shrink-0"
              title="Clear search"
            >
              <i className="fa-solid fa-circle-xmark text-lg sm:text-xl" />
            </button>
          )}
          <div className="w-px h-8 bg-purple-900/60 shrink-0" />
          <button
            onClick={() => setSearchSuggestionsOpen(true)}
            className="px-3 sm:px-4 text-purple-400 hover:text-purple-300 transition cursor-pointer shrink-0"
            title="Browse suggestions"
          >
            <i className="fa-solid fa-magnifying-glass text-lg sm:text-xl" />
          </button>
        </div>
      </div>

      {/* Header Bar - Fixed so purple search text NEVER overflows screen on mobile or laptop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-purple-900/40 w-full min-w-0">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-xs sm:text-sm font-bold text-purple-300 flex flex-wrap items-center gap-1.5 break-words">
            <span>Showing</span>
            <span className="text-white font-black bg-purple-950 px-2 py-0.5 rounded-md border border-purple-800/50">
              {results.length}
            </span>
            <span>{results.length === 1 ? 'item' : 'items'} for:</span>
            <span className="text-purple-200 font-mono font-black bg-purple-900/50 px-2 py-0.5 rounded-lg border border-purple-600/40 break-all max-w-full inline-block truncate sm:max-w-md">
              "{searchQuery || 'All Catalog'}"
            </span>
          </div>
        </div>

        <button
          onClick={goHome}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto py-1 px-2.5 rounded-lg bg-[#181822] border border-purple-900/40 transition"
        >
          <i className="fa-solid fa-arrow-left text-[11px]" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Loading Screen with Logo PNG */}
      {isLoading ? (
        <div className="py-20 sm:py-24 flex flex-col items-center justify-center text-center animate-[fadeIn_0.15s_ease-out]">
          <div className="relative mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#13131a] p-1 border-2 border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.6)] flex items-center justify-center overflow-hidden animate-pulse">
              <img
                src={LOGO_URL}
                alt="ApexStore"
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
            </div>
            <div className="absolute -inset-2.5 rounded-3xl border border-purple-400/40 animate-ping pointer-events-none" />
          </div>
          <div className="text-xs sm:text-sm font-black text-white">Loading ApexStore Results...</div>
          <p className="text-[11px] text-purple-400/70 mt-1">Filtering products in real time</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 sm:py-20 text-center text-purple-400 px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#13131a] p-1 border border-purple-900/60 mx-auto mb-3 flex items-center justify-center opacity-80">
            <img src={LOGO_URL} alt="ApexStore" className="w-full h-full object-cover rounded-xl" />
          </div>
          <p className="font-bold text-white text-base">No products found for "{searchQuery}"</p>
          <p className="text-xs text-purple-400/80 mt-1 max-w-sm mx-auto">
            Try checking spelling or exploring categories like Audio, Wearables, and Footwear.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-12 w-full">
          {results.map((p) => {
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
