import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_STORAGE_KEY } from '../../lib/constants';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@shoponline.com');
  const [password, setPassword] = useState('demo');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'demo' || password === 'admin123') {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      navigate('/admin');
    } else {
      alert('Senha incorreta. Use "demo" ou "admin123"');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-6">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#064e3b] text-white flex items-center justify-center font-bold">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Shoponline Admin</h1>
            <p className="text-xs text-zinc-500">Acesso restrito a administradores</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-[#047857] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-[#047857] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#047857] hover:bg-[#064e3b] text-white py-3.5 rounded-xl font-bold transition shadow-lg"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
          <span className="text-xs text-[#064e3b] font-medium block">
            Modo demonstração: clique para preencher com credenciais padrão.
          </span>
        </div>
      </div>
    </div>
  );
}