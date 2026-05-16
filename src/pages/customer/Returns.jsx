import { useState, useEffect } from 'react';
import { RefreshCcw, Package, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Header from '../../components/layout/Header';
import ReturnRequestModal from '../../components/ReturnRequestModal';

export default function CustomerReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/returns');
      if (response.data?.success) {
        setReturns(response.data.data);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-black uppercase tracking-widest rounded-full">Pending Review</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase tracking-widest rounded-full">Rejected</span>;
      case 'refunded':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full">Refunded</span>;
      case 'picked_up':
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-full">Picked Up</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">My Returns & Refunds</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your return requests and track their status</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-[#F97316] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#ea580c] transition-all shadow-lg shadow-[#F97316]/20"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Request a Return</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
          </div>
        ) : returns.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-[#0F172A] mb-2">No return requests yet</h2>
            <p className="text-gray-500 font-medium">You can request a return within 30 days of delivery</p>
          </div>
        ) : (
          <div className="space-y-6">
            {returns.map(req => (
              <div key={req.id} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-[#0F172A] text-white text-xs font-black rounded-lg">
                      Order {req.order_number}
                    </span>
                    <span className="text-sm font-bold text-gray-400">
                      Submitted on {req.created_at}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#0F172A] mb-1">Reason: {req.reason}</h3>
                    {req.description && (
                      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                        "{req.description}"
                      </p>
                    )}
                  </div>

                  {req.admin_notes && (
                    <div className="flex items-start space-x-2 text-sm bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <span className="font-bold block">Message from Support:</span>
                        {req.admin_notes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end space-y-4 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 md:text-right">Status</p>
                    {getStatusBadge(req.status)}
                  </div>

                  {(req.status === 'approved' || req.status === 'refunded') && req.refund_amount > 0 && (
                    <div className="md:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Refund Amount</p>
                      <p className="text-2xl font-black text-[#F97316]">{formatPrice(req.refund_amount)}</p>
                      {req.refund_type && (
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                          via {req.refund_type.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ReturnRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchReturns} 
      />
    </div>
  );
}
