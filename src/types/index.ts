export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  description: string;
  rating?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
};

export type Order = {
  id: string;
  customer: Customer;
  items: CartItem[];
  total: number;
  status: 'Pendente' | 'Pago' | 'Enviado' | 'Entregue';
  paymentMethod: 'PIX' | 'Cartao';
  createdAt: string;
};

export type Coupon = {
  code: string;
  discountPercent: number;
  active: boolean;
};

export type AdminMetrics = {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  totalProducts: number;
};