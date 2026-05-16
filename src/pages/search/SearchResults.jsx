import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts, setSortBy, setFilter, clearAllFilters, setQuery } from '../../store/searchSlice';
import Header from '../../components/layout/Header';
import SearchResultsSidebar from './components/SearchResultsSidebar';
import ProductCard from '../../components/common/ProductCard';
import SEOHead from '../../components/SEOHead';
import {
    Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
    Package, Loader2, Star, ShoppingCart, Heart, ListFilter, Sparkles
} from 'lucide-react';

const SearchResults = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { results, pagination, loading, query: searchStateQuery, sortBy, appliedFilters, availableFilters } = useSelector((state) => state.search);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Find category name if category filter is active
    const activeCategory = appliedFilters.category && availableFilters.category
        ? availableFilters.category.find(c => c.id.toString() === appliedFilters.category.toString())
        : null;

    const query = searchParams.get('q') || '';

    useEffect(() => {
        const params = Object.fromEntries([...searchParams.entries()]);
        dispatch(searchProducts(params));
    }, [searchParams, dispatch]);

    const syncUrl = useCallback((overrides = {}) => {
        const params = new URLSearchParams();
        const currentQuery = overrides.q !== undefined ? overrides.q : query;
        const currentSort = overrides.sort_by !== undefined ? overrides.sort_by : sortBy;
        const currentFilters = { ...appliedFilters, ...overrides };

        if (currentQuery) params.set('q', currentQuery);
        if (currentSort && currentSort !== 'relevance') params.set('sort_by', currentSort);
        
        Object.entries(currentFilters).forEach(([key, val]) => {
            if (val && key !== 'q' && key !== 'sort_by' && key !== 'page') {
              params.set(key, Array.isArray(val) ? val.join(',') : val);
            }
        });

        if (overrides.page) params.set('page', overrides.page);

        setSearchParams(params, { replace: true });
    }, [query, sortBy, appliedFilters, setSearchParams]);

    const handlePageChange = (page) => {
        syncUrl({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {activeCategory ? (
                <SEOHead
                    title={`${activeCategory.name} - ShopPro`}
                    description={`Browse ${activeCategory.name} products at ShopPro`}
                />
            ) : query ? (
                <SEOHead
                    title={`Search results for "${query}" - ShopPro`}
                    description={`Explore products matching "${query}" at ShopPro`}
                />
            ) : (
                <SEOHead />
            )}
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero / Header Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center space-x-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                          <Sparkles size={14} />
                          <span>Search Explorer</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            {query ? (
                                <>Showing results for <span className="text-orange-500">"{query}"</span></>
                            ) : (
                                'Discover All <span className="text-orange-500">Products</span>'
                            )}
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">
                            We found <span className="text-slate-900 font-black">{pagination.total}</span> items matching your criteria.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-orange-500 transition-colors">
                            <ListFilter size={18} />
                          </div>
                          <select
                              value={sortBy}
                              onChange={(e) => syncUrl({ sort_by: e.target.value })}
                              className="bg-white border border-slate-100 text-slate-900 pl-12 pr-10 py-4 rounded-2xl font-bold appearance-none shadow-sm hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-orange-500"
                          >
                              <option value="relevance">Sort by Relevance</option>
                              <option value="price_low">Price: Low to High</option>
                              <option value="price_high">Price: High to Low</option>
                              <option value="newest">Newest Arrivals</option>
                          </select>
                        </div>

                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden p-4 bg-white border border-slate-100 text-slate-900 rounded-2xl shadow-sm"
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <SearchResultsSidebar 
                        availableFilters={availableFilters}
                        appliedFilters={appliedFilters}
                        onFilterChange={(key, val) => {
                          if (key === 'clear') {
                            dispatch(clearAllFilters());
                            syncUrl({ q: query, sort_by: sortBy });
                          } else {
                            syncUrl({ [key]: Array.isArray(val) ? val.join(',') : val, page: undefined });
                          }
                        }}
                        onPriceChange={(key, val) => {
                          // Debounced URL sync could be added here
                          syncUrl({ [key]: val, page: undefined });
                        }}
                    />

                    {/* Results Area */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                <div className="relative">
                                  <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Search size={20} className="text-slate-300" />
                                  </div>
                                </div>
                                <p className="mt-6 font-black uppercase tracking-widest text-xs">Hunting for the best results...</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <Package size={40} className="text-slate-300" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">No results found</h2>
                                <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                                    Try adjusting your filters or search terms. Sometimes less is more!
                                </p>
                                <button
                                    onClick={() => { dispatch(clearAllFilters()); syncUrl({ q: '' }); }}
                                    className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {results.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="flex items-center justify-center space-x-3 mt-16">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        
                                        {Array.from({ length: pagination.last_page }).map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-14 h-14 rounded-2xl font-black transition-all ${
                                                    pagination.current_page === i + 1 
                                                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                                                      : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-100 shadow-sm'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
