import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { getProducts, getCategories } from '../services/store';
import { Product, CartItem } from '../types';
import { CART_STORAGE_KEY } from '../lib/constants';
import { Filter, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateCartCount = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const items: CartItem[] = JSON.parse(stored);
      const total = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        getProducts(searchQuery, selectedCategory),
        getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    let items: CartItem[] = stored ? JSON.parse(stored) : [];
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ product, quantity: 1 });
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartCount();
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onSearch={(q) => setSearchQuery(q)}
      />

      {/* Hero Section */}
      <section className="bg-[#064e3b] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Coleção Exclusiva 2025
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Sofisticação e Qualidade em Cada Detalhe
            </h1>
            <p className="text-zinc-300 text-base sm:text-lg max-w-lg">
              Descubra nossa seleção premium de relógios, vestuário e tecnologia projetada para quem exige excelência.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#catalogo"
                className="bg-white text-[#064e3b] hover:bg-zinc-100 font-bold px-8 py-3.5 rounded-xl transition flex items-center gap-2 shadow-lg"
              >
                Explorar Catálogo <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
              alt="Hero Shoponline"
              className="rounded-3xl shadow-2xl object-cover aspect-video border-4 border-emerald-900/50"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <main id="catalogo" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Catálogo de Produtos</h2>
            <p className="text-zinc-500 text-sm">Encontre os melhores itens com entrega imediata.</p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#047857] text-white shadow'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-zinc-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-zinc-200">
            <Filter className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-800 mb-1">Nenhum produto encontrado</h3>
            <p className="text-zinc-500 text-sm">Tente buscar por outro termo ou categoria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="mt-6 bg-[#047857] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#064e3b]"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}