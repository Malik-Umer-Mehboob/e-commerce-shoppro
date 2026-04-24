import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import AddToCart from '../../components/common/AddToCart';
import AddToWishlist from '../../components/common/AddToWishlist';
import api from '../../services/api';
import { Minus, Plus, ChevronLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        if (response.data.variants?.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentPrice = selectedVariant?.price || product.sale_price || product.price;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
              <img 
                src={product.thumbnail || 'https://via.placeholder.com/600'} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail placeholders */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-gray-50 border border-gray-100 cursor-pointer overflow-hidden opacity-50 hover:opacity-100 transition-opacity">
                  <img src={product.thumbnail || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">{product.category?.name || 'General'}</span>
                <h1 className="text-4xl font-black text-gray-900 mt-2 mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <span className="text-gray-400 text-sm ml-2 font-medium">(120 Reviews)</span>
                  </div>
                </div>
              </div>
              <AddToWishlist product={product} size={24} />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-orange-500">${currentPrice}</span>
              {(product.sale_price || (selectedVariant && selectedVariant.price < product.price)) && (
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
              )}
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                SAVE 20%
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description || 'Experience premium quality with our latest collection. Designed for comfort and style.'}
            </p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">Select Variant</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl border-2 transition-all font-medium ${
                        selectedVariant?.id === variant.id
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-100 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {variant.color || variant.size || variant.material || `Variant ${variant.id}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Area */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 rounded-2xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-gray-600"
                >
                  <Minus size={20} />
                </button>
                <span className="w-8 text-lg font-black text-center text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-gray-600"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex-1">
                <AddToCart product={product} variant={selectedVariant} initialQty={quantity} />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-12 py-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium">Genuine Product</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Truck size={20} />
                </div>
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
