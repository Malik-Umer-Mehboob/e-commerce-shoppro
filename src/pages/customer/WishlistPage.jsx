import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchWishlist, 
  removeFromWishlist, 
  selectWishlistItems, 
  updateWishlistPrivacy 
} from '../../store/wishlistSlice';
import Header from '../../components/layout/Header';
import AddToCart from '../../components/common/AddToCart';
import { Heart, Trash2, ArrowRight, Share2, Lock, Globe, Copy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const { loading, wishlist } = useSelector((state) => state.wishlist);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  const togglePrivacy = () => {
    const newPrivacy = wishlist?.privacy === 'public' ? 'private' : 'public';
    dispatch(updateWishlistPrivacy(newPrivacy));
  };

  const copyShareLink = () => {
    if (!wishlist?.share_token) return;
    const url = `${window.location.origin}/wishlist/shared/${wishlist.share_token}`;
    navigator.clipboard.writeText(url);
    setCopying(true);
    toast.success('Share link copied to clipboard!');
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-10 text-lg">Curate your perfect collection. Save the products you love and we'll keep them here for you.</p>
            <Link 
              to="/home" 
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-orange-500/20"
            >
              Start Exploring <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4">
              My <span className="text-orange-500">Wishlist</span>
              <span className="text-sm font-black bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full uppercase tracking-widest">
                {items.length} Items
              </span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Your curated selection of favorites.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={togglePrivacy}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold transition-all border ${
                wishlist?.privacy === 'public' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : 'bg-white text-slate-600 border-slate-100'
              }`}
            >
              {wishlist?.privacy === 'public' ? <Globe size={18} /> : <Lock size={18} />}
              <span>{wishlist?.privacy === 'public' ? 'Publicly Shared' : 'Private Wishlist'}</span>
            </button>
            
            {wishlist?.privacy === 'public' && (
              <button 
                onClick={copyShareLink}
                className="flex items-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                {copying ? <CheckCircle size={18} /> : <Copy size={18} />}
                <span>{copying ? 'Copied!' : 'Copy Share Link'}</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img 
                  src={item.product?.thumbnail || 'https://placehold.co/400'} 
                  alt={item.product?.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-lg hover:scale-110"
                  title="Remove from wishlist"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">
                  {item.product?.category?.name || 'Accessories'}
                </p>
                <Link to={`/products/${item.product_id}`} className="block">
                  <h3 className="text-xl font-black text-slate-900 line-clamp-1 mb-4 group-hover:text-orange-500 transition-colors">
                    {item.product?.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl font-black text-slate-900">${item.product?.sale_price || item.product?.price}</span>
                    {item.product?.sale_price && (
                      <span className="text-sm text-slate-400 line-through">${item.product?.price}</span>
                    )}
                  </div>
                </Link>
                
                <AddToCart product={item.product} showLabel={true} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
