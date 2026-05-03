import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Truck, MapPin, CreditCard, Banknote, 
    Building2, Ticket, ChevronRight, 
    ShieldCheck, RotateCcw, Headset,
    Loader2, Check, X, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import checkoutService from '../../services/checkoutService';
import api from '../../services/api';
import { selectCart, selectCartItems } from '../../store/cartSlice';

const checkoutSchema = z.object({
    full_name: z.string().min(2, 'Full name required'),
    phone: z.string().min(10, 'Valid phone number required'),
    address_line_1: z.string().min(5, 'Address required'),
    address_line_2: z.string().optional(),
    city: z.string().min(1, 'Please select a city'),
    country: z.string().default('Pakistan'),
    notes: z.string().optional(),
    payment_method: z.enum(['cod', 'bank_transfer']),
    reference_number: z.string().optional(),
    coupon_code: z.string().optional(),
}).refine((data) => {
    if (data.payment_method === 'bank_transfer') {
        return !!data.reference_number &&
            data.reference_number.length > 3;
    }
    return true;
}, {
    message: 'Transaction reference number is required for bank transfer',
    path: ['reference_number'],
});

export default function Checkout() {
    const navigate = useNavigate();
    const cart = useSelector(selectCart);
    const items = useSelector(selectCartItems);
    const subtotal = cart?.subtotal || 0;
    const { user } = useSelector(state => state.auth);
    
    const [loading, setLoading] = useState(false);
    const [shippingZones, setShippingZones] = useState([]);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState('');
    const [discount, setDiscount] = useState(0);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            country: 'Pakistan',
            payment_method: 'cod',
            full_name: user?.name || '',
        }
    });

    const paymentMethod = watch('payment_method');
    const watchCity = watch('city');

    useEffect(() => {
        if (!items || items.length === 0) {
            navigate('/cart');
            return;
        }

        const loadData = async () => {
            try {
                const [zonesRes, addressesRes] = await Promise.all([
                    checkoutService.getShippingZones(),
                    checkoutService.getSavedAddresses()
                ]);
                setShippingZones(zonesRes.data.data || []);
                setSavedAddresses(addressesRes.data?.data || []);
            } catch (error) {
                
            }
        };
        loadData();
    }, [items, navigate]);

    useEffect(() => {
        if (watchCity) {
            const zone = shippingZones.find(z => z.city === watchCity);
            setSelectedCity(zone || { city: watchCity, delivery_charge: 350, estimated_days: 5 });
        }
    }, [watchCity, shippingZones]);

    const handleAddressSelect = (e) => {
        const addressId = e.target.value;
        if (!addressId) return;
        
        const address = savedAddresses.find(a => a.id === parseInt(addressId));
        if (address) {
            setValue('full_name', address.full_name || user.name);
            setValue('phone', address.phone);
            setValue('address_line_1', address.address_line_1);
            setValue('address_line_2', address.address_line_2);
            setValue('city', address.city);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        try {
            const response = await api.post('/coupons/validate', {
                code: couponInput.trim(),
                order_amount: subtotal,
            });
            const data = response.data?.data;
            setAppliedCoupon({
                code: data.code,
                discount_amount: data.discount_amount,
                message: data.message,
            });
            setDiscount(data.discount_amount);
            toast.success('Coupon applied! ' + data.message);
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid coupon';
            toast.error(message);
            setAppliedCoupon(null);
            setDiscount(0);
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        setDiscount(0);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await checkoutService.placeOrder({
                ...data,
                shipping_address: {
                    full_name: data.full_name,
                    phone: data.phone,
                    address_line_1: data.address_line_1,
                    address_line_2: data.address_line_2,
                    city: data.city,
                    country: data.country
                },
                coupon_code: appliedCoupon?.code
            });

            if (res.data.success) {
                navigate('/order-confirmation', { state: res.data.data });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const shippingCost = selectedCity?.delivery_charge || 0;
    const grandTotal = subtotal + shippingCost - discount;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumbs */}
                <nav className="flex mb-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <Link to="/cart" className="hover:text-[#F97316] transition-colors">Cart</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-[#0F172A]">Checkout</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span>Confirmation</span>
                </nav>

                <h1 className="text-4xl font-black text-[#0F172A] mb-12">Checkout</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Shipping Address Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-[#F97316]" />
                                </div>
                                <h2 className="text-2xl font-black text-[#0F172A]">Shipping Address</h2>
                            </div>

                            {savedAddresses.length > 0 && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Select saved address</label>
                                    <select 
                                        onChange={handleAddressSelect}
                                        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 outline-none"
                                    >
                                        <option value="">+ Add new address</option>
                                        {savedAddresses.map(addr => (
                                            <option key={addr.id} value={addr.id}>{addr.address_line_1}, {addr.city}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                    <input 
                                        {...register('full_name')}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] placeholder:text-gray-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.full_name && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.full_name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                    <input 
                                        {...register('phone')}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] placeholder:text-gray-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                        placeholder="03XX-XXXXXXX"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                    <select 
                                        {...register('city')}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select City</option>
                                    {shippingZones && Array.isArray(shippingZones) && shippingZones.map(zone => (
                                        <option key={zone.id} value={zone.city}>{zone.city}</option>
                                    ))}
                                    {(!shippingZones || !Array.isArray(shippingZones) || !shippingZones.some(z => z.city === 'Karachi')) && <option value="Karachi">Karachi</option>}
                                    {(!shippingZones || !Array.isArray(shippingZones) || !shippingZones.some(z => z.city === 'Lahore')) && <option value="Lahore">Lahore</option>}
                                    {(!shippingZones || !Array.isArray(shippingZones) || !shippingZones.some(z => z.city === 'Islamabad')) && <option value="Islamabad">Islamabad</option>}
                                    </select>
                                    {errors.city && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.city.message}</p>}
                                    {selectedCity && (
                                        <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">
                                            Delivery to {selectedCity.city}: Rs. {selectedCity.delivery_charge} ({selectedCity.estimated_days} days)
                                        </p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address Line 1</label>
                                    <input 
                                        {...register('address_line_1')}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] placeholder:text-gray-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                        placeholder="House #, Street, Sector..."
                                    />
                                    {errors.address_line_1 && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.address_line_1.message}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address Line 2 (Optional)</label>
                                    <input 
                                        {...register('address_line_2')}
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] placeholder:text-gray-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                        placeholder="Apartment, building, floor etc."
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Special Instructions (Optional)</label>
                                    <textarea 
                                        {...register('notes')}
                                        rows="3"
                                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] placeholder:text-gray-300 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                        placeholder="Any notes for delivery?"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-black text-[#0F172A]">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                {/* COD */}
                                <label className={`flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#F97316] bg-orange-50/30' : 'border-slate-50 bg-white hover:border-slate-100'}`}>
                                    <input type="radio" value="cod" {...register('payment_method')} className="hidden" />
                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-6 shrink-0">
                                        <Banknote className="w-6 h-6 text-[#F97316]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <span className="text-lg font-black text-[#0F172A]">Cash on Delivery</span>
                                            <span className="ml-3 px-2 py-1 bg-orange-100 text-[#F97316] text-[8px] font-black uppercase rounded-lg">Most Popular</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Pay when your order arrives at your door</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-[#F97316] bg-[#F97316]' : 'border-slate-200'}`}>
                                        {paymentMethod === 'cod' && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                </label>

                                {/* Bank Transfer */}
                                <label className={`flex flex-col p-6 rounded-3xl border-2 transition-all cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-[#F97316] bg-orange-50/30' : 'border-slate-50 bg-white hover:border-slate-100'}`}>
                                    <div className="flex items-center">
                                        <input type="radio" value="bank_transfer" {...register('payment_method')} className="hidden" />
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-6 shrink-0">
                                            <Building2 className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-lg font-black text-[#0F172A]">Bank Transfer</span>
                                            <p className="text-sm text-gray-500 font-medium">Transfer to our bank account</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'bank_transfer' ? 'border-[#F97316] bg-[#F97316]' : 'border-slate-200'}`}>
                                            {paymentMethod === 'bank_transfer' && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>

                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="mt-6 p-6 bg-white rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Our Bank Details</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Bank</span>
                                                    <span className="text-[#0F172A] font-bold">HBL Bank</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Account Title</span>
                                                    <span className="text-[#0F172A] font-bold">ShopPro Pvt Ltd</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">Account Number</span>
                                                    <span className="text-[#0F172A] font-bold">1234-5678-9012</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 font-medium">IBAN</span>
                                                    <span className="text-[#0F172A] font-bold text-[10px]">PK36HABB0000001234567890</span>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-slate-50">
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Transaction Reference Number</label>
                                                <input 
                                                    {...register('reference_number')}
                                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                                                    placeholder="Enter transaction ID"
                                                />
                                                {errors.reference_number && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{errors.reference_number.message}</p>}
                                            </div>
                                        </div>
                                    )}
                                </label>

                                {/* Online Pay (Disabled) */}
                                <div className="flex items-center p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center mr-6 shrink-0">
                                        <CreditCard className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <span className="text-lg font-black text-gray-400">Pay Online (Card)</span>
                                            <span className="ml-3 px-2 py-1 bg-gray-200 text-gray-500 text-[8px] font-black uppercase rounded-lg">Coming Soon</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium">Secure online payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <Ticket className="w-6 h-6 text-[#F97316]" />
                                </div>
                                <h2 className="text-2xl font-black text-[#0F172A]">Have a coupon?</h2>
                            </div>

                            {!appliedCoupon ? (
                                <div className="flex space-x-3">
                                    <input 
                                        type="text"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !couponInput}
                                        className="px-8 py-4 bg-white border-2 border-[#F97316] text-[#F97316] rounded-2xl font-black text-sm hover:bg-orange-50 transition-all disabled:opacity-50"
                                    >
                                        {couponLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-green-50 p-5 rounded-2xl flex items-center justify-between border border-green-100">
                                    <div className="flex items-center text-green-700">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold">Coupon <span className="font-black">"{appliedCoupon.code}"</span> applied! {appliedCoupon.message} — Rs. {appliedCoupon.discount_amount?.toLocaleString()} off</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={removeCoupon}
                                        className="w-8 h-8 flex items-center justify-center text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-8 sm:p-10">
                                    <h2 className="text-2xl font-black text-[#0F172A] mb-8">Order Summary</h2>

                                    {/* Cart Items */}
                                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items && items.length > 0 && items.map((item, idx) => (
                                            <div key={idx} className="flex items-center space-x-4 group">
                                                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 group-hover:shadow-md transition-shadow">
                                                    <img 
                                                        src={item.product?.image || 'https://placehold.co/150'} 
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-black text-[#0F172A] truncate mb-1">{item.product?.name}</h4>
                                                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest space-x-2">
                                                        {item.variant && <span>{item.variant.name}</span>}
                                                        {item.variant && <span className="w-1 h-1 bg-gray-300 rounded-full"></span>}
                                                        <span>Qty: {item.quantity}</span>
                                                    </div>
                                                    <p className="text-sm font-black text-[#F97316] mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-bold">Subtotal</span>
                                            <span className="text-[#0F172A] font-black">Rs. {subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-bold">Delivery</span>
                                            {selectedCity ? (
                                                <span className="text-[#0F172A] font-black">Rs. {shippingCost}</span>
                                            ) : (
                                                <span className="text-gray-300 italic font-medium">Select city</span>
                                            )}
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-green-600 font-bold">Discount</span>
                                                <span className="text-green-600 font-black">- Rs. {discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-bold">Tax</span>
                                            <span className="text-[#0F172A] font-black">Rs. 0</span>
                                        </div>
                                        
                                        <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xl font-black text-[#0F172A]">Total</span>
                                            <div className="text-right">
                                                <span className="text-3xl font-black text-[#F97316]">Rs. {grandTotal.toLocaleString()}</span>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading || !subtotal}
                                        className="w-full py-6 mt-10 bg-[#F97316] text-white rounded-3xl font-black text-lg hover:bg-[#ea580c] transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            `Place Order — Rs. ${grandTotal.toLocaleString()}`
                                        )}
                                    </button>

                                    {selectedCity && (
                                        <div className="mt-6 flex items-center justify-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <Truck className="w-4 h-4 text-orange-500" />
                                            <span>Estimated delivery: {selectedCity.estimated_days} business days</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: ShieldCheck, label: 'Secure Checkout' },
                                    { icon: RotateCcw, label: 'Easy Returns' },
                                    { icon: Headset, label: '24/7 Support' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center p-4 bg-white rounded-3xl border border-slate-100 text-center space-y-2">
                                        <item.icon className="w-5 h-5 text-gray-400" />
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
