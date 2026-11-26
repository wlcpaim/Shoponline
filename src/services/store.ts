import { Product, CartItem, Customer, Order, Coupon } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'shop_products',
  ORDERS: 'shop_orders',
  COUPONS: 'shop_coupons',
  CART: 'shop_cart'
};

const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Relógio Suíço Chronos Gold',
    price: 1890.00,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 12,
    description: 'Relógio de alta precisão com acabamento em ouro 18k e vidro de safira.',
    rating: 4.9
  },
  {
    id: '2',
    title: 'Jaqueta de Couro Italiano Noir',
    price: 850.00,
    category: 'Vestuário',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    stock: 8,
    description: 'Couro legítimo com modelagem slim e forro térmico acolchoado.',
    rating: 4.8
  },
  {
    id: '3',
    title: 'Fones de Ouvido Studio Wireless Pro',
    price: 1290.00,
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 15,
    description: 'Cancelamento ativo de ruído, som espacial e autonomia de 40 horas.',
    rating: 4.7
  },
  {
    id: '4',
    title: 'Tênis Urban Minimalist White',
    price: 490.00,
    category: 'Calçados',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80',
    stock: 20,
    description: 'Confeccionado em couro premium com solado emborrachado antiderrapante.',
    rating: 4.6
  },
  {
    id: '5',
    title: 'Óculos de Sol Aviator Classic Titanium',
    price: 620.00,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    stock: 10,
    description: 'Armação ultra leve em titânio com lentes polarizadas e proteção UV400.',
    rating: 4.9
  },
  {
    id: '6',
    title: 'Mochila Executiva Impermeável', 
    price: 380.00,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 25,
    description: 'Compartimento dedicado para notebook de até 17 polegadas e porta USB integrada.',
    rating: 4.8
  }
];

const SEED_COUPONS: Coupon[] = [
  { code: 'SHOP10', discountPercent: 10, active: true },
  { code: 'EXCLUSIVO20', discountPercent: 20, active: true }
];

function getStoredProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  return JSON.parse(data);
}

function getStoredCoupons(): Coupon[] {
  const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(SEED_COUPONS));
    return SEED_COUPONS;
  }
  return JSON.parse(data);
}

function getStoredOrders(): Order[] {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!data) {
    const initialOrders: Order[] = [
      {
        id: 'ORD-9821',
        customer: { name: 'Carlos Silva', email: 'carlos@email.com', phone: '11999998888', address: 'Av. Paulista, 1000', city: 'São Paulo', zipCode: '01310-100' },
        items: [{ product: SEED_PRODUCTS[0], quantity: 1 }],
        total: 1890.00,
        status: 'Pago',
        paymentMethod: 'PIX',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    return initialOrders;
  }
  return JSON.parse(data);
}

export async function getProducts(query?: string, category?: string): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      let q = supabase.from('products').select('*');
      if (category && category !== 'Todos') {
        q = q.eq('category', category);
      }
      const { data, error } = await q;
      if (!error && data) {
        let list = data as Product[];
        if (query) {
          const term = query.toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
        }
        return list;
      }
    } catch (e) {
      console.warn('Supabase fallback to local storage');
    }
  }

  let list = getStoredProducts();
  if (category && category !== 'Todos') {
    list = list.filter(p => p.category === category);
  }
  if (query) {
    const term = query.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }
  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data as Product;
    } catch (e) {}
  }
  const list = getStoredProducts();
  return list.find(p => p.id === id) || null;
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const cats = Array.from(new Set(products.map(p => p.category)));
  return ['Todos', ...cats];
}

export async function createOrder(customer: Customer, items: CartItem[], paymentMethod: 'PIX' | 'Cartao', discount: number): Promise<Order> {
  const subtotal = items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const total = Math.max(0, subtotal - (subtotal * (discount / 100)));
  const newOrder: Order = {
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    customer,
    items,
    total,
    status: paymentMethod === 'PIX' ? 'Pago' : 'Pendente',
    paymentMethod,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      await supabase.from('orders').insert([newOrder]);
    } catch (e) {}
  }

  const orders = getStoredOrders();
  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Update stock
  const products = getStoredProducts();
  items.forEach(item => {
    const prod = products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      if (!error && data) return data as Order;
    } catch (e) {}
  }
  const orders = getStoredOrders();
  return orders.find(o => o.id === id) || null;
}

export async function validateCoupon(code: string): Promise<number> {
  const coupons = getStoredCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
  return found ? found.discountPercent : 0;
}