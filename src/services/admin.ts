import { Order, Product, Coupon, AdminMetrics } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'shop_products',
  ORDERS: 'shop_orders',
  COUPONS: 'shop_coupons'
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const productsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  
  const orders: Order[] = ordersJson ? JSON.parse(ordersJson) : [];
  const products: Product[] = productsJson ? JSON.parse(productsJson) : [];

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Pendente' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const conversionRate = totalOrders > 0 ? Number(((orders.filter(o => o.status === 'Pago' || o.status === 'Entregue').length / totalOrders) * 100).toFixed(1)) : 4.5;

  return {
    totalRevenue,
    totalOrders,
    conversionRate,
    totalProducts
  };
}

export async function getAdminOrders(): Promise<Order[]> {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const orders = await getAdminOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const productsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  let products: Product[] = productsJson ? JSON.parse(productsJson) : [];

  let savedProduct: Product;
  if (product.id) {
    products = products.map(p => p.id === product.id ? { ...p, ...product } as Product : p);
    savedProduct = products.find(p => p.id === product.id)!;
  } else {
    savedProduct = {
      id: Date.now().toString(),
      title: product.title || 'Novo Produto',
      price: product.price || 100,
      category: product.category || 'Geral',
      image: product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      stock: product.stock || 10,
      description: product.description || 'Descrição detalhada do produto.',
      rating: 5.0
    };
    products.unshift(savedProduct);
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return savedProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const productsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!productsJson) return;
  let products: Product[] = JSON.parse(productsJson);
  products = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export async function getCoupons(): Promise<Coupon[]> {
  const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
  return data ? JSON.parse(data) : [];
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const coupons = await getCoupons();
  const exists = coupons.some(c => c.code.toUpperCase() === coupon.code.toUpperCase());
  let updated: Coupon[];
  if (exists) {
    updated = coupons.map(c => c.code.toUpperCase() === coupon.code.toUpperCase() ? coupon : c);
  } else {
    updated = [...coupons, coupon];
  }
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(updated));
}