import React from 'react';
import { useStore } from '../context/StoreContext';

const LOGO_URL = 'https://i.supaimg.com/0ffab3ca-b15e-48fd-a213-7db2aa7158cc/bb9ac2b2-70ac-461a-b3d7-1d8aabf1a38c.jpg';

export const Header: React.FC = () => {
  const {
    goHome,
    setSideMenuOpen,
    setSearchSuggestionsOpen,
    setNotificationModalOpen,
    setCartDrawerOpen,
    unreadNotificationCount,
    cartCount
  } = useStore();

  return (
    <header className="bg-[#13131a]/95 backdrop-blur-md border-b border-purple-900/40 shadow-lg shadow-purple-950/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Left: Menu & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideMenuOpen(true)}
              className="relative p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
              aria-label="Open navigation menu"
            >
              <i className="fa-solid fa-bars text-xl" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-500/50" />
              )}
            </button>

            <button
              onClick={goHome}
              className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#13131a] text-white flex items-center justify-center shadow-lg shadow-purple-900/50 overflow-hidden border border-purple-500/40 group-hover:border-purple-400 transition">
                <img
                  src={LOGO_URL}
                  alt="ApexStore Logo"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Apex<span className="text-purple-400">Store</span>
                </span>
              </div>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchSuggestionsOpen(true)}
              className="p-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
              aria-label="Search catalog"
            >
              <i className="fa-solid fa-magnifying-glass text-xl" />
            </button>

            <button
              onClick={() => setNotificationModalOpen(true)}
              className="relative p-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
              aria-label="View notifications"
            >
              <i className="fa-regular fa-bell text-xl" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-purple-500 text-white text-[9px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-950/40 rounded-xl transition cursor-pointer"
              aria-label="View cart"
            >
              <i className="fa-solid fa-cart-shopping text-xl" />
              <span className="absolute top-1 right-1 bg-purple-500 text-white text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
