import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/searchSlice';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-700 pb-4 mb-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-sm font-semibold text-white mb-3 hover:text-[#F97316] transition-colors"
            >
                {title}
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open && <div>{children}</div>}
        </div>
    );
};

const SearchFilters = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const { availableFilters, appliedFilters } = useSelector((state) => state.search);
    const [priceMin, setPriceMin] = useState(appliedFilters.min_price || '');
    const [priceMax, setPriceMax] = useState(appliedFilters.max_price || '');

    const handleFilterChange = (key, value) => {
        dispatch(setFilter({ key, value }));
        onFilterChange?.();
    };

    const handleCheckboxFilter = (key, value) => {
        const current = appliedFilters[key] ? appliedFilters[key].split(',') : [];
        const idx = current.indexOf(value);
        if (idx >= 0) {
            current.splice(idx, 1);
        } else {
            current.push(value);
        }
        handleFilterChange(key, current.length > 0 ? current.join(',') : null);
    };

    const isChecked = (key, value) => {
        return appliedFilters[key]?.split(',').includes(value);
    };

    const handlePriceApply = () => {
        handleFilterChange('min_price', priceMin || null);
        handleFilterChange('max_price', priceMax || null);
    };

    const colorMap = {
        red: '#EF4444', blue: '#3B82F6', green: '#22C55E', black: '#1F2937',
        white: '#F9FAFB', yellow: '#EAB308', pink: '#EC4899', purple: '#A855F7',
        orange: '#F97316', gray: '#6B7280', brown: '#92400E', navy: '#1E3A5F',
        beige: '#D2B48C', maroon: '#800000', teal: '#14B8A6', gold: '#FFD700',
    };

    return (
        <div className="bg-[#1E293B] rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#F97316] rounded-full" />
                Filters
            </h3>

            {/* Categories */}
            {availableFilters.categories?.length > 0 && (
                <FilterSection title="Category">
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {availableFilters.categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleFilterChange('category', appliedFilters.category == cat.id ? null : cat.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                  ${appliedFilters.category == cat.id
                                        ? 'bg-[#F97316]/20 text-[#F97316] font-medium'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span>{cat.name}</span>
                                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{cat.count}</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Price Range */}
            <FilterSection title="Price Range">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="number"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                placeholder={`Min (${availableFilters.price_range?.min || 0})`}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316]"
                                id="filter-price-min"
                            />
                        </div>
                        <span className="text-gray-500 self-center">—</span>
                        <div className="flex-1">
                            <input
                                type="number"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                placeholder={`Max (${availableFilters.price_range?.max || 10000})`}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F97316]"
                                id="filter-price-max"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handlePriceApply}
                        className="w-full bg-[#F97316]/10 text-[#F97316] text-sm font-medium py-2 rounded-lg hover:bg-[#F97316]/20 transition-colors"
                    >
                        Apply Price
                    </button>
                </div>
            </FilterSection>

            {/* Brands */}
            {availableFilters.brands?.length > 0 && (
                <FilterSection title="Brand">
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {availableFilters.brands.map((b) => (
                            <label key={b.brand} className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer px-1 py-1">
                                <input
                                    type="checkbox"
                                    checked={isChecked('brand', b.brand)}
                                    onChange={() => handleCheckboxFilter('brand', b.brand)}
                                    className="w-4 h-4 rounded border-gray-600 text-[#F97316] focus:ring-[#F97316] bg-gray-800"
                                />
                                <span className="flex-1">{b.brand}</span>
                                <span className="text-xs text-gray-500">{b.count}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Colors */}
            {availableFilters.colors?.length > 0 && (
                <FilterSection title="Color">
                    <div className="flex flex-wrap gap-2">
                        {availableFilters.colors.map((c) => (
                            <button
                                key={c.color}
                                onClick={() => handleCheckboxFilter('color', c.color)}
                                title={`${c.color} (${c.count})`}
                                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center
                  ${isChecked('color', c.color)
                                        ? 'border-[#F97316] ring-2 ring-[#F97316]/30 scale-110'
                                        : 'border-gray-600 hover:border-gray-400'
                                    }`}
                                style={{ backgroundColor: colorMap[c.color?.toLowerCase()] || c.color }}
                            >
                                {isChecked('color', c.color) && (
                                    <span className="text-white text-xs font-bold drop-shadow-lg">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Sizes */}
            {availableFilters.sizes?.length > 0 && (
                <FilterSection title="Size">
                    <div className="flex flex-wrap gap-2">
                        {availableFilters.sizes.map((s) => (
                            <button
                                key={s.size}
                                onClick={() => handleCheckboxFilter('size', s.size)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                  ${isChecked('size', s.size)
                                        ? 'bg-[#F97316] text-white border-[#F97316]'
                                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                {s.size}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Discount */}
            <FilterSection title="Discount" defaultOpen={false}>
                <div className="space-y-2">
                    {[10, 20, 30, 50].map((pct) => (
                        <button
                            key={pct}
                            onClick={() => handleFilterChange('discount', appliedFilters.discount == pct ? null : pct)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                ${appliedFilters.discount == pct
                                    ? 'bg-[#F97316]/20 text-[#F97316] font-medium'
                                    : 'text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {pct}% or more
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Stock */}
            <FilterSection title="Availability" defaultOpen={false}>
                <div className="space-y-2">
                    {[
                        { value: 'in_stock', label: 'In Stock' },
                        { value: 'out_of_stock', label: 'Out of Stock' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleFilterChange('stock_status', appliedFilters.stock_status === opt.value ? null : opt.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                ${appliedFilters.stock_status === opt.value
                                    ? 'bg-[#F97316]/20 text-[#F97316] font-medium'
                                    : 'text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
};

export default SearchFilters;
