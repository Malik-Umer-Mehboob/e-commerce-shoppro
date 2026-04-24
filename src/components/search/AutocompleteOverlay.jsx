import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Tag, ArrowRight, Sparkles } from 'lucide-react';

const AutocompleteOverlay = ({ results, query, onSelect }) => {
  if (!results || (!results.products?.length && !results.categories?.length && !results.suggestions?.length)) {
    return null;
  }

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={i} className="text-orange-500 font-black">{part}</span> 
        : part
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-300">
      <div className="max-h-[70vh] overflow-y-auto">
        {results.did_you_mean && (
          <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center space-x-2">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-sm text-slate-600 font-bold">Did you mean:</span>
            <button 
              onClick={() => onSelect(results.did_you_mean)}
              className="text-sm text-orange-500 font-black hover:underline"
            >
              {results.did_you_mean}
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-3 divide-x divide-slate-50">
          {/* Suggestions Column */}
          <div className="p-6 space-y-6">
            {results.suggestions?.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Search size={12} /> Related Searches
                </h3>
                <div className="space-y-1">
                  {results.suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSelect(s)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 transition-colors flex items-center justify-between group"
                    >
                      <span>{highlightText(s, query)}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.categories?.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag size={12} /> Categories
                </h3>
                <div className="space-y-1">
                  {results.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/search?category=${cat.id}`}
                      onClick={() => onSelect(cat.name)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 transition-colors flex items-center justify-between group"
                    >
                      <span>{highlightText(cat.name, query)}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-500" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Column (Spans 2) */}
          <div className="md:col-span-2 p-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package size={12} /> Product Previews
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.products?.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => onSelect(product.name)}
                  className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{highlightText(product.name, query)}</p>
                    <p className="text-xs text-orange-500 font-black">${product.sale_price || product.price}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{product.brand}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {results.products?.length === 5 && (
              <button 
                onClick={() => onSelect(query)}
                className="w-full mt-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest transition-all"
              >
                View all results for "{query}"
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutocompleteOverlay;
