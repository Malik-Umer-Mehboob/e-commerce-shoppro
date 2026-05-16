import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import adminService from '../../services/adminService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RANGES = [
  { label: '7D',  days: 7  },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function SalesChart() {
  const [chartData, setChartData]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [activeDays, setActiveDays] = useState(30);
  const abortRef = useRef(null);

  const fetchChart = useCallback(async (days) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);
    try {
      const res = await adminService.getSalesChartData(days);
      const { labels, revenue, order_count } = res.data?.data ?? {};
      if (!labels?.length) {
        setChartData(null);
      } else {
        setChartData({ labels, revenue, order_count });
      }
    } catch (err) {
      if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChart(activeDays);
    return () => abortRef.current?.abort();
  }, [activeDays, fetchChart]);

  // ── Build Chart.js dataset ──────────────────────────────────────────────
  const buildConfig = (data) => {
    const hasRevenue = data.revenue.some((v) => v > 0);
    const hasOrders  = data.order_count.some((v) => v > 0);

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Revenue (Rs.)',
          data: data.revenue,
          yAxisID: 'yRevenue',
          borderColor: '#F97316',
          backgroundColor: 'rgba(249,115,22,0.10)',
          borderWidth: 2.5,
          pointRadius: data.labels.length <= 14 ? 4 : 2,
          pointBackgroundColor: '#F97316',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          tension: 0.4,
          fill: true,
          hidden: !hasRevenue,
        },
        {
          label: 'Orders',
          data: data.order_count,
          yAxisID: 'yOrders',
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.06)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: data.labels.length <= 14 ? 4 : 2,
          pointBackgroundColor: '#6366F1',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          tension: 0.4,
          fill: false,
          hidden: !hasOrders,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          useBorderRadius: true,
          font: { family: 'Inter, sans-serif', size: 11, weight: '600' },
          color: '#6B7280',
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont:   { family: 'Inter, sans-serif', size: 12, weight: '700' },
        bodyFont:    { family: 'Inter, sans-serif', size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.yAxisID === 'yRevenue') {
              return `  Revenue: Rs. ${Number(ctx.parsed.y).toLocaleString()}`;
            }
            return `  Orders: ${ctx.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 10, weight: '600' },
          color: '#9CA3AF',
          maxTicksLimit: activeDays === 90 ? 12 : activeDays === 30 ? 10 : 7,
          maxRotation: 0,
        },
        border: { display: false },
      },
      yRevenue: {
        type: 'linear',
        position: 'left',
        grid: { color: '#F3F4F6', drawTicks: false },
        border: { display: false, dash: [3, 3] },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 10 },
          color: '#F97316',
          padding: 8,
          callback: (v) => v >= 1000 ? `Rs.${(v / 1000).toFixed(1)}k` : `Rs.${v}`,
        },
      },
      yOrders: {
        type: 'linear',
        position: 'right',
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: 'Inter, sans-serif', size: 10 },
          color: '#6366F1',
          padding: 8,
          stepSize: 1,
          callback: (v) => Number.isInteger(v) ? v : '',
        },
      },
    },
  };

  // ── Render helpers ──────────────────────────────────────────────────────
  const RangeToggle = () => (
    <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
      {RANGES.map(({ label, days }) => (
        <button
          key={days}
          onClick={() => setActiveDays(days)}
          className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all ${
            activeDays === days
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const Skeleton = () => (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-4 w-28 bg-gray-100 rounded mb-2" />
          <div className="h-2.5 w-40 bg-gray-100 rounded" />
        </div>
        <div className="h-8 w-28 bg-gray-100 rounded-xl" />
      </div>
      <div className="flex-1 bg-gray-50 rounded-2xl" />
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>
      <p className="text-sm font-bold text-gray-400">No order data yet</p>
      <p className="text-xs text-gray-300 mt-1">Orders will appear here once placed</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <p className="text-sm font-bold text-gray-400 mb-3">Couldn't load chart data</p>
      <button
        onClick={() => fetchChart(activeDays)}
        className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors underline underline-offset-2"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-[#0F172A]">Sales Overview</h3>
          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
            Daily revenue &amp; order trends
          </p>
        </div>
        {!loading && <RangeToggle />}
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0">
        {loading   && <Skeleton />}
        {!loading && error     && <ErrorState />}
        {!loading && !error && !chartData && <EmptyState />}
        {!loading && !error && chartData && (
          <Line data={buildConfig(chartData)} options={options} />
        )}
      </div>
    </div>
  );
}
