import React, { useEffect, useState, FormEvent } from 'react';
import { getCoupons, saveCoupon } from '../../services/admin';
import { Coupon } from '../../types';
import { Tag, Plus, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      setError('Erro ao carregar cupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await saveCoupon({
        code: code.toUpperCase().trim(),
        discountPercent: Number(discountPercent),
        active
      });
      setModalOpen(false);
      setCode('');
      setDiscountPercent(10);
      setActive(true);
      await loadCoupons();
    } catch (err) {
      alert('Erro ao salvar cupom.');
    }
  };

  const handleDelete = async (couponCode: string) => {
    if (confirm(`Deseja realmente excluir o cupom ${couponCode}?`)) {
      try {
        const updated = coupons.filter(c => c.code !== couponCode);
        setCoupons(updated);
        localStorage.setItem('shop_coupons', JSON.stringify(updated));
      } catch (err) {
        alert('Erro ao excluir cupom.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Cupons de Desconto</h1>
          <p className="text-zinc-500 text-sm">Gerencie cupons promocionais para os clientes.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-emerald-800 transition font-medium text-sm"
        >
          <Plus size={18} /> Novo Cupom
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
          <p className="text-zinc-500">Carregando cupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
          <Tag className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
          <h3 className="font-bold text-zinc-800 text-lg">Nenhum cupom cadastrado</h3>
          <p className="text-zinc-500 text-sm mt-1">Crie cupons para oferecer descontos na loja.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.code} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-lg bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                    {coupon.code}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {coupon.active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {coupon.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-3xl font-bold text-zinc-900 mt-2">
                  {coupon.discountPercent}% <span className="text-sm font-normal text-zinc-500">de desconto</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => handleDelete(coupon.code)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zinc-200">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Novo Cupom de Desconto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Código do Cupom</label>
                <input
                  type="text"
                  required
                  placeholder="EX: PROMO20"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Desconto (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={discountPercent}
                  onChange={e => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-zinc-300 focus:ring-emerald-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-zinc-800">Cupom Ativo</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-medium text-sm hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-medium text-sm hover:bg-emerald-800 shadow-md"
                >
                  Salvar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
