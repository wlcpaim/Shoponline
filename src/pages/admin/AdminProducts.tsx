import React, { useEffect, useState, FormEvent } from 'react';
import { getAdminMetrics, saveProduct, deleteProduct } from '../../services/admin';
import { Product } from '../../types';
import { Plus, Trash2, Edit, Package, AlertCircle } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const dataJson = localStorage.getItem('shop_products');
      if (dataJson) {
        setProducts(JSON.parse(dataJson));
      }
    } catch (err) {
      setError('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setPrice(product.price);
      setCategory(product.category);
      setImage(product.image);
      setStock(product.stock);
      setDescription(product.description);
    } else {
      setEditingProduct(null);
      setTitle('');
      setPrice(0);
      setCategory('');
      setImage('');
      setStock(10);
      setDescription('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const productData: Product = {
        id: editingProduct ? editingProduct.id : Date.now().toString(),
        title,
        price: Number(price),
        category,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        stock: Number(stock),
        description,
        rating: editingProduct?.rating || 5.0
      };

      await saveProduct(productData);
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      alert('Erro ao salvar produto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (err) {
        alert('Erro ao excluir produto.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Gestão de Produtos</h1>
          <p className="text-zinc-500 text-sm">Adicione, edite ou remova produtos do catálogo.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-emerald-800 transition font-medium text-sm"
        >
          <Plus size={18} /> Novo Produto
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
          <p className="text-zinc-500">Carregando produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200">
          <Package className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
          <h3 className="font-bold text-zinc-800 text-lg">Nenhum produto cadastrado</h3>
          <p className="text-zinc-500 text-sm mt-1">Clique em Novo Produto para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-600 uppercase">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-sm">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-zinc-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={product.image} alt={product.title} className="w-10 h-10 rounded-xl object-cover border" />
                      <span className="font-medium text-zinc-900">{product.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-zinc-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-medium text-zinc-700">{product.stock} un.</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg inline-flex items-center"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg inline-flex items-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Estoque</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Categoria</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">Descrição</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
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
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
