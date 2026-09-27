import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  CartItem,
  PromoCode,
  SectionConfig,
  StoreInfo,
  AnnouncementSettings,
  StoreNotification,
  PaymentMethodsConfig,
  CustomPaymentMethod,
  Order,
  OrderStatus,
  LaunchConfig
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SECTIONS,
  INITIAL_PROMO_CODES,
  INITIAL_STORE_INFO,
  INITIAL_ANNOUNCEMENT,
  INITIAL_GALLERY_IMAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_LAUNCH_CONFIG
} from '../data/mockData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FlyingParticle {
  id: string;
  x: number;
  y: number;
  image: string;
}

interface StoreContextType {
  // Navigation & Views
  currentView: 'home' | 'all' | 'search' | 'promo' | 'contact' | 'about';
  setCurrentView: (view: 'home' | 'all' | 'search' | 'promo' | 'contact' | 'about') => void;
  goHome: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  allViewTitle: string;
  allViewFilter: string;
  openSectionAllView: (filter: string, title: string) => void;

  // Catalog
  products: Product[];
  visibleProducts: Product[];
  sections: SectionConfig[];
  promoCodes: PromoCode[];
  storeInfo: StoreInfo;
  announcement: AnnouncementSettings;
  bannerImage: string;
  galleryImages: string[];
  galleryEnabled: boolean;
  launchConfig: LaunchConfig;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchSuggestionsOpen: boolean;
  setSearchSuggestionsOpen: (open: boolean) => void;
  performSearch: (query: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  appliedDiscount: number;
  discountAmount: number;
  cartTotal: number;
  addToCart: (productId: number, event?: React.MouseEvent) => void;
  updateCartQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;

  // Modals & Drawers
  sideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  notificationModalOpen: boolean;
  setNotificationModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  receiptOrder: Order | null;
  setReceiptOrder: (order: Order | null) => void;
  reviewProduct: Product | null;
  setReviewProduct: (product: Product | null) => void;

  // Admin Panel
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
  orders: Order[];
  updateOrderStatus: (orderId: number, status: OrderStatus, reason?: string) => void;
  saveNewProduct: (prod: Product) => void;
  savePromoCode: (promo: PromoCode) => void;
  saveStoreInfo: (info: StoreInfo) => void;

  // Notifications
  notifications: StoreNotification[];
  readNotificationIds: string[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Payment & Checkout
  paymentConfig: PaymentMethodsConfig;
  customPaymentMethods: CustomPaymentMethod[];
  currentOrder: Order | null;
  orderStatus: OrderStatus;
  approvalSecondsLeft: number;
  startCheckout: () => void;
  confirmPayment: (details: {
    method: string;
    email: string;
    senderMobile: string;
    transactionId: string;
    proofUrl: string;
  }) => void;
  cancelPayment: () => void;
  manualApproveOrder: (orderId: number) => void;

  // Toast & Flying Animation
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  flyingParticles: FlyingParticle[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_CART = 'apex_cart';
const LOCAL_STORAGE_ORDERS = 'apex_orders';
const LOCAL_STORAGE_NOTIFS = 'apex_notifications';
const LOCAL_STORAGE_READ_NOTIFS = 'apex_read_notifs';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'all' | 'search' | 'promo' | 'contact' | 'about'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allViewTitle, setAllViewTitle] = useState<string>('All Products');
  const [allViewFilter, setAllViewFilter] = useState<string>('all');

  // Products & Settings
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sections, setSections] = useState<SectionConfig[]>(INITIAL_SECTIONS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(INITIAL_STORE_INFO);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>(INITIAL_ANNOUNCEMENT);
  const [bannerImage, setBannerImage] = useState<string>('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>(INITIAL_GALLERY_IMAGES);
  const [galleryEnabled, setGalleryEnabled] = useState<boolean>(true);
  const [launchConfig, setLaunchConfig] = useState<LaunchConfig>(INITIAL_LAUNCH_CONFIG);
  const [paymentConfig, setPaymentConfig] = useState<PaymentMethodsConfig>(INITIAL_PAYMENT_CONFIG);
  const [customPaymentMethods, setCustomPaymentMethods] = useState<CustomPaymentMethod[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState<boolean>(false);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Orders State (Persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);

  // Notifications State (Persisted)
  const [notifications, setNotifications] = useState<StoreNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_READ_NOTIFS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders and Checkout State
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [approvalSecondsLeft, setApprovalSecondsLeft] = useState<number>(300);

  // Flying item particles
  const [flyingParticles, setFlyingParticles] = useState<FlyingParticle[]>([]);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Sync notifications
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTIFS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_READ_NOTIFS, JSON.stringify(readNotificationIds));
    } catch {}
  }, [readNotificationIds]);

  // Launch countdown timer
  useEffect(() => {
    if (!launchConfig.isRunning || launchConfig.mode !== 'public') return;
    const interval = setInterval(() => {
      setLaunchConfig((prev) => ({
        ...prev,
        secondsLeft: prev.secondsLeft > 0 ? prev.secondsLeft - 1 : 0
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [launchConfig.isRunning, launchConfig.mode]);

  // Approval Countdown Timer (runs when order is pending or processing)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (paymentModalOpen && (orderStatus === 'pending' || orderStatus === 'processing')) {
      interval = setInterval(() => {
        setApprovalSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentModalOpen, orderStatus]);

  // Firebase Realtime DB sync & initial fetch
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const res = await fetch('https://portfolio-art-2d73d-default-rtdb.firebaseio.com/apexstore.json');
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (Array.isArray(data.promos) && data.promos.length > 0) {
          setPromoCodes(data.promos.filter((p: PromoCode) => p.active !== false));
        }
        if (Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections.filter((s: SectionConfig) => s.active !== false));
        }
        if (data.storeSettings) {
          setStoreInfo({
            owner: data.storeSettings.owner || INITIAL_STORE_INFO.owner,
            city: data.storeSettings.city || INITIAL_STORE_INFO.city,
            phone: data.storeSettings.phone || INITIAL_STORE_INFO.phone,
            email: data.storeSettings.email || INITIAL_STORE_INFO.email,
            whatsapp: data.storeSettings.whatsapp || INITIAL_STORE_INFO.whatsapp,
            paymentNumber: data.storeSettings.paymentNumber || INITIAL_STORE_INFO.paymentNumber
          });
        }
        if (data.announcementSettings) {
          setAnnouncement({
            specialText: data.announcementSettings.offerText || INITIAL_ANNOUNCEMENT.specialText,
            promoCode: data.announcementSettings.offerCode || INITIAL_ANNOUNCEMENT.promoCode,
            shipping: data.announcementSettings.marqueeShipping || INITIAL_ANNOUNCEMENT.shipping,
            newArrivals: data.announcementSettings.marqueeNewArrivals || INITIAL_ANNOUNCEMENT.newArrivals,
            reviews: data.announcementSettings.marqueeReviews || INITIAL_ANNOUNCEMENT.reviews
          });
        }
        if (data.bannerImage) {
          setBannerImage(data.bannerImage);
        }
        if (Array.isArray(data.gallery) && data.gallery.length > 0) {
          setGalleryImages(data.gallery);
        }
        if (data.paymentMethods) {
          setPaymentConfig(data.paymentMethods);
        }
        if (Array.isArray(data.customPaymentMethods)) {
          setCustomPaymentMethods(data.customPaymentMethods.filter((c: CustomPaymentMethod) => c.active !== false));
        }
        if (data.launchConfig) {
          setLaunchConfig(data.launchConfig);
        }
        if (data.orders) {
          const list = Array.isArray(data.orders) ? data.orders : Object.values(data.orders);
          setOrders(list as Order[]);
        }
      } catch {
        // Fallback gracefully
      }
    };

    fetchFirebaseData();
  }, []);

  // Visible Products
  const visibleProducts = products.filter((p) => p.public !== false);

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cartSubtotal * appliedDiscount;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Trigger Flying particle to cart icon
  const triggerFlyParticle = (x: number, y: number, image: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setFlyingParticles((prev) => [...prev, { id, x, y, image }]);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => p.id !== id));
    }, 750);
  };

  // Add to cart with optional flying animation
  const addToCart = (productId: number, event?: React.MouseEvent) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (event) {
      triggerFlyParticle(event.clientX, event.clientY, product.image);
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const updateCartQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const found = promoCodes.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setAppliedDiscount(found.discount);
      showToast(`Promo Applied! ${Math.round(found.discount * 100)}% OFF`);
      return true;
    }
    showToast('Invalid promo code', 'error');
    return false;
  };

  // Search
  const performSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    if (trimmed.length > 0) {
      setCurrentView('search');
      setSearchSuggestionsOpen(false);
    } else {
      setCurrentView('home');
    }
  };

  // Open Section All View
  const openSectionAllView = (filter: string, title: string) => {
    setAllViewFilter(filter);
    setAllViewTitle(title);
    setCurrentView('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    setSideMenuOpen(false);
    setCartDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !readNotificationIds.includes(n.id)).length;

  const markNotificationRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      setReadNotificationIds((prev) => [...prev, id]);
    }
  };

  const markAllNotificationsRead = () => {
    setReadNotificationIds(notifications.map((n) => n.id));
    showToast('All notifications marked as read');
  };

  // Checkout & Payment
  const startCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    setCartDrawerOpen(false);
    setPaymentModalOpen(true);
  };

  const cancelPayment = () => {
    setPaymentModalOpen(false);
    setOrderStatus('pending');
  };

  // Confirm payment: Enters waiting state, starts 5-minute timer, but WAITS FOR ADMIN!
  const confirmPayment = (details: {
    method: string;
    email: string;
    senderMobile: string;
    transactionId: string;
    proofUrl: string;
  }) => {
    const orderId = Date.now();
    const newOrder: Order = {
      id: orderId,
      customer: 'Guest Buyer',
      email: details.email || 'customer@apexstore.io',
      items: cart.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: cartTotal,
      method: details.method,
      transactionId: details.transactionId,
      proofUrl: details.proofUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setCurrentOrder(newOrder);
    setOrderStatus('pending');
    setApprovalSecondsLeft(300);

    // Save order in state & localStorage
    setOrders((prev) => [newOrder, ...prev]);

    // Push to Firebase RTDB
    fetch('https://portfolio-art-2d73d-default-rtdb.firebaseio.com/apexstore/orders.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    showToast('Payment submitted! Awaiting Admin verification.', 'info');
    // Note: We DO NOT automatically verify via timeout! It waits for the Admin Panel to accept!
  };

  // Admin action: updates an order's status
  const updateOrderStatus = (orderId: number, status: OrderStatus, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // If the affected order is the active customer order on screen:
    if (currentOrder && currentOrder.id === orderId) {
      setOrderStatus(status);

      if (status === 'verified') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        const updated = { ...currentOrder, status: 'verified' as OrderStatus };
        setCurrentOrder(updated);
        setReceiptOrder(updated);
        setPaymentModalOpen(false);
        clearCart();
        showToast('Payment Verified by Admin! 🎉', 'success');
      } else if (status === 'rejected') {
        showToast(`Order #${String(orderId).slice(-6)} was rejected by Admin${reason ? ': ' + reason : ''}`, 'error');
      } else if (status === 'processing') {
        showToast(`Order #${String(orderId).slice(-6)} is marked as Processing by Admin`, 'info');
      }
    } else {
      showToast(`Order #${String(orderId).slice(-6)} marked as ${status}`);
    }

    // Sync to Firebase
    fetch('https://portfolio-art-2d73d-default-rtdb.firebaseio.com/apexstore/orders.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orders.map((o) => (o.id === orderId ? { ...o, status } : o)))
    }).catch(() => {});
  };

  // Quick manual approve for current active order
  const manualApproveOrder = (orderId: number) => {
    updateOrderStatus(orderId, 'verified');
  };

  // Admin store management functions
  const saveNewProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    showToast(`Added product: ${prod.name}`);
  };

  const savePromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
    showToast(`Saved promo code: ${promo.code}`);
  };

  const saveStoreInfo = (info: StoreInfo) => {
    setStoreInfo(info);
    showToast('Updated store settings');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        goHome,
        activeCategory,
        setActiveCategory,
        allViewTitle,
        allViewFilter,
        openSectionAllView,

        products,
        visibleProducts,
        sections,
        promoCodes,
        storeInfo,
        announcement,
        bannerImage,
        galleryImages,
        galleryEnabled,
        launchConfig,

        searchQuery,
        setSearchQuery,
        searchSuggestionsOpen,
        setSearchSuggestionsOpen,
        performSearch,

        cart,
        cartCount,
        cartSubtotal,
        appliedDiscount,
        discountAmount,
        cartTotal,
        addToCart,
        updateCartQty,
        clearCart,
        applyPromoCode,

        sideMenuOpen,
        setSideMenuOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
        notificationModalOpen,
        setNotificationModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        paymentModalOpen,
        setPaymentModalOpen,
        adminModalOpen,
        setAdminModalOpen,
        aiModalOpen,
        setAiModalOpen,
        receiptOrder,
        setReceiptOrder,
        reviewProduct,
        setReviewProduct,

        orders,
        updateOrderStatus,
        saveNewProduct,
        savePromoCode,
        saveStoreInfo,

        notifications,
        readNotificationIds,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,

        paymentConfig,
        customPaymentMethods,
        currentOrder,
        orderStatus,
        approvalSecondsLeft,
        startCheckout,
        confirmPayment,
        cancelPayment,
        manualApproveOrder,

        toasts,
        showToast,
        flyingParticles
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
