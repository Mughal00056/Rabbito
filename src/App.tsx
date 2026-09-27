/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Splash } from './components/Splash';
import { Header } from './components/Header';
import { SideMenu } from './components/SideMenu';
import { AnnouncementBar } from './components/AnnouncementBar';
import { BannerSection } from './components/BannerSection';
import { LaunchCountdown } from './components/LaunchCountdown';
import { GallerySection } from './components/GallerySection';
import { CategoryChips } from './components/CategoryChips';
import { DynamicSections } from './components/DynamicSections';
import { FloatingCart } from './components/FloatingCart';
import { CartDrawer } from './components/CartDrawer';
import { SearchPanel } from './components/SearchPanel';
import { NotificationModal } from './components/NotificationModal';
import { QuickViewModal } from './components/QuickViewModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

// Views
import { AllProductsView } from './components/Views/AllProductsView';
import { SearchResultsView } from './components/Views/SearchResultsView';
import { PromoCodesView } from './components/Views/PromoCodesView';
import { ContactView } from './components/Views/ContactView';
import { AboutView } from './components/Views/AboutView';

const MainLayout: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative">
      {/* Intro Splash Screen */}
      <Splash />

      {/* Global Navigation Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <AnnouncementBar />
            <BannerSection />
            <LaunchCountdown />
            <GallerySection />
            <CategoryChips />
            <DynamicSections />
          </>
        )}

        {currentView === 'all' && <AllProductsView />}
        {currentView === 'search' && <SearchResultsView />}
        {currentView === 'promo' && <PromoCodesView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Elements & Drawers */}
      <FloatingCart />
      <WhatsAppFloat />
      <SideMenu />
      <CartDrawer />
      <SearchPanel />
      <NotificationModal />
      <QuickViewModal />
      <PaymentModal />
      <ReceiptModal />
      <AIAssistantModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
