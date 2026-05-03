import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComparison, removeFromComparison, clearComparison } from '../../store/comparisonSlice';
import Header from '../../components/layout/Header';
import AddToCart from '../../components/common/AddToCart';
import { Trash2, Scale, Info, Layers, Check, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductComparisonPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading, loaded } = useSelector((state) => state.comparison);

  useEffect(() => {
    dispatch(fetchComparison());
  }, []);

  if (loading && (items ?? []).length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if ((items ?? []).length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Scale className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Comparison list is empty</h2>
            <p className="text-slate-500 mb-10 text-lg">Add at least two products to compare their features and specifications.</p>
            <Link to="/home" className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-orange-500/20">
              <ArrowLeft size={20} />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Category', key: 'category', render: (p) => p.category?.name || 'N/A' },
    { label: 'Brand', key: 'brand', render: (p) => p.brand?.name || 'N/A' },
    { label: 'Stock Status', key: 'stock', render: (p) => p.stock_quantity > 0 ? <span className="text-green-500 flex items-center gap-1 font-bold"><Check size={14}/> In Stock</span> : <span className="text-red-500 flex items-center gap-1 font-bold"><X size={14}/> Out of Stock</span> },
    { label: 'SKU', key: 'sku', render: (p) => p.sku || 'N/A' },
    { label: 'Weight', key: 'weight', render: (p) => p.weight ? `${p.weight} kg` : 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              Compare <span className="text-orange-500">Products</span>
            </h1>
            <p className="text-slate-500 mt-2">Side-by-side analysis of your selected items.</p>
          </div>
          <button 
            onClick={() => dispatch(clearComparison())}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-red-500 rounded-2xl font-bold border border-red-100 hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} />
            <span>Clear Comparison</span>
          </button>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-8 text-left bg-slate-50/50 border-r border-slate-100 w-64">
                    <div className="flex items-center space-x-2 text-slate-400 font-black text-xs uppercase tracking-widest">
                      <Layers size={16} />
                      <span>Comparison Matrix</span>
                    </div>
                  </th>
                  {(items ?? []).map((product) => (
                    <th key={product.id} className="p-8 border-r border-slate-100 last:border-0 min-w-[280px]">
                      <div className="relative group">
                        <button 
                          onClick={() => dispatch(removeFromComparison(product.id))}
                          className="absolute -top-4 -right-4 p-2 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <X size={16} />
                        </button>
                        <img src={product.thumbnail} alt={product.name} className="w-32 h-32 object-cover rounded-3xl mx-auto mb-6 shadow-md" />
                        <h3 className="font-black text-slate-900 text-lg leading-tight mb-2">{product.name}</h3>
                        <div className="text-2xl font-black text-orange-500 mb-6">${product.sale_price || product.price}</div>
                        <AddToCart product={product} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-50/30">
                  <td colSpan={(items ?? []).length + 1} className="p-4">
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-xs uppercase tracking-widest">
                      <Info size={14} className="text-orange-500" />
                      <span>Product Specifications</span>
                    </div>
                  </td>
                </tr>
                {specs.map((spec, idx) => (
                  <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-500 bg-slate-50/20 border-r border-slate-100">{spec.label}</td>
                    {(items ?? []).map((product) => (
                      <td key={product.id} className="p-6 text-slate-900 font-medium border-r border-slate-100 last:border-0">
                        {spec.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductComparisonPage;
