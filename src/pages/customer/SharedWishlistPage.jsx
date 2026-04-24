import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSharedWishlist } from '../../store/wishlistSlice';
import Header from '../../components/layout/Header';
import AddToCart from '../../components/common/AddToCart';
import { Globe, ShoppingBag, ArrowRight } from 'lucide-react';

const SharedWishlistPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { sharedWishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchSharedWishlist(token));
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!sharedWishlist) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Wishlist not found</h2>
            <p className="text-slate-500 mb-10 text-lg">This wishlist may be private or the link has expired.</p>
            <Link to="/home" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black transition-all">
              Go to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Globe size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Shared Collection</h1>
              <p className="text-slate-500 font-medium">Curated by {sharedWishlist.user?.name}</p>
            </div>
          </div>
          <Link to="/home" className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest hover:gap-4 transition-all">
            <span>Explore ShopPro</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sharedWishlist.items.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={item.product?.thumbnail || 'https://via.placeholder.com/400'} 
                  alt={item.product?.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-black text-slate-900 line-clamp-1 mb-4">
                  {item.product?.name}
                </h3>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl font-black text-slate-900">${item.product?.sale_price || item.product?.price}</span>
                </div>
                <AddToCart product={item.product} showLabel={true} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SharedWishlistPage;
