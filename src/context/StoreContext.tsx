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
  LaunchConfig,
  ProductReview
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
  INITIAL_LAUNCH_CONFIG,
  INITIAL_REVIEWS
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

export interface RatingStats {
  average: number;
  count: number;
  breakdown: Record<number, number>;
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

  // Reviews System
  reviews: ProductReview[];
  addReview: (review: { productId: number; userName: string; rating: number; comment: string }) => void;
  getProductReviews: (productId: number) => ProductReview[];
  getProductRatingStats: (productId: number) => RatingStats;

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
const LOCAL_STORAGE_REVIEWS = 'apex_product_reviews';
const LOCAL_STORAGE_PRODUCTS = 'apex_products_catalog';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'all' | 'search' | 'promo' | 'contact' | 'about'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allViewTitle, setAllViewTitle] = useState<string>('All Products');
  const [allViewFilter, setAllViewFilter] = useState<string>('all');

  // Products & Settings (Persisted with user review adjustments)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

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

  // Reviews State (Cleared completely as requested)
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_REVIEWS);
      return [];
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
  const [approvalSecondsLeft, setApprovalSecondsLeft] = useState<number>(3);

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

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS, JSON.stringify(products));
    } catch {}
  }, [products]);

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

  // Sync reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

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

  // Launch countdown timer: Always active, guaranteed to show, smoothly loops every drop cycle!
  useEffect(() => {
    const interval = setInterval(() => {
      setLaunchConfig((prev) => {
        const nextSeconds = prev.secondsLeft > 0 ? prev.secondsLeft - 1 : 300;
        return {
          ...prev,
          isRunning: true,
          mode: 'public',
          secondsLeft: nextSeconds
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Firebase Realtime DB initial fetch & fallback
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const res = await fetch('https://portfolio-art-2d73d-default-rtdb.firebaseio.com/apexstore.json');
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        if (Array.isArray(data.products) && data.products.length > 0) {
          // Merge with any local user-added ratings if present
          setProducts((currentProds) => {
            return data.products.map((dp: Product) => {
              const matched = currentProds.find((cp) => cp.id === dp.id);
              return matched ? { ...dp, rating: matched.rating, reviews: matched.reviews } : dp;
            });
          });
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

  // Reviews System Functions
  const getProductReviews = (productId: number): ProductReview[] => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getProductRatingStats = (productId: number): RatingStats => {
    const prodReviews = reviews.filter((r) => r.productId === productId);
    const prod = products.find((p) => p.id === productId);

    if (prodReviews.length === 0) {
      const avg = prod?.rating || 4.9;
      const count = prod?.reviews || 24;
      return {
        average: avg,
        count: count,
        breakdown: {
          5: Math.round(count * 0.8),
          4: Math.round(count * 0.15),
          3: Math.round(count * 0.05),
          2: 0,
          1: 0
        }
      };
    }

    const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / prodReviews.length).toFixed(1));
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    prodReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    return {
      average: avg,
      count: prodReviews.length,
      breakdown
    };
  };

  const addReview = (newRev: { productId: number; userName: string; rating: number; comment: string }) => {
    const reviewItem: ProductReview = {
      id: 'rev-' + Date.now() + '-' + Math.random().toString().slice(2, 6),
      productId: newRev.productId,
      userName: newRev.userName.trim() || 'Verified Customer',
      rating: newRev.rating,
      comment: newRev.comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true
    };

    // Update reviews state
    setReviews((prev) => [reviewItem, ...prev]);

    // Recalculate average rating for product
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newRev.productId) {
          const currentProdRevs = [reviewItem, ...reviews.filter((r) => r.productId === p.id)];
          const newAvg = Number((currentProdRevs.reduce((acc, r) => acc + r.rating, 0) / currentProdRevs.length).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            reviews: currentProdRevs.length
          };
        }
        return p;
      })
    );

    // Update quickViewProduct if open
    setQuickViewProduct((prev) => {
      if (prev && prev.id === newRev.productId) {
        const currentProdRevs = [reviewItem, ...reviews.filter((r) => r.productId === prev.id)];
        const newAvg = Number((currentProdRevs.reduce((acc, r) => acc + r.rating, 0) / currentProdRevs.length).toFixed(1));
        return {
          ...prev,
          rating: newAvg,
          reviews: currentProdRevs.length
        };
      }
      return prev;
    });

    showToast(`Thank you! Your ${newRev.rating}★ review is live.`, 'success');
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

  // Cancel or reset payment
  const cancelPayment = () => {
    setPaymentModalOpen(false);
    setOrderStatus('pending');
    setApprovalSecondsLeft(3);
  };

  // Confirm payment: Manual merchant verification flow (NO auto-approval)
  const confirmPayment = (details: {
    method: string;
    email: string;
    senderMobile: string;
    transactionId: string;
    proofUrl: string;
  }) => {
    const orderId = Date.now();
    const effectiveProof = details.proofUrl.trim() || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80';
    const effectiveTrxId = details.transactionId.trim() || `APX-${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      customer: 'Verified Buyer',
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
      transactionId: effectiveTrxId,
      proofUrl: effectiveProof,
      status: 'pending', // Strictly PENDING - Merchant manually approves!
      createdAt: new Date().toISOString()
    };

    setCurrentOrder(newOrder);
    setOrderStatus('pending');
    setReceiptOrder(newOrder); // Shows pending order slip to buyer
    setPaymentModalOpen(false);
    clearCart();

    // Save order in state & localStorage
    setOrders((prev) => [newOrder, ...prev]);

    // Push to Firebase RTDB in background
    fetch('https://portfolio-art-2d73d-default-rtdb.firebaseio.com/apexstore/orders.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    showToast(`Order #${String(orderId).slice(-6)} submitted! Awaiting manual merchant approval.`, 'info');
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
        const updated: Order = { ...currentOrder, status: 'verified' };
        setCurrentOrder(updated);
        setReceiptOrder(updated);
        setPaymentModalOpen(false);
        clearCart();
        showToast('Payment Verified! 🎉', 'success');
      } else if (status === 'rejected') {
        showToast(`Order #${String(orderId).slice(-6)}: ${reason || 'Payment rejected'}`, 'error');
      }
    }
  };

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

        reviews,
        addReview,
        getProductReviews,
        getProductRatingStats,

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
