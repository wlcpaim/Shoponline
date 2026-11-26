import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (q: string) => void;
}

export function Navbar({ cartCount, onOpenCart, onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button 
            className="md:hidden text-zinc-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-bold tracking-tight text-blue-500">
            Shoponline
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Buscar produtos, marcas, categorias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 text-white pl-4 pr-12 py-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="absolute right-3 top-3 text-zinc-400 hover:text-white">
            <Search size={20} />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCart}
            className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl flex items-center gap-2 transition shadow-md shadow-blue-900/20"
          >
            <ShoppingBag size={20} />
            <span className="hidden sm:inline font-medium">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-zinc-950 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-800 border-t border-zinc-700 p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white pl-4 pr-12 py-2.5 rounded-xl border border-zinc-700"
            />
            <button type="submit" className="absolute right-3 top-3 text-zinc-400">
              <Search size={20} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}