import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getOrderById } from '../services/store';
import { Order } from '../types';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await getOrderById(id);
        setOrder(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar cartCount={0} onOpenCart={() => {}} onSearch={() => {}} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 md:p-12 shadow-sm text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-[#047857] mx-auto" />
          <h1 className="text-3xl font-extrabold text-zinc-900">Pedido Realizado com Sucesso!</h1>
          <p className="text-zinc-600">
            Seu pedido <span className="font-bold text-zinc-900">#{order?.id || id}</span> foi registrado e está sendo processado.
          </p>

          {/* Tracking visualization */}
          <div className="grid grid-cols-3 gap-4 py-8 border-y border-zinc-100 max-w-xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#047857] flex items-center justify-center font-bold">
                <CheckCircle size={20} />
              </div>
              <span className="text-xs font-bold text-zinc-900">Confirmado</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium text-zinc-500">Em Separação</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold">
                <Truck size={20} />
              </div>
              <span className="text-xs font-medium text-zinc-500">Entregue</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="bg-[#047857] hover:bg-[#064e3b] text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg"
            >
              Voltar à Vitrine
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}