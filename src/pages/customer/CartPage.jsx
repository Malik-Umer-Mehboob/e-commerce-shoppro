import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  updateCartItem, 
  removeCartItem, 
  applyCoupon,
  selectCart,
  selectCartItems
} from '../../store/cartSlice';
import Header from '../../components/layout/Header';
import { Trash2, Minus, Plus, ShoppingBag, Receipt, Truck, Tag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const { loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const itemsRef = useRef(items);
  
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const handleUpdateQty = (itemId, delta) => {
    const currentItem = itemsRef.current.find(i => i.id === itemId);
    if (!currentItem) return;
    
    const newQty = currentItem.quantity + delta;
    if (newQty < 1) return;
    
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    dispatch(applyCoupon(couponCode)).unwrap()
      .then(() => toast.success('Coupon applied!'))
      .catch((err) => toast.error(err.message || 'Invalid coupon'));
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/home" 
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product?.thumbnail || 'https://placehold.co/150'} alt={item.product?.name || 'Unknown Product'} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{item.product?.name || 'Unknown Product'}</h3>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.color && ` • Color: ${item.variant.color}`}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    {/* Qty Selector */}
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="p-1 hover:bg-white rounded transition-colors text-gray-600 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="p-1 hover:bg-white rounded transition-colors text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Price/unit: ${item.price}</p>
                      <p className="text-xl font-black text-orange-500">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Receipt className="text-orange-500" /> Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span className="font-semibold text-gray-900">${cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck size={16} /> Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {cart.shipping_amount === "0.00" ? 'Free' : `$${cart.shipping_amount}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (10%)</span>
                  <span className="font-semibold text-gray-900">${cart.tax_amount}</span>
                </div>
                {parseFloat(cart.discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1"><Tag size={16} /> Discount</span>
                    <span>-${cart.discount_amount}</span>
                  </div>
                )}
                
                <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center text-gray-900">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-black text-orange-500">${cart.total}</span>
                  </div>
                </div>
              </div>
              
              {/* Promo Code */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Have a promo code?</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-black transition-all">
                    Apply
                  </button>
                </div>
                {cart.coupon_code && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                    <Tag size={12} /> Coupon "{cart.coupon_code}" applied!
                  </p>
                )}
              </form>
              
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/checkout');
                  } else {
                    toast.error('Please login to checkout');
                    navigate('/login', { state: { from: '/checkout' } });
                  }
                }}
                className="w-full bg-[#0F172A] hover:bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/home" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
