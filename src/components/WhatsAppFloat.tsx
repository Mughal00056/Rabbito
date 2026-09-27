import React from 'react';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloat: React.FC = () => {
  const {
    storeInfo,
    currentView,
    sideMenuOpen,
    searchSuggestionsOpen,
    cartDrawerOpen,
    notificationModalOpen,
    quickViewProduct,
    paymentModalOpen,
    aiModalOpen,
    receiptOrder
  } = useStore();

  const isAnyModalOpen =
    sideMenuOpen ||
    searchSuggestionsOpen ||
    cartDrawerOpen ||
    notificationModalOpen ||
    !!quickViewProduct ||
    paymentModalOpen ||
    aiModalOpen ||
    !!receiptOrder;

  const isVisible = currentView === 'home' && !isAnyModalOpen;

  if (!isVisible || !storeInfo.whatsapp) return null;

  return (
    <a
      href={storeInfo.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-4 sm:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.55)] hover:scale-110 active:scale-95 transition-all text-2xl sm:text-3xl"
      aria-label="Join WhatsApp Channel"
      title="Join WhatsApp Channel"
    >
      <i className="fa-brands fa-whatsapp" />
    </a>
  );
};
