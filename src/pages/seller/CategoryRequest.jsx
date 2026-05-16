import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Tag, Clock, CheckCircle2, XCircle,
  AlertCircle, Layers, Send, History, Info,
  Menu, LogOut, LayoutDashboard, Package,
  ShoppingCart, BarChart2, Settings, Globe, ChevronRight,
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';

const INITIAL_FORM = {
  request_type: 'main',
  name: '',
  subcategory_name: '',
  parent_id: '',
  category_id: '',
  description: '',
  reason: '',
};

export default function CategoryRequest() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const fetchMyRequests = useCallback(async () => {
    try {
      const res = await api.get('/seller/category-requests');
      setMyRequests(res.data?.data ?? []);
    } catch {
      toast.error('Failed to refresh requests');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, reqRes] = await Promise.all([
          api.get('/categories'),
          api.get('/seller/category-requests'),
        ]);
        setCategories(catRes.data?.data?.categories ?? []);
        setMyRequests(reqRes.data?.data ?? []);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchMyRequests]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard', end: true },
    { icon: Package, label: 'My Products', path: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
    { icon: Tag, label: 'Request Category', path: '/seller/category-request' },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  const handleSubmit = async () => {
    // 1. Validate based on request type
    if (form.request_type !== 'access' && !form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (form.request_type === 'both' && !form.subcategory_name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    if (form.request_type === 'sub' && !form.parent_id) {
      toast.error('Please select a parent category');
      return;
    }

    if (form.request_type === 'access' && !form.category_id) {
      toast.error('Please select a category to join');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (form.request_type === 'access') {
          payload.name = categories.find(c => String(c.id) === String(form.category_id))?.name || 'Access Request';
      }
      await api.post('/seller/category-requests', payload);
      toast.success('Request sent to admin!');
      setForm(INITIAL_FORM);
      fetchMyRequests();
    } catch {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- helpers ---- */
  const setType = (type) => {
    setForm((prev) => ({
      ...prev,
      request_type: type,
      subcategory_name: type !== 'both' ? '' : prev.subcategory_name,
      parent_id: type !== 'sub' ? '' : prev.parent_id,
      category_id: type !== 'access' ? '' : prev.category_id,
    }));
  };

  const parentName = categories.find((c) => String(c.id) === String(form.parent_id))?.name;

  /* ---- display label for request history ---- */
  const requestLabel = (req) => {
    if (req.type === 'both' && req.subcategory_name) {
      return `${req.name} → ${req.subcategory_name}`;
    }
    return req.name;
  };

  /* ---- card style helper ---- */
  const typeCard = (value) => ({
    flex: 1,
    padding: '16px 12px',
    border: form.request_type === value ? '2px solid #F97316' : '2px solid #E2E8F0',
    borderRadius: '14px',
    cursor: 'pointer',
    backgroundColor: form.request_type === value ? '#FFF7ED' : '#fff',
    textAlign: 'center',
    transition: 'all .2s',
    userSelect: 'none',
  });

  return (
    <>
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0F172A]">Request New Category</h1>
        <p className="text-gray-500 font-medium">
          Submit a request to admin — Main only, Subcategory only, or both together
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Form ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
            {/* Title */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A]">New Request</h3>
            </div>

            {/* ── Step 1: Request Type ── */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                Request Type
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Main Only */}
                <label style={typeCard('main')} onClick={() => setType('main')}>
                  <input
                    type="radio"
                    value="main"
                    checked={form.request_type === 'main'}
                    onChange={() => setType('main')}
                    style={{ display: 'none' }}
                    readOnly
                  />
                  <div style={{ fontSize: '22px' }}>📁</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px', color: '#0F172A' }}>
                    Main Only
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    e.g. Electronics
                  </div>
                </label>

                {/* Main + Sub */}
                <label style={typeCard('both')} onClick={() => setType('both')}>
                  <input
                    type="radio"
                    value="both"
                    checked={form.request_type === 'both'}
                    onChange={() => setType('both')}
                    style={{ display: 'none' }}
                    readOnly
                  />
                  <div style={{ fontSize: '22px' }}>📁📂</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px', color: '#0F172A' }}>
                    Main + Sub
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Both at once
                  </div>
                </label>

                {/* Sub Only */}
                <label style={typeCard('sub')} onClick={() => setType('sub')}>
                  <input
                    type="radio"
                    value="sub"
                    checked={form.request_type === 'sub'}
                    onChange={() => setType('sub')}
                    style={{ display: 'none' }}
                    readOnly
                  />
                  <div style={{ fontSize: '22px' }}>📂</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px', color: '#0F172A' }}>
                    Sub Only
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Under existing
                  </div>
                </label>

                {/* Join Existing */}
                <label style={typeCard('access')} onClick={() => setType('access')}>
                  <input
                    type="radio"
                    value="access"
                    checked={form.request_type === 'access'}
                    onChange={() => setType('access')}
                    style={{ display: 'none' }}
                    readOnly
                  />
                  <div style={{ fontSize: '22px' }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginTop: '4px', color: '#0F172A' }}>
                    Join
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Existing
                  </div>
                </label>
              </div>
            </div>

            {/* ── Step 2: Fields ── */}

            {/* Main Category Name (always visible except for 'access') */}
            {form.request_type !== 'access' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  {form.request_type === 'sub' ? 'Subcategory Name' : 'Main Category Name'} *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={form.request_type === 'sub' ? 'e.g. Smart Watches' : 'e.g. Gaming'}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
            )}

            {/* Category ID (only when type === 'access') */}
            {form.request_type === 'access' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Select Category *
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category_id: e.target.value }))
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  <option value="">Select Category to join...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subcategory Name — only when type === 'both' */}
            {form.request_type === 'both' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Subcategory Name *
                </label>
                <input
                  value={form.subcategory_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subcategory_name: e.target.value }))
                  }
                  placeholder="e.g. Gaming Headsets"
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  Will be created inside the main category
                </p>
              </div>
            )}

            {/* Parent Category — only when type === 'sub' */}
            {form.request_type === 'sub' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Parent Category *
                </label>
                <select
                  value={form.parent_id}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, parent_id: e.target.value }))
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  <option value="">Select Parent Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Preview box */}
            {(form.name || form.subcategory_name || form.category_id) && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Preview
                </p>
                {form.request_type === 'access' ? (
                   <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                    <span className="text-slate-400">Apply to join:</span>
                    <strong className="text-[#F97316]">
                      {categories.find(c => String(c.id) === String(form.category_id))?.name || 'Select a category'}
                    </strong>
                  </div>
                ) : form.request_type === 'sub' ? (
                  <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                    <span className="text-slate-400">{parentName ?? 'Parent Category'}</span>
                    {form.name && (
                      <>
                        <span className="text-slate-400">→</span>
                        <strong className="text-[#0F172A]">{form.name}</strong>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap text-sm font-bold">
                    {form.name && <strong className="text-[#0F172A]">{form.name}</strong>}
                    {form.subcategory_name && (
                      <>
                        <span className="text-slate-400">→</span>
                        <strong className="text-[#F97316]">{form.subcategory_name}</strong>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Why is this needed?
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Explain why this category is needed..."
                rows={3}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-2xl flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider leading-relaxed">
                Requests are usually reviewed within 24–48 hours. You'll be notified once approved.
              </p>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#F97316] text-white py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Submit Request'}
            </button>
          </div>
        </div>

        {/* ── Request History ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-2xl text-[#0F172A]">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A]">Request History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Category
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Type
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                          Loading requests...
                        </p>
                      </td>
                    </tr>
                  ) : myRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                          No requests yet
                        </p>
                      </td>
                    </tr>
                  ) : (
                    myRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        {/* Name / preview */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-xl">
                              <Layers className="w-4 h-4 text-[#0F172A]" />
                            </div>
                            <div>
                              <p className="font-black text-[#0F172A]">
                                {requestLabel(req)}
                              </p>
                              {req.rejection_reason && (
                                <p className="text-[10px] text-red-500 font-bold mt-0.5">
                                  Reason: {req.rejection_reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type badge */}
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              req.type === 'both'
                                ? 'bg-purple-100 text-purple-700'
                                : req.type === 'sub'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {req.type === 'both'
                              ? '📁📂 Main+Sub'
                              : req.type === 'sub'
                              ? '📂 Sub'
                              : '📁 Main'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          {req.status === 'pending' ? (
                            <div className="flex items-center space-x-2 text-orange-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                Pending
                              </span>
                            </div>
                          ) : req.status === 'approved' ? (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                Approved
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-red-600">
                              <XCircle className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                Rejected
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-gray-500">
                            {new Date(req.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
