import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const stored = localStorage.getItem('shop_cart');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const updateQuantity = (productId: string, delta: number) => {
    const updated = items.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    setItems(updated);
    localStorage.setItem('shop_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId: string) => {
    const updated = items.filter(item => item.product.id !== productId);
    setItems(updated);
    localStorage.setItem('shop_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#047857]" />
              <h2 className="text-lg font-bold text-zinc-900">Seu Carrinho</h2>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-600 font-medium">Seu carrinho está vazio</p>
                <p className="text-zinc-400 text-sm mt-1">Explore nossa vitrine e adicione produtos exclusivos.</p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-[#047857] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#064e3b] transition"
                >
                  Ver Vitrine
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200/60">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-bold text-zinc-900 text-sm line-clamp-1">{item.product.title}</h4>
                        <button onClick={() => removeItem(item.product.id)} className="text-zinc-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-zinc-500">R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="text-zinc-500 hover:text-zinc-900">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-zinc-900 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="text-zinc-500 hover:text-zinc-900">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-extrabold text-[#064e3b] text-sm">
                        R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-extrabold text-zinc-900">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-zinc-500">Frete e cupons calculados no checkout.</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="w-full bg-[#047857] hover:bg-[#064e3b] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                Ir para o Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};