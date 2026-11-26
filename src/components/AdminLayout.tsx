import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut, ExternalLink } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('shop_admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#064e3b] text-white flex flex-col justify-between hidden md:flex shadow-xl">
        <div>
          <div className="p-6 border-b border-emerald-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white text-[#064e3b] flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <h1 className="font-bold text-base">Shoponline</h1>
              <span className="text-xs text-emerald-400 font-semibold">Painel Admin</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive ? 'bg-[#047857] text-white shadow' : 'text-zinc-300 hover:bg-emerald-900/50 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/produtos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive ? 'bg-[#047857] text-white shadow' : 'text-zinc-300 hover:bg-emerald-900/50 hover:text-white'
                }`
              }
            >
              <Package className="w-5 h-5" /> Produtos & Estoque
            </NavLink>

            <NavLink
              to="/admin/pedidos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive ? 'bg-[#047857] text-white shadow' : 'text-zinc-300 hover:bg-emerald-900/50 hover:text-white'
                }`
              }
            >
              <ShoppingCart className="w-5 h-5" /> Pedidos
            </NavLink>

            <NavLink
              to="/admin/cupons"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive ? 'bg-[#047857] text-white shadow' : 'text-zinc-300 hover:bg-emerald-900/50 hover:text-white'
                }`
              }
            >
              <Tag className="w-5 h-5" /> Cupons
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-900 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-zinc-300 hover:bg-emerald-900/50 hover:text-white transition"
          >
            <ExternalLink className="w-5 h-5" /> Ver Vitrine
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <LogOut className="w-5 h-5" /> Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-zinc-200 p-4 md:hidden flex items-center justify-between">
          <span className="font-bold text-[#064e3b]">Shoponline Admin</span>
          <button onClick={handleLogout} className="text-red-600 font-semibold text-sm">Sair</button>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};