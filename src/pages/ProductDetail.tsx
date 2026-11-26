import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { getProductById } from '../services/store';
import { Product, CartItem } from '../types';
import { CART_STORAGE_KEY } from '../lib/constants';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const updateCartCount = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const items: CartItem[] = JSON.parse(stored);
      setCartCount(items.reduce((acc, i) => acc + i.quantity, 0));
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    async function load() {
      if (id) {
        const data = await getProductById(id);
        setProduct(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    let items: CartItem[] = stored ? JSON.parse(stored) : [];
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartCount();
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 font-medium">Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Produto não encontrado</h2>
        <p className="text-zinc-600 mb-6">O produto que você procura não existe ou foi removido.</p>
        <Link to="/" className="bg-[#047857] text-white px-6 py-3 rounded-xl font-bold">
          Voltar à Vitrine
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} onSearch={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-8 font-medium text-sm"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12">
          <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mt-3 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-amber-500 mb-6">
                <Star size={18} fill="currentColor" />
                <span className="font-bold text-zinc-900">{product.rating || 5.0}</span>
                <span className="text-zinc-400 text-sm">(Avaliações verificadas)</span>
              </div>

              <div className="text-3xl font-extrabold text-[#064e3b] mb-6">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>

              <p className="text-zinc-600 text-base leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="border-t border-zinc-100 py-6 space-y-4">
                <div className="flex items-center gap-3 text-zinc-700 text-sm">
                  <ShieldCheck className="text-[#047857]" size={20} />
                  <span>Garantia de 1 ano contra defeitos de fabricação</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-700 text-sm">
                  <Truck className="text-[#047857]" size={20} />
                  <span>{product.stock > 0 ? `Em estoque (${product.stock} unidades disponíveis)` : 'Produto esgotado'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
              <div className="flex items-center border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-600 font-bold px-2"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-zinc-600 font-bold px-2"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#047857] hover:bg-[#064e3b] disabled:bg-zinc-300 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={20} /> Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}