import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComparison, clearComparison, removeFromComparison } from '../../store/comparisonSlice';
import { Columns, X, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComparisonSidebar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading, loaded } = useSelector((state) => state.comparison);

  useEffect(() => {
    dispatch(fetchComparison());
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-8 z-[45] animate-in slide-in-from-left duration-300">
      <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border border-white/10 w-80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Columns size={20} className="text-orange-500" />
            <span className="font-black text-sm uppercase tracking-widest">Comparison</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">{items.length}/4</span>
          </div>
          <button 
            onClick={() => dispatch(clearComparison())}
            className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((product) => (
            <div key={product.id} className="flex items-center space-x-3 group relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{product.name}</p>
                <p className="text-[10px] text-orange-500 font-black">${product.sale_price || product.price}</p>
              </div>
              <button 
                onClick={() => dispatch(removeFromComparison(product.id))}
                className="opacity-0 group-hover:opacity-100 p-1 bg-red-500 rounded-lg text-white transition-all hover:scale-110"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <Link 
          to="/compare" 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-orange-500/20"
        >
          <span>Compare Now</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default ComparisonSidebar;
