import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import SalesChart from '../../components/admin/SalesChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_orders: 0,
    orders_growth: 0,
    total_revenue: 0,
    revenue_growth: 0,
    new_users: 0,
    users_growth: 0,
    total_products: 0,
    products_growth: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
        const statsData = response.data?.data?.stats;
        
        if (statsData) {
            setStats({
                total_orders: statsData.total_orders ?? 0,
                orders_growth: statsData.orders_growth ?? 0,
                total_revenue: statsData.total_revenue ?? 0,
                revenue_growth: statsData.revenue_growth ?? 0,
                total_users: statsData.total_users ?? 0,
                new_users: statsData.new_users ?? 0,
                users_growth: statsData.users_growth ?? 0,
                total_products: statsData.total_products ?? 0,
                products_growth: statsData.products_growth ?? 0,
            });
        }
        
        setRecentOrders(response.data?.data?.recent_orders ?? []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Orders', 
      value: loading ? '...' : (stats.total_orders ?? 0).toLocaleString(), 
      change: loading ? '' : `${stats.orders_growth >= 0 ? '+' : ''}${stats.orders_growth}%`, 
      color: 'blue' 
    },
    { 
      label: 'Revenue', 
      value: loading ? '...' : `Rs. ${Number(stats.total_revenue ?? 0).toLocaleString()}`, 
      change: loading ? '' : `${stats.revenue_growth >= 0 ? '+' : ''}${stats.revenue_growth}%`, 
      color: 'green' 
    },
    { 
      label: 'Total Users', 
      value: loading ? '...' : (stats.total_users ?? 0).toLocaleString(), 
      change: loading ? '' : `${stats.users_growth >= 0 ? '+' : ''}${stats.users_growth}%`, 
      color: 'purple' 
    },
    { 
      label: 'Products', 
      value: loading ? '...' : (stats.total_products ?? 0).toLocaleString(), 
      change: loading ? '' : `${stats.products_growth >= 0 ? '+' : ''}${stats.products_growth}%`, 
      color: 'orange' 
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Welcome Admin 👋</h1>
        <p className="text-gray-500 font-medium">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading Skeletons
          Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-[180px] animate-pulse">
              <div className="h-2 w-20 bg-gray-100 rounded mb-4"></div>
              <div className="h-8 w-32 bg-gray-100 rounded mb-6"></div>
              <div className="h-2 w-24 bg-gray-100 rounded"></div>
            </div>
          ))
        ) : (
          statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all group overflow-hidden relative">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-[#F97316]/5 transition-colors`}></div>
              <div>
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                <div className="text-3xl font-black text-[#0F172A] mt-2">{stat.value}</div>
              </div>
              <div className="flex items-center mt-6">
                <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-400 text-[10px] ml-2 font-bold uppercase tracking-tighter">vs last month</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
          <SalesChart />
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-[#0F172A] mb-6">Recent Orders</h3>
          
          {loading ? (
            <div className="space-y-6">
              {Array(5).fill(0).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                      {order.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{order.order_number}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border mb-1 inline-block ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold">{order.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-400 font-bold italic text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
