import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { ShoppingCart, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const AddToCart = ({ product, variant = null, initialQty = 1, showLabel = true }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      await dispatch(addToCart({
        product_id: product.id,
        variant_id: variant?.id || null,
        quantity: initialQty
      })).unwrap();
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 ${
        added 
          ? 'bg-green-600 text-white' 
          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
      } ${!showLabel ? 'p-2 rounded-full w-10 h-10' : 'w-full'} disabled:opacity-70`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : added ? (
        <>
          <Check size={20} />
          {showLabel && <span>Added</span>}
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          {showLabel && <span>Add to Cart</span>}
        </>
      )}
    </button>
  );
};

export default AddToCart;
