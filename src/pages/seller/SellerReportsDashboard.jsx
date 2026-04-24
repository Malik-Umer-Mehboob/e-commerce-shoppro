import React, { useEffect, useState } from 'react';
import reportService from '../../services/reportService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerReportsDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await reportService.getSellerSales(days);
        setSalesData(response.data);
      } catch (error) {
        console.error("Failed to fetch seller reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [days]);

  const topSellingData = {
    labels: salesData?.top_selling_products?.map(p => p.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: salesData?.top_selling_products?.map(p => p.total_quantity) || [],
        backgroundColor: '#10B981',
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reports...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Sales Reports</h1>
        <select 
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${salesData?.total_sales_amount?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{salesData?.number_of_orders || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
        <div className="h-64">
          <Bar data={topSellingData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default SellerReportsDashboard;
