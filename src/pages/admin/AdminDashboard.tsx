import { useEffect, useState } from 'react';
import { getAdminMetrics, getAdminOrders } from '../../services/admin';
import { AdminMetrics, Order } from '../../types';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const [m, o] = await Promise.all([
        getAdminMetrics(),
        getAdminOrders()
      ]);
      setMetrics(m);
      setOrders(o.slice(0, 5));
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard Financeiro</h1>
          <p className="text-zinc-500 text-sm">Métricas em tempo real da sua loja virtual.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500 font-medium">Faturamento Total</span>
            <DollarSign className="text-[#047857]" size={24} />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900">
            R$ {(metrics?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500 font-medium">Total de Pedidos</span>
            <ShoppingCart className="text-amber-500" size={24} />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900">{metrics?.totalOrders || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500 font-medium">Taxa de Conversão</span>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900">{metrics?.conversionRate || 0}%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-500 font-medium">Produtos Cadastrados</span>
            <Package className="text-purple-500" size={24} />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900">{metrics?.totalProducts || 0}</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">Pedidos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100 text-xs text-zinc-500 uppercase">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map(o => (
                <tr key={o.id} className="text-sm">
                  <td className="p-3 font-bold text-zinc-900">{o.id}</td>
                  <td className="p-3 text-zinc-600">{o.customer.name}</td>
                  <td className="p-3 font-extrabold text-[#064e3b]">R$ {o.total.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#064e3b]">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}