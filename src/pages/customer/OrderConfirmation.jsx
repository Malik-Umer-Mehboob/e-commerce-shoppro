import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { 
    CheckCircle2, Package, Truck, 
    Building2, Clipboard, ChevronRight,
    ShoppingBag, Search, Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function OrderConfirmation() {
    const location = useLocation();
    const orderData = location.state;

    if (!orderData) {
        return <Navigate to="/" />;
    }

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20 pt-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Animation Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-[2rem] text-green-600 mb-6 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-[#0F172A] mb-2 tracking-tight">Order Placed Successfully!</h1>
                    <p className="text-lg text-gray-500 font-medium italic">Thank you for shopping with ShopPro</p>
                    <div className="mt-6 inline-flex items-center px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">Order Number:</span>
                        <span className="text-lg font-black text-[#0F172A]">{orderData.order_number}</span>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Payment Status Info */}
                    {orderData.payment_method === 'cod' ? (
                        <div className="bg-green-50 rounded-[2.5rem] border border-green-100 p-8 flex items-start space-x-6">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                                <Package className="w-7 h-7 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-green-800 mb-2">Payment on Delivery</h3>
                                <p className="text-green-700 font-medium leading-relaxed">
                                    Please have <span className="font-black text-green-900 text-lg">Rs. {orderData.grand_total.toLocaleString()}</span> ready when our rider arrives. Your order is now being processed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 sm:p-10">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0F172A]">Bank Transfer Details</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                    {[
                                        { label: 'Bank Name', value: orderData.bank_details.bank_name },
                                        { label: 'Account Title', value: orderData.bank_details.account_title },
                                        { label: 'Account Number', value: orderData.bank_details.account_number },
                                        { label: 'IBAN', value: orderData.bank_details.iban },
                                        { label: 'Amount to Pay', value: orderData.bank_details.amount, highlight: true },
                                        { label: 'Reference Code', value: orderData.bank_details.reference, highlight: true }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative group">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                            <p className={`font-black break-all pr-8 ${item.highlight ? 'text-[#F97316] text-lg' : 'text-[#0F172A]'}`}>{item.value}</p>
                                            <button 
                                                onClick={() => copyToClipboard(item.value, item.label)}
                                                className="absolute top-6 right-6 text-gray-300 hover:text-[#F97316] transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-orange-50 rounded-3xl border border-orange-100 p-8 flex items-start space-x-5">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Clipboard className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-orange-800 mb-1">Important Notice</h4>
                                        <p className="text-sm text-orange-700 font-medium leading-relaxed">
                                            Please transfer the exact amount and use your order number as the reference. Your order will be processed after payment verification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Timeline Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-10">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center shrink-0">
                                <Truck className="w-8 h-8 text-[#0F172A]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#0F172A] mb-1">Estimated Delivery</h3>
                                <p className="text-gray-500 font-medium">Your package will arrive in <span className="text-[#F97316] font-black">{orderData.estimated_delivery}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Link 
                            to="/user/orders"
                            className="w-full sm:flex-1 bg-[#F97316] text-white py-5 rounded-3xl font-black text-center shadow-xl shadow-orange-500/20 hover:bg-[#ea580c] transition-all flex items-center justify-center space-x-2"
                        >
                            <Search className="w-5 h-5" />
                            <span>Track My Order</span>
                        </Link>
                        <Link 
                            to="/"
                            className="w-full sm:flex-1 bg-white text-[#0F172A] border-2 border-slate-100 py-5 rounded-3xl font-black text-center hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
