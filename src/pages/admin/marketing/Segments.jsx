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
  Save
} from 'lucide-react';
import api from '../../../services/api';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rule_set: {
      spent_min: '',
      last_purchase_days: '',
      newsletter_only: false,
      role: 'customer'
    }
  });

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await api.get(`/admin/user-segments`);
      setSegments(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load segments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/user-segments`, formData);
      toast.success('Segment created successfully');
      setShowModal(false);
      fetchSegments();
    } catch (error) {
      toast.error('Failed to create segment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will not delete users, only the segment definition.')) return;
    try {
      await api.delete(`/admin/user-segments/${id}`);
      toast.success('Segment deleted');
      fetchSegments();
    } catch (error) {
      toast.error('Failed to delete segment');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">User Segments</h1>
          <p className="text-gray-500 font-medium">Group users based on behavior and demographics</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>New Segment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-64 bg-white animate-pulse rounded-[2rem] border border-gray-100"></div>)
        ) : segments.length > 0 ? (
          segments.map((segment) => (
            <div key={segment.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#F97316]/5 rounded-full blur-2xl group-hover:bg-[#F97316]/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6 relative">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-2xl flex items-center justify-center text-[#F97316]">
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-300 hover:text-[#0F172A] rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(segment.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-xl font-black text-[#0F172A] mb-2">{segment.name}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Last updated {new Date(segment.updated_at).toLocaleDateString()}</p>

              <div className="space-y-3 mb-8">
                {segment.rule_set.spent_min && (
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <ShoppingBag className="w-3.5 h-3.5 mr-2 text-[#F97316]" />
                    Spent over ${segment.rule_set.spent_min}
                  </div>
                )}
                {segment.rule_set.last_purchase_days && (
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <Clock className="w-3.5 h-3.5 mr-2 text-[#F97316]" />
                    Active in last {segment.rule_set.last_purchase_days} days
                  </div>
                )}
                {segment.rule_set.newsletter_only && (
                  <div className="flex items-center text-xs font-bold text-gray-500">
                    <Filter className="w-3.5 h-3.5 mr-2 text-[#F97316]" />
                    Newsletter Subscribers
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center text-[#0F172A]">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-black text-lg">1.2k</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Users</span>
                </div>
                <button className="text-xs font-black text-[#F97316] flex items-center hover:underline">
                  View Users <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
            <Target className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No segments created</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Create rules to target specific groups of users with your campaigns.</p>
          </div>
        )}
      </div>

      {/* New Segment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Define Segment</h2>
                <p className="text-gray-400 text-sm font-medium">Build your audience rules</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Segment Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                  placeholder="e.g. VIP High Spenders"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-6 bg-gray-50 p-8 rounded-3xl">
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em] mb-4">Rule Criteria</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Minimum Total Spent ($)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#F97316]/20 outline-none font-bold"
                      value={formData.rule_set.spent_min}
                      onChange={(e) => setFormData({...formData, rule_set: {...formData.rule_set, spent_min: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Last Purchase Within (Days)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#F97316]/20 outline-none font-bold"
                      value={formData.rule_set.last_purchase_days}
                      onChange={(e) => setFormData({...formData, rule_set: {...formData.rule_set, last_purchase_days: e.target.value}})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter_only"
                    className="w-5 h-5 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
                    checked={formData.rule_set.newsletter_only}
                    onChange={(e) => setFormData({...formData, rule_set: {...formData.rule_set, newsletter_only: e.target.checked}})}
                  />
                  <label htmlFor="newsletter_only" className="text-sm font-bold text-gray-700">Only include newsletter subscribers</label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Segment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
