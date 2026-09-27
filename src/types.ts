export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  badge?: 'SALE' | 'NEW' | 'HOT' | string;
  public?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PromoCode {
  code: string;
  discount: number; // e.g. 0.20 for 20%
  desc?: string;
  badge?: string;
  badgeType?: 'new' | 'hot' | 'normal';
  active?: boolean;
}

export interface SectionConfig {
  id: number;
  title: string;
  filter: string;
  layout?: 'horizontal' | 'vertical' | 'compact' | 'featured' | '';
  order: number;
  active: boolean;
}

export interface StoreInfo {
  owner: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string;
  paymentNumber?: string;
}

export interface AnnouncementSettings {
  specialText: string;
  promoCode: string;
  shipping: string;
  newArrivals: string;
  reviews: string;
}

export interface StoreNotification {
  id: string;
  type: 'info' | 'promo' | 'order' | 'alert';
  icon: string;
  title: string;
  desc: string;
  time: number;
  active: boolean;
}

export interface CustomPaymentMethod {
  id: number;
  name: string;
  icon: string;
  account: string;
  accountName: string;
  active?: boolean;
}

export interface PaymentMethodsConfig {
  easypaisa?: { number?: string; name?: string; active?: boolean };
  jazzcash?: { number?: string; name?: string; active?: boolean };
  bank?: { number?: string; name?: string; label?: string; active?: boolean };
  card?: { gateway?: string; active?: boolean };
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'verified' | 'rejected';

export interface Order {
  id: number;
  customer: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  method: string;
  transactionId: string;
  proofUrl: string;
  status: OrderStatus;
  createdAt: string;
}

export interface TranscriptSettings {
  title?: string;
  subtitle?: string;
  thanks?: string;
  footer?: string;
  badge?: string;
  watermark?: string;
  allowDownload?: boolean;
}

export interface ProductReview {
  id: string;
  productId: number;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface LaunchConfig {
  mode: 'public' | 'private';
  autoLaunch: boolean;
  totalSeconds: number;
  secondsLeft: number;
  isRunning: boolean;
}
