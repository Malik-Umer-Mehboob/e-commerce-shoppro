import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSales, fetchAdminInventory } from '../../store/slices/reportSlice';
import reportService from '../../services/reportService';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const { salesData, inventoryData, loading } = useSelector((state) => state.reports);
  const [days, setDays] = useState(30);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminSales(days));
    dispatch(fetchAdminInventory());
  }, [dispatch, days]);

  const handleExport = async (type) => {
    setIsExporting(true);
    try {
      await reportService.exportReport(type, days);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export ${type} report`);
    } finally {
      setIsExporting(false);
    }
  };

  const paymentData = {
    labels: salesData?.sales_by_payment_method ? Object.keys(salesData.sales_by_payment_method) : [],
    datasets: [
      {
        data: salesData?.sales_by_payment_method ? Object.values(salesData.sales_by_payment_method) : [],
        backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const topSellingData = {
    labels: salesData?.top_selling_products?.map(p => p.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: salesData?.top_selling_products?.map(p => p.total_quantity) || [],
        backgroundColor: '#4F46E5',
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Reports Dashboard</h1>
        <div className="flex space-x-4">
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last 1 Year</option>
          </select>
          <button 
            onClick={() => handleExport('sales')}
            disabled={isExporting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Exporting...
              </>
            ) : 'Export Sales'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-900">${salesData?.total_sales_amount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{salesData?.number_of_orders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">Avg Order Value</h3>
          <p className="text-3xl font-bold text-gray-900">${salesData?.average_order_value?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <Bar data={topSellingData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Payment Method</h3>
          <div className="w-64 mx-auto">
            <Pie data={paymentData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Inventory Status</h2>
          <button 
            onClick={() => handleExport('inventory')}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Export Inventory
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{inventoryData?.total_products || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-medium">Low Stock</h3>
            <p className="text-2xl font-bold text-orange-600">{inventoryData?.low_stock_products_count || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-medium">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-600">{inventoryData?.out_of_stock_products_count || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
