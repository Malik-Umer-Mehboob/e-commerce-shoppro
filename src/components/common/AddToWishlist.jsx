import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../../store/wishlistSlice';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddToWishlist = ({ product, size = 20 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isInWishlist = useSelector(selectIsInWishlist(product.id));
  // BUG FIX: pehle yeh useSelector click handler ke andar tha. React hooks
  // sirf component ki top level par chal sakte hain, is liye wishlist se
  // product hatate waqt "Invalid hook call" error aata tha.
  const wishlistItems = useSelector((state) => state.wishlist.wishlist?.items || []);
  const [loading, setLoading] = useState(false);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const item = wishlistItems.find(i => i.product_id === product.id);
        if (item) {
          await dispatch(removeFromWishlist(item.id)).unwrap();
        }
      } else {
        // Success toast wishlistSlice khud dikhata hai (pehle 2 dafa dikhta tha)
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (err) {
      toast.error(err?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-300 transform active:scale-90 ${
        isInWishlist 
          ? 'bg-red-50 text-red-500' 
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
      } disabled:opacity-50`}
    >
      <Heart size={size} fill={isInWishlist ? 'currentColor' : 'none'} />
    </button>
  );
};

export default AddToWishlist;
