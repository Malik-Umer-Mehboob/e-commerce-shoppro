import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { selectCartItemsCount } from '../../store/cartSlice';

const CartIcon = () => {
  const itemCount = useSelector(selectCartItemsCount);

  return (
    <Link 
      to="/cart" 
      className="relative p-2 text-gray-300 hover:text-white transition-colors duration-200"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full min-w-[18px] min-h-[18px]">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
