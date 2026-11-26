import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { createOrder, validateCoupon } from '../services/store';
import { CartItem, Customer } from '../types';
import { CART_STORAGE_KEY } from '../lib/constants';
import { ShieldCheck, CreditCard, QrCode, CheckCircle, Tag } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartao'>('PIX');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cartItems: CartItem[] = JSON.parse(stored);
      if (cartItems.length === 0) {
        navigate('/carrinho');
      }
      setItems(cartItems);
    } else {
      navigate('/carrinho');
    }
  }, [navigate]);

  const subtotal = items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    const pct = await validateCoupon(couponCode);
    if (pct > 0) {
      setDiscount(pct);
      setCouponMessage(`Cupom aplicado com sucesso! ${pct}% de desconto.`);
    } else {
      setCouponMessage('Cupom inválido ou expirado.');
    }
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await createOrder(customer, items, paymentMethod, discount);
      localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event('storage'));
      navigate(`/pedido/${order.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar cartCount={items.reduce((a, i) => a + i.quantity, 0)} onOpenCart={() => {}} onSearch={() => {}} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-8">Finalizar Pedido</h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-zinc-900">1. Dados do Cliente e Endereço</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={customer.email}
                  onChange={e => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Telefone / WhatsApp"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="CEP"
                  value={customer.zipCode}
                  onChange={e => setCustomer({ ...customer, zipCode: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Endereço completo (Rua, Número, Bairro)"
                value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
              />
              <input
                type="text"
                required
                placeholder="Cidade / UF"
                value={customer.city}
                onChange={e => setCustomer({ ...customer, city: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-[#047857] outline-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-zinc-900">2. Forma de Pagamento</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${
                    paymentMethod === 'PIX' ? 'border-[#047857] bg-emerald-50/50 text-[#064e3b]' : 'border-zinc-200 text-zinc-600'
                  }`}
                >
                  <QrCode size={28} />
                  <span className="font-bold">PIX (Aprovação Imediata)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cartao')}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${
                    paymentMethod === 'Cartao' ? 'border-[#047857] bg-emerald-50/50 text-[#064e3b]' : 'border-zinc-200 text-zinc-600'
                  }`}
                >
                  <CreditCard size={28} />
                  <span className="font-bold">Cartão de Crédito</span>
                </button>
              </div>

              {paymentMethod === 'PIX' && (
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-4">
                  <p className="text-sm text-zinc-600">Ao finalizar, um QR Code PIX dinâmico será gerado para pagamento instantâneo.</p>
                  <div className="w-48 h-48 bg-white mx-auto border border-zinc-200 rounded-xl flex items-center justify-center">
                    <QrCode size={120} className="text-[#064e3b]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-bold text-zinc-900">Resumo da Compra</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map(i => (
                <div key={i.product.id} className="flex justify-between text-sm">
                  <span className="text-zinc-600 line-clamp-1">{i.quantity}x {i.product.title}</span>
                  <span className="font-bold text-zinc-900">R$ {(i.product.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Coupon Form */}
            <div className="border-t border-zinc-100 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cupom de desconto"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Aplicar
                </button>
              </div>
              {couponMessage && <p className="text-xs mt-2 font-medium text-emerald-700">{couponMessage}</p>}
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-2">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Desconto ({discount}%)</span>
                  <span>- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold text-zinc-900 pt-2">
                <span>Total</span>
                <span className="text-[#064e3b]">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#047857] hover:bg-[#064e3b] text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:bg-zinc-300"
            >
              {loading ? 'Processando...' : 'Finalizar Pedido'} <CheckCircle size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs text-zinc-400 justify-center">
              <ShieldCheck size={16} className="text-[#047857]" />
              <span>Ambiente 100% seguro e criptografado</span>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}