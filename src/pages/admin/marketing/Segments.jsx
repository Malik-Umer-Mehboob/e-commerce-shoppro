import { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Filter, 
  Trash2, 
  Edit, 
  Search, 
  ChevronRight,
  Target,
  ShoppingBag,
  Clock,
  Settings,
  XCircle,
  Save,
  ArrowLeft,
  Mail,
  User as UserIcon,
  Briefcase,
  Calendar
} from 'lucide-react';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const [viewingUsers, setViewingUsers] = useState(null);
  const [segmentUsers, setSegmentUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [form, setForm] = useState({ name: '', rules: [] });
  const [saving, setSaving] = useState(false);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/segments');
      setSegments(response.data?.data ?? []);
    } catch {
      toast.error('Failed to load segments');
      setSegments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleViewUsers = async (segment) => {
    setViewingUsers(segment);
    setLoadingUsers(true);
    setSegmentUsers([]);
    try {
      const response = await api.get(`/admin/segments/${segment.id}/users`);
      setSegmentUsers(response.data?.data?.users ?? []);
    } catch {
      toast.error('Failed to load segment users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEdit = (segment) => {
    setEditingSegment(segment);
    setForm({
      name: segment.name,
      rules: segment.rule_set ?? [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Segment name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingSegment) {
        await api.put(`/admin/segments/${editingSegment.id}`, {
          name: form.name,
          rules: form.rules,
        });
        toast.success('Segment updated!');
      } else {
        await api.post('/admin/segments', {
          name: form.name,
          rules: form.rules,
        });
        toast.success('Segment created!');
      }
      setShowModal(false);
      setEditingSegment(null);
      setForm({ name: '', rules: [] });
      fetchSegments();
    } catch {
      toast.error('Failed to save segment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this segment?')) return;
    try {
      await api.delete(`/admin/segments/${id}`);
      toast.success('Segment deleted');
      fetchSegments();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const addRule = (type) => {
    const defaults = {
      role: { type: 'role', value: 'customer' },
      min_orders: { type: 'min_orders', operator: '>=', value: 1 },
      min_spent: { type: 'min_spent', operator: '>=', value: 1000 },
      registered_days: { type: 'registered_days', value: 30 },
      inactive_days: { type: 'inactive_days', value: 90 },
      newsletter: { type: 'newsletter', value: 'true' },
    };
    setForm(prev => ({
      ...prev,
      rules: [...prev.rules, defaults[type]],
    }));
  };

  const removeRule = (index) => {
    setForm(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const formatUserCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count;
  };

  const renderRuleBadge = (rule) => {
    const styles = "px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold flex items-center";
    switch (rule.type) {
      case 'role': return <span className={styles}><Briefcase className="w-3 h-3 mr-1"/> Role: {rule.value}</span>;
      case 'min_orders': return <span className={styles}><ShoppingBag className="w-3 h-3 mr-1"/> Min Orders: {rule.value}</span>;
      case 'min_spent': return <span className={styles}><Target className="w-3 h-3 mr-1"/> Min Spent: Rs. {rule.value}</span>;
      case 'registered_days': return <span className={styles}><Calendar className="w-3 h-3 mr-1"/> Joined last {rule.value} days</span>;
      case 'inactive_days': return <span className={styles}><Clock className="w-3 h-3 mr-1"/> Inactive {rule.value}+ days</span>;
      case 'newsletter': return <span className={styles}><Mail className="w-3 h-3 mr-1"/> Newsletter: {rule.value === 'true' || rule.value === true ? 'Yes' : 'No'}</span>;
      default: return null;
    }
  };

  if (viewingUsers) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setViewingUsers(null)}
              className="p-3 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-[#0F172A] hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#0F172A]">{viewingUsers.name}</h1>
              <p className="text-gray-500 font-medium">{segmentUsers.length} users match this segment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loadingUsers ? (
                  [1, 2, 3, 4, 5].map(n => (
                    <tr key={n}>
                      <td colSpan="4" className="px-8 py-4">
                        <div className="h-12 bg-gray-50 animate-pulse rounded-xl"></div>
                      </td>
                    </tr>
                  ))
                ) : segmentUsers.length > 0 ? (
                  segmentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#0F172A] font-black">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-[#0F172A]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-500 font-medium">{user.email}</td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-400 font-medium">{user.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                      No users match this segment's rules.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">User Segments</h1>
          <p className="text-gray-500 font-medium">Group users based on behavior and demographics</p>
        </div>
        <button 
          onClick={() => {
            setEditingSegment(null);
            setForm({ name: '', rules: [] });
            setShowModal(true);
          }}
          className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>New Segment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          [1, 2].map(n => <div key={n} className="h-64 bg-white animate-pulse rounded-[2rem] border border-gray-100"></div>)
        ) : segments.length > 0 ? (
          segments.map((segment) => (
            <div key={segment.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#0F172A]">{segment.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Last updated {new Date(segment.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(segment.id)}
                  className="p-2 text-gray-300 hover:text-red-500 rounded-xl transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
                {Array.isArray(segment.rule_set) && segment.rule_set.map((rule, i) => (
                  <div key={i}>{renderRuleBadge(rule)}</div>
                ))}
                {(!segment.rule_set || !Array.isArray(segment.rule_set) || segment.rule_set.length === 0) && (
                  <span className="text-xs text-gray-400 italic">No specific rules defined</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center text-[#0F172A]">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Real Users:</span>
                  <span className="font-black text-2xl">{formatUserCount(segment.user_count)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleViewUsers(segment)}
                    className="px-4 py-2 text-xs font-black text-[#F97316] border-2 border-[#F97316] rounded-xl hover:bg-[#F97316] hover:text-white transition-all"
                  >
                    View Users
                  </button>
                  <button 
                    onClick={() => handleEdit(segment)}
                    className="px-4 py-2 text-xs font-black text-gray-400 border-2 border-gray-100 rounded-xl hover:bg-gray-50 hover:text-[#0F172A] transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
            <UserIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No segments created</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Create rules to target specific groups of users with your campaigns.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
            <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black">{editingSegment ? 'Edit Segment' : 'Create Segment'}</h2>
                <p className="text-gray-400 text-sm font-medium">ALL rules must match for a user to be included</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Segment Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                  placeholder="e.g. VIP Customers"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em]">Segment Rules</h3>
                  <div className="relative group/dropdown">
                    <button className="px-4 py-2 bg-gray-100 text-[#0F172A] rounded-xl text-xs font-black flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add Rule</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10 hidden group-hover/dropdown:block animate-in fade-in slide-in-from-top-2 duration-200">
                      {[
                        { id: 'role', label: 'By Role', icon: Briefcase },
                        { id: 'min_orders', label: 'By Order Count', icon: ShoppingBag },
                        { id: 'min_spent', label: 'By Total Spent', icon: Target },
                        { id: 'registered_days', label: 'By Registration Date', icon: Calendar },
                        { id: 'inactive_days', label: 'By Inactivity', icon: Clock },
                        { id: 'newsletter', label: 'Newsletter Status', icon: Mail },
                      ].map(type => (
                        <button 
                          key={type.id}
                          onClick={() => addRule(type.id)}
                          className="w-full px-4 py-3 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0F172A] flex items-center space-x-3 transition-colors"
                        >
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {form.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl group/rule animate-in slide-in-from-left duration-300">
                      <div className="flex-1 flex items-center space-x-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase w-24">
                          {rule.type.replace('_', ' ')}
                        </span>
                        
                        {rule.type === 'role' && (
                          <select 
                            className="flex-1 bg-transparent border-none font-bold text-[#0F172A] focus:ring-0 p-0"
                            value={rule.value}
                            onChange={(e) => {
                              const newRules = [...form.rules];
                              newRules[index].value = e.target.value;
                              setForm({...form, rules: newRules});
                            }}
                          >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="support">Support</option>
                            <option value="rider">Rider</option>
                          </select>
                        )}

                        {(rule.type === 'min_orders' || rule.type === 'min_spent' || rule.type === 'registered_days' || rule.type === 'inactive_days') && (
                          <div className="flex-1 flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-400">
                              {rule.type === 'min_orders' ? 'Has at least' : 
                               rule.type === 'min_spent' ? 'Spent at least Rs.' :
                               rule.type === 'registered_days' ? 'Joined in last' : 'No orders in last'}
                            </span>
                            <input 
                              type="number"
                              className="w-20 bg-white border-none rounded-lg px-2 py-1 font-black text-[#0F172A] focus:ring-2 focus:ring-[#F97316]/20 outline-none"
                              value={rule.value}
                              onChange={(e) => {
                                const newRules = [...form.rules];
                                newRules[index].value = e.target.value;
                                setForm({...form, rules: newRules});
                              }}
                            />
                            <span className="text-xs font-bold text-gray-400">
                              {rule.type === 'min_orders' ? 'orders' : 
                               rule.type === 'min_spent' ? '' : 'days'}
                            </span>
                          </div>
                        )}

                        {rule.type === 'newsletter' && (
                          <select 
                            className="flex-1 bg-transparent border-none font-bold text-[#0F172A] focus:ring-0 p-0"
                            value={rule.value}
                            onChange={(e) => {
                              const newRules = [...form.rules];
                              newRules[index].value = e.target.value;
                              setForm({...form, rules: newRules});
                            }}
                          >
                            <option value="true">Subscribed (Yes)</option>
                            <option value="false">Unsubscribed (No)</option>
                          </select>
                        )}
                      </div>
                      <button 
                        onClick={() => removeRule(index)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.rules.length === 0 && (
                    <div className="py-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                      <Filter className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-400">No rules added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-4 shrink-0">
              <button 
                onClick={() => setShowModal(false)}
                className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#F97316] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
              >
                {saving ? 'Saving...' : (editingSegment ? 'Update Segment' : 'Create Segment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
