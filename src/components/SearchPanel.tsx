import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPKR } from '../utils/helpers';

const SUGGESTIONS = [
  'headphone',
  'wireless headphones',
  'earbuds',
  'smartwatch',
  'fitness watch',
  'sneakers',
  'running shoes',
  'sunglasses',
  'keyboard',
  'mouse',
  'speaker',
  'backpack',
  'wallet'
];

export const SearchPanel: React.FC = () => {
  const {
    searchSuggestionsOpen,
    setSearchSuggestionsOpen,
    performSearch,
    visibleProducts,
    setQuickViewProduct
  } = useStore();

  const [inputVal, setInputVal] = useState('');

  if (!searchSuggestionsOpen) return null;

  const trimmed = inputVal.trim().toLowerCase();

  const filteredSuggestions = trimmed
    ? SUGGESTIONS.filter((s) => s.includes(trimmed)).slice(0, 6)
    : SUGGESTIONS.slice(0, 5);

  const matchedProducts = trimmed
    ? visibleProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmed) ||
            p.category.toLowerCase().includes(trimmed)
        )
        .slice(0, 8)
    : [];

  const handleSelectSuggestion = (term: string) => {
    performSearch(term);
  };

  const handleSubmit = () => {
    if (!trimmed) return;
    performSearch(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col animate-[fadeIn_0.2s_ease-out]">
      {/* Top Search Bar */}
      <div className="p-3 sm:p-4 border-b border-purple-900/40 bg-[#13131a] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 border-2 border-purple-800 rounded-xl px-3 py-2 bg-[#0a0a0f]">
            <input
              type="text"
              autoFocus
              placeholder="Search products, brands, categories..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1 text-base font-semibold outline-none bg-transparent text-white placeholder-purple-600"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="text-purple-400 hover:text-purple-300 p-1 cursor-pointer"
              >
                <i className="fa-solid fa-circle-xmark text-lg" />
              </button>
            )}
            <div className="w-px h-6 bg-purple-900/80 mx-1" />
            <button
              type="button"
              onClick={handleSubmit}
              className="text-purple-400 hover:text-purple-300 p-1 cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass text-lg" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSearchSuggestionsOpen(false)}
            className="p-2 text-purple-300 hover:text-white rounded-xl transition cursor-pointer"
            aria-label="Close search"
          >
            <i className="fa-solid fa-xmark text-2xl" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 sm:p-6">
        {/* Suggestions list */}
        {filteredSuggestions.length > 0 && (
          <div className="mb-6">
            <div className="text-[11px] font-black tracking-widest text-purple-400 uppercase mb-3 px-2">
              SUGGESTIONS
            </div>
            <div className="space-y-1">
              {filteredSuggestions.map((term) => (
                <div
                  key={term}
                  onClick={() => handleSelectSuggestion(term)}
                  className="px-3 py-2.5 rounded-xl text-purple-100 hover:bg-[#1a1a24] hover:text-white flex items-center gap-3 cursor-pointer transition text-sm font-semibold"
                >
                  <i className="fa-solid fa-magnifying-glass text-purple-500 text-xs" />
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matched Products */}
        {matchedProducts.length > 0 && (
          <div>
            <div className="text-[11px] font-black tracking-widest text-purple-400 uppercase mb-3 px-2 border-t border-purple-900/30 pt-4">
              MATCHING PRODUCTS ({matchedProducts.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSearchSuggestionsOpen(false);
                    setQuickViewProduct(p);
                  }}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#1a1a24] transition cursor-pointer border border-transparent hover:border-purple-900/40"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#13131a] shrink-0"
                    draggable={false}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                      {p.category}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mb-1">
                      {p.name}
                    </h4>
                    <span className="text-xs font-black text-purple-300">
                      {formatPKR(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
