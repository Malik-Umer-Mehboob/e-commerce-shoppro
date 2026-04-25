import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/common/ProductCard';
import api from '../../services/api';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data: productsData, isLoading: loading, error } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data.data?.data || response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const products = productsData || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#0F172A] py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Sparkles size={16} /> New Season Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
              Shop the Best <span className="text-orange-500">Premium</span> Products
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Discover our curated selection of high-quality items designed to elevate your lifestyle. Quality and style, delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-orange-500/20 flex items-center gap-2">
                Shop Now <ChevronRight size={20} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-md">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">Featured Products</h2>
            <p className="text-gray-500 mt-2">Our most popular and trending items this week.</p>
          </div>
          <Link to="/products" className="text-orange-500 font-bold hover:underline flex items-center gap-1">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white p-5 rounded-3xl border border-gray-100 h-80">
                <div className="bg-gray-100 h-48 rounded-2xl mb-4"></div>
                <div className="bg-gray-100 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-100 h-6 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500">We're restocking soon. Please check back later!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
