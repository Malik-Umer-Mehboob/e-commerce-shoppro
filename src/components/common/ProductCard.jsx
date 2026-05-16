import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/formatters';
import AddToCart from './AddToCart';
import AddToWishlist from './AddToWishlist';
import { addToComparison, removeFromComparison } from '../../store/comparisonSlice';
import { toast } from 'react-hot-toast';
import { Columns } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const { currentCurrency, currencySymbol, exchangeRate } = useSelector((state) => state.localization);
    const comparisonItems = useSelector(state => state.comparison.items);
    const isInComparison = comparisonItems.some(p => p.id === product.id);

    const getTranslated = (obj, field) => {
        if (!obj) return '';
        const translations = obj.translations || {};
        return translations[i18n.language]?.[field] || obj[field];
    };

    const handleCompare = (e) => {
        e.preventDefault();
        if (isInComparison) {
            dispatch(removeFromComparison(product.id));
            toast('Removed from comparison');
        } else {
            if (comparisonItems.length >= 4) {
                toast.error('Max 4 products can be compared');
                return;
            }
            dispatch(addToComparison(product));
            toast.success('Added to comparison!');
        }
    };

    const price = product.sale_price || product.price;
    const formattedPrice = formatCurrency(price, currentCurrency, currencySymbol, exchangeRate);
    const formattedOldPrice = formatCurrency(product.price, currentCurrency, currencySymbol, exchangeRate);

    return (
        <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            {/* Image Area */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Link to={`/products/${product.id}`}>
                    <img 
                        src={product.thumbnail 
                            ? (product.thumbnail.trim().startsWith('http') ? product.thumbnail.trim() : `http://localhost:8000/storage/${product.thumbnail.trim()}`)
                            : 'https://placehold.co/300'
                        } 
                        alt={product.name} 
                        loading="lazy"
                        decoding="async"
                        width="300"
                        height="300"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                </Link>
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <AddToWishlist product={product} />
                    <button 
                        onClick={handleCompare}
                        className={`p-2 rounded-full transition-all border ${
                            isInComparison 
                                ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                                : 'bg-white text-gray-500 border-gray-100 hover:border-orange-500 hover:text-orange-500 shadow-sm'
                        }`}
                        title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
                    >
                        <Columns size={18} />
                    </button>
                </div>
                {product.sale_price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                        SALE
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-1">
                    <Link to={`/products/${product.id}`}>
                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
                            {getTranslated(product, 'name')}
                        </h3>
                    </Link>
                    <p className="text-xs text-gray-500">{product.category?.name || 'General'}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-orange-500">
                            {formattedPrice}
                        </span>
                        {product.sale_price && (
                            <span className="text-xs text-gray-400 line-through">
                                {formattedOldPrice}
                            </span>
                        )}
                    </div>
                    
                    <div className="w-12 h-12">
                        <AddToCart product={product} showLabel={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
