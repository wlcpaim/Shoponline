import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../services/admin';
import { Order } from '../../types';
import { Package, Truck, CheckCircle, Clock, Trash2, Search, AlertCircle } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      setError('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                          order.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Gestão de Pedidos</h1>
          <p className="text-zinc-500 text-sm">Acompanhe e gerencie todos os pedidos da loja.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Buscar pedido ou cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Todos">Todos Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregue">Entregue</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
          <p className="text-zinc-500">Carregando pedidos...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
          <Package className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
          <h3 className="font-bold text-zinc-800 text-lg">Nenhum pedido encontrado</h3>
          <p className="text-zinc-500 text-sm mt-1">Tente alterar os filtros de busca.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-600 uppercase">
                <tr>
                  <th className="p-4">Pedido ID</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-sm">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-zinc-50/50">
                    <td className="p-4 font-mono font-medium text-emerald-700">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-zinc-900">{order.customer.name}</div>
                      <div className="text-xs text-zinc-500">{order.customer.email}</div>
                    </td>
                    <td className="p-4 font-bold text-zinc-900">
                      R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          order.status === 'Entregue' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Pago' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Enviado' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-zinc-100 text-zinc-700 border-zinc-300'
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregue">Entregue</option>
                      </select>
                    </td>
                    <td className="p-4 text-right font-medium">
                      <button
                        onClick={() => alert(`Detalhes do Cliente:\nNome: ${order.customer.name}\nTel: ${order.customer.phone}\nEndereço: ${order.customer.address}, ${order.customer.city} - ${order.customer.zipCode}`)}
                        className="text-emerald-700 hover:text-emerald-800 text-xs bg-emerald-50 px-3 py-1.5 rounded-lg"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
