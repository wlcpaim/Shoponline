import { ShieldCheck, Truck, Clock, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 mt-20 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Compra Garantida</h4>
              <p className="text-xs text-zinc-400">Receba o produto que comprou ou devolvemos seu dinheiro.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Entrega Rápida</h4>
              <p className="text-xs text-zinc-400">Envio imediato para todo o Brasil com rastreio online.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Atendimento Dedicado</h4>
              <p className="text-xs text-zinc-400">Suporte especializado via WhatsApp e e-mail todos os dias.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lock className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Ambiente Seguro</h4>
              <p className="text-xs text-zinc-400">Seus dados pessoais e de pagamento protegidos com criptografia.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Shoponline. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <Link to="/" className="hover:text-white transition">Política de Privacidade</Link>
            <Link to="/" className="hover:text-white transition">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
