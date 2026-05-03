import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import api from '../../services/api';
import { ShoppingBag, ChevronLeft, ChevronRight, Filter, Search as SearchIcon } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: {
          page,
          per_page: 12,
        }
      });

      // API returns { success: true, data: { products: { data: [...], ... }, stats: {...} } }
      const productsData = response.data?.data?.products;
      if (productsData) {
        setProducts(productsData.data || []);
        setCurrentPage(productsData.current_page);
        setLastPage(productsData.last_page);
        setTotal(productsData.total);
      } else {
        setProducts([]);
      }
    } catch (err) {
      
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loaded && currentPage === 1) return;
    fetchProducts(currentPage);
    setLoaded(true);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title="All Products - ShopPro"
        description="Browse our complete collection of premium products"
      />
      <Header />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#0F172A]">Our <span className="text-orange-500">Shop</span></h1>
            <p className="text-gray-500 mt-2 font-medium">Showing {products.length} of {total} products</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:w-64">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-medium"
              />
            </div>
            <button className="bg-white border border-gray-100 p-3 rounded-2xl text-gray-500 hover:text-orange-500 transition-all shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-5 rounded-3xl border border-gray-100 h-96">
                <div className="bg-gray-100 h-56 rounded-2xl mb-4"></div>
                <div className="bg-gray-100 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-100 h-6 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(lastPage)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      currentPage === i + 1
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-white text-gray-500 hover:text-orange-500 border border-gray-100 shadow-sm'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">We couldn't find any products in our shop right now.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
