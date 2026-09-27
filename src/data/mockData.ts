import { Product, PromoCode, SectionConfig, StoreInfo, AnnouncementSettings, StoreNotification, PaymentMethodsConfig, LaunchConfig, ProductReview } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'Sony WH-1000XM5 Noise Canceling Headphones',
    price: 84999,
    oldPrice: 94999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Industry-leading noise canceling with two processors and eight microphones for unprecedented noise cancellation.',
    rating: 4.9,
    reviews: 142,
    badge: 'HOT',
    public: true
  },
  {
    id: 102,
    name: 'Bose QuietComfort Ultra Wireless Headphones',
    price: 92500,
    oldPrice: 105000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    description: 'Breakthrough spatialized audio for more immersive listening that makes your music feel realer than ever.',
    rating: 4.8,
    reviews: 98,
    badge: 'NEW',
    public: true
  },
  {
    id: 103,
    name: 'Apple AirPods Max Wireless Over-Ear Headphones',
    price: 139999,
    oldPrice: 155000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    description: 'High-fidelity audio with computational sound, custom acoustic design, and active noise cancellation.',
    rating: 4.9,
    reviews: 210,
    badge: 'SALE',
    public: true
  },
  {
    id: 104,
    name: 'Sennheiser Momentum 4 Wireless Studio Headphones',
    price: 78000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description: 'Audiophile-inspired sound signature with crystal-clear calls and 60-hour marathon battery life.',
    rating: 4.7,
    reviews: 64,
    public: true
  },
  {
    id: 201,
    name: 'Apple Watch Ultra 2 Titanium GPS + Cellular',
    price: 219999,
    oldPrice: 245000,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Rugged titanium case with precision dual-frequency GPS, up to 36 hours of battery life, and action button.',
    rating: 4.9,
    reviews: 184,
    badge: 'HOT',
    public: true
  },
  {
    id: 202,
    name: 'Samsung Galaxy Watch 6 Classic Sapphire',
    price: 68500,
    oldPrice: 79999,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic rotating bezel with comprehensive sleep coaching, heart rate monitoring, and advanced fitness tracking.',
    rating: 4.8,
    reviews: 112,
    public: true
  },
  {
    id: 203,
    name: 'Garmin Fenix 7 Pro Solar Multisport GPS Watch',
    price: 185000,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    description: 'Solar charging lens, built-in LED flashlight, endurance score, and preloaded TopoActive maps for rugged expeditions.',
    rating: 4.9,
    reviews: 76,
    badge: 'NEW',
    public: true
  },
  {
    id: 301,
    name: 'Nike Air Jordan 1 Retro High OG Chicago',
    price: 49500,
    oldPrice: 58000,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'The sneaker that started it all. Premium full-grain leather upper with vintage sail accents and responsive Air cushioning.',
    rating: 4.9,
    reviews: 320,
    badge: 'HOT',
    public: true
  },
  {
    id: 302,
    name: 'Adidas Yeezy Boost 350 V2 Onyx Edition',
    price: 54000,
    oldPrice: 62000,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    description: 'Engineered re-engineered Primeknit upper with translucent side stripe and plush Boost midsole encapsulated in ribbed TPU.',
    rating: 4.8,
    reviews: 195,
    public: true
  },
  {
    id: 303,
    name: 'Nike Air Max 270 React Triple Black',
    price: 36000,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    description: 'Max Air 270 unit delivers 270 degrees of comfort paired with lightweight Nike React foam for super smooth strides.',
    rating: 4.7,
    reviews: 88,
    public: true
  },
  {
    id: 401,
    name: 'Ray-Ban Wayfarer Classic Polarized Sunglasses',
    price: 29500,
    oldPrice: 34000,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    description: 'Original iconic silhouette crafted from durable acetate with green classic G-15 crystal lenses for 100% UV protection.',
    rating: 4.9,
    reviews: 140,
    badge: 'HOT',
    public: true
  },
  {
    id: 402,
    name: 'Tom Ford Aviator Gold Luxury Sunglasses',
    price: 64000,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    description: 'Italian handcrafted aviators featuring 18k gold tone detailing, subtle signature T temples, and gradient smoke lenses.',
    rating: 4.9,
    reviews: 45,
    badge: 'NEW',
    public: true
  },
  {
    id: 501,
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    price: 48500,
    oldPrice: 55000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description: 'CNC machined anodized aluminum body, double-gasket acoustic mount, hot-swappable switches, and QMK/VIA programmable.',
    rating: 4.9,
    reviews: 115,
    badge: 'HOT',
    public: true
  },
  {
    id: 502,
    name: 'Logitech MX Master 3S Ergonomic Performance Mouse',
    price: 24500,
    oldPrice: 28000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description: 'Quiet clicks, 8K DPI any-surface glass tracking sensor, and MagSpeed electromagnetic scroll wheel for laser precision.',
    rating: 4.8,
    reviews: 260,
    public: true
  }
];

export const INITIAL_SECTIONS: SectionConfig[] = [
  { id: 1, title: 'HEADPHONE', filter: 'headphone', layout: 'horizontal', order: 1, active: true },
  { id: 2, title: 'WATCHES', filter: 'watch', layout: 'vertical', order: 2, active: true },
  { id: 3, title: 'SHOES', filter: 'shoe', layout: 'horizontal', order: 3, active: true },
  { id: 4, title: 'GLASSES', filter: 'glasses', layout: 'vertical', order: 4, active: true },
  { id: 5, title: 'ELECTRONICS', filter: 'electronics', layout: 'horizontal', order: 5, active: true }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'PREMIUM20', discount: 0.20, desc: 'Special 20% discount on all premium flagship collections.', badge: 'HOT DEAL', badgeType: 'hot', active: true },
  { code: 'APEX50', discount: 0.50, desc: 'Limited edition super sale! Enjoy 50% discount on select orders.', badge: 'MEGA SALE', badgeType: 'new', active: true },
  { code: 'VIP10', discount: 0.10, desc: 'ApexStore VIP club exclusive 10% instant off coupon.', badge: 'MEMBER', badgeType: 'normal', active: true },
  { code: 'FLASH30', discount: 0.30, desc: 'Weekend flash promo! Get 30% discount automatically applied.', badge: 'FLASH', badgeType: 'hot', active: true }
];

export const INITIAL_STORE_INFO: StoreInfo = {
  owner: 'Anees Abid',
  city: 'Azad Kashmir',
  phone: '+92 300 1234567',
  email: 'anees@apexstore.com',
  whatsapp: 'https://whatsapp.com/channel/0029VbApexStore',
  paymentNumber: '03455724552'
};

export const INITIAL_ANNOUNCEMENT: AnnouncementSettings = {
  specialText: 'Get 20% OFF',
  promoCode: 'PREMIUM20',
  shipping: 'Free shipping over Rs. 5000',
  newArrivals: 'New arrivals every Friday',
  reviews: '100% Genuine & Insured Delivery'
};

export const INITIAL_GALLERY_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
];

export const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'welcome-01',
    type: 'info',
    icon: 'fa-wand-magic-sparkles',
    title: 'Welcome to ApexStore!',
    desc: 'Enjoy premium shopping with exclusive deals and fast delivery across Pakistan.',
    time: Date.now() - 1000 * 60 * 30,
    active: true
  },
  {
    id: 'shipping-02',
    type: 'promo',
    icon: 'fa-truck-fast',
    title: 'Free Express Shipping',
    desc: 'Free express shipping on all orders over Rs. 5,000 — no code required!',
    time: Date.now() - 1000 * 60 * 120,
    active: true
  },
  {
    id: 'newdrop-03',
    type: 'order',
    icon: 'fa-gem',
    title: 'Exclusive Drops Every Friday',
    desc: 'Fresh flagship tech and fashion drops every Friday. Be the first to grab the latest gear.',
    time: Date.now() - 1000 * 60 * 360,
    active: true
  }
];

export const INITIAL_PAYMENT_CONFIG: PaymentMethodsConfig = {
  easypaisa: { number: '03455724552', name: 'Anees Abid (EasyPaisa)', active: true },
  jazzcash: { number: '03001234567', name: 'Anees Abid (JazzCash)', active: true },
  bank: { number: 'PK88MEZN00012345678901', name: 'Meezan Bank Ltd', label: 'Anees Abid - ApexStore', active: true },
  card: { gateway: 'ApexStore Secure Shield', active: true }
};

export const INITIAL_LAUNCH_CONFIG: LaunchConfig = {
  mode: 'public',
  autoLaunch: true,
  totalSeconds: 300,
  secondsLeft: 300,
  isRunning: true
};

export const INITIAL_REVIEWS: ProductReview[] = [];

