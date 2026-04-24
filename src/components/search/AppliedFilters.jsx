import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFilter, clearAllFilters, setFilter } from '../../store/searchSlice';
import { X } from 'lucide-react';

const filterLabels = {
    category: 'Category',
    brand: 'Brand',
    min_price: 'Min Price',
    max_price: 'Max Price',
    color: 'Color',
    size: 'Size',
    rating: 'Rating',
    discount: 'Discount',
    stock_status: 'Stock',
};

const AppliedFilters = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const { appliedFilters, availableFilters } = useSelector((state) => state.search);

    const activeFilters = Object.entries(appliedFilters).filter(([_, v]) => v !== null && v !== undefined && v !== '');

    if (activeFilters.length === 0) return null;

    const getDisplayValue = (key, value) => {
        if (key === 'category') {
            const cat = availableFilters.categories?.find((c) => c.id == value);
            return cat?.name || `Category ${value}`;
        }
        if (key === 'min_price') return `PKR ${value}+`;
        if (key === 'max_price') return `Up to PKR ${value}`;
        if (key === 'discount') return `${value}%+ off`;
        if (key === 'stock_status') return value === 'in_stock' ? 'In Stock' : 'Out of Stock';
        return value;
    };

    const handleRemove = (key) => {
        dispatch(removeFilter(key));
        onFilterChange?.();
    };

    const handleClearAll = () => {
        dispatch(clearAllFilters());
        onFilterChange?.();
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-400 mr-1">Active filters:</span>
            {activeFilters.map(([key, value]) => {
                const values = typeof value === 'string' && value.includes(',') ? value.split(',') : [String(value)];
                return values.map((v) => (
                    <span
                        key={`${key}-${v}`}
                        className="inline-flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] px-3 py-1.5 rounded-full text-xs font-medium border border-[#F97316]/20"
                    >
                        <span className="text-gray-400">{filterLabels[key] || key}:</span>
                        {getDisplayValue(key, v)}
                        <button
                            onClick={() => {
                                if (values.length > 1) {
                                    const newVal = values.filter((x) => x !== v).join(',');
                                    dispatch(setFilter({ key, value: newVal || null }));
                                    onFilterChange?.();
                                } else {
                                    handleRemove(key);
                                }
                            }}
                            className="hover:bg-[#F97316]/20 rounded-full p-0.5 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ));
            })}
            <button
                onClick={handleClearAll}
                className="text-xs text-red-400 hover:text-red-300 ml-2 underline underline-offset-2 transition-colors"
            >
                Clear all
            </button>
        </div>
    );
};

export default AppliedFilters;
