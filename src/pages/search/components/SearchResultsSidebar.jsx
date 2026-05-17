import React from 'react';
import { Filter, ChevronDown, Check, Star } from 'lucide-react';

const SearchResultsSidebar = ({ availableFilters, appliedFilters, onFilterChange, onPriceChange }) => {
  const isSelected = (key, value) => {
    const current = appliedFilters[key];
    if (!current) return false;
    if (Array.isArray(current)) return current.includes(value);
    return current === value.toString();
  };

  const handleToggle = (key, value) => {
    let current = appliedFilters[key] || [];
    if (!Array.isArray(current)) current = [current];

    const newValue = current.includes(value.toString())
      ? current.filter(v => v !== value.toString())
      : [...current, value.toString()];
    
    onFilterChange(key, newValue);
  };

  return (
    <aside className="w-80 space-y-8 sticky top-24 h-fit hidden lg:block">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Filter size={20} className="text-orange-500" />
          <span>Refine Results</span>
        </h2>
        <button 
          onClick={() => onFilterChange('clear', {})}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
          Categories <ChevronDown size={14} />
        </h3>
        <div className="space-y-3">
          {availableFilters.categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleToggle('category', cat.id)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${isSelected('category', cat.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-100 group-hover:border-orange-500'}`}>
                  {isSelected('category', cat.id) && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-bold transition-colors ${isSelected('category', cat.id) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  {cat.name}
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-300 group-hover:text-orange-500 transition-colors">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
          Popular Brands <ChevronDown size={14} />
        </h3>
        <div className="space-y-3">
          {availableFilters.brands?.map((brand) => (
            <button
              key={brand.brand}
              onClick={() => handleToggle('brand', brand.brand)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${isSelected('brand', brand.brand) ? 'bg-orange-500 border-orange-500' : 'border-slate-100 group-hover:border-orange-500'}`}>
                  {isSelected('brand', brand.brand) && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm font-bold transition-colors ${isSelected('brand', brand.brand) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  {brand.brand}
                </span>
              </div>
              <span className="text-[10px] font-black text-slate-300 group-hover:text-orange-500 transition-colors">{brand.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Price Range</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black">$</span>
              <input 
                type="number" 
                placeholder="Min"
                className="w-full pl-6 pr-3 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={appliedFilters.min_price || ''}
                onChange={(e) => onPriceChange('min_price', e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black">$</span>
              <input 
                type="number" 
                placeholder="Max"
                className="w-full pl-6 pr-3 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={appliedFilters.max_price || ''}
                onChange={(e) => onPriceChange('max_price', e.target.value)}
              />
            </div>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-orange-500 w-1/2 left-1/4"></div>
          </div>
        </div>
      </section>

      {/* Ratings */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Minimum Rating</h3>
        <div className="space-y-3">
          {[4, 3, 2].map((star) => (
            <button
              key={star}
              onClick={() => onFilterChange('rating', star)}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${appliedFilters.rating == star ? 'bg-orange-500 border-orange-500' : 'border-slate-100 group-hover:border-orange-500'}`}>
                  {appliedFilters.rating == star && <Check size={12} className="text-white" />}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">{star}+</span>
                  <div className="flex text-orange-400">
                    {[...Array(star)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default React.memo(SearchResultsSidebar);
