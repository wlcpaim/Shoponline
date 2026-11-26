import { Product } from '../types';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group">
      <Link to={`/produto/${product.id}`} className="relative aspect-square overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {product.category}
        </span>
      </Link>
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1 text-amber-500 mb-1 text-xs">
            <Star size={14} fill="currentColor" />
            <span className="font-bold">{product.rating || 5.0}</span>
          </div>
          <Link to={`/produto/${product.id}`} className="font-bold text-zinc-900 hover:text-emerald-700 line-clamp-1 mb-1">
            {product.title}
          </Link>
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4">{product.description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <div>
            <span className="text-xs text-zinc-400 block">Por apenas</span>
            <span className="text-lg font-bold text-emerald-800">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-zinc-900 hover:bg-emerald-700 text-white p-3 rounded-xl transition flex items-center justify-center"
            title="Adicionar ao carrinho"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}