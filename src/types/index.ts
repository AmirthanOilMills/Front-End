export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Cooking Oil' | 'Essential Oil' | 'Others';
  image: string;
  description: string;
  benefits: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'super' | 'normal';
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
}