import { useState, useEffect } from 'react';
import { 
  Plus, 
  Mail, 
  TrendingUp, 
  Users, 
  Calendar, 
  Search, 
  MoreVertical, 
  Eye, 
  Send, 
  BarChart2, 
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [segments, setSegments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    ab_test_subject: '',
    content: '',
    segment_id: '',
    scheduled_at: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchCampaigns();
    fetchSegments();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/email-campaigns`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setCampaigns(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/user-segments`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSegments(response.data.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/email-campaigns`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Campaign created successfully');
      setShowModal(false);
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleSend = async (id) => {
    if (!window.confirm('Are you sure you want to send this campaign now?')) return;
    try {
      await axios.post(`${API_URL}/admin/email-campaigns/${id}/send`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Campaign is being sent!');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to send campaign');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'sending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Email Campaigns</h1>
          <p className="text-gray-500 font-medium">Create and manage your marketing broadcasts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sent', value: '45.2k', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg. Open Rate', value: '24.8%', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg. Click Rate', value: '3.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Revenue', value: '$12.4k', icon: BarChart2, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#0F172A]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search campaigns..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#F97316]/20 outline-none w-64 font-medium" />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-[#0F172A] transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Segment</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stats</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map(n => <tr key={n} className="animate-pulse"><td colSpan="6" className="px-8 py-8 h-20"></td></tr>)
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-[#0F172A]/5 rounded-xl flex items-center justify-center text-[#0F172A] group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A]">{campaign.name}</p>
                          <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{campaign.subject}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {campaign.segment?.name || 'All Users'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="flex flex-col">
                          <span className="text-[#0F172A] text-xs">24%</span>
                          <span>Opens</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#0F172A] text-xs">3.1%</span>
                          <span>Clicks</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-xs text-gray-400 font-bold">
                        {campaign.status === 'scheduled' ? <Clock className="w-3 h-3 mr-1.5" /> : <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                        {new Date(campaign.scheduled_at || campaign.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {campaign.status === 'draft' && (
                          <button 
                            onClick={() => handleSend(campaign.id)}
                            className="p-2 text-gray-400 hover:text-[#F97316] hover:bg-[#F97316]/10 rounded-xl transition-all"
                            title="Send Now"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    No campaigns found. Start by creating your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Create Campaign</h2>
                <p className="text-gray-400 text-sm font-medium">Design your next big blast</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Internal Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="e.g. Summer Sale 2024"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">User Segment</label>
                  <select
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    value={formData.segment_id}
                    onChange={(e) => setFormData({...formData, segment_id: e.target.value})}
                  >
                    <option value="">Select a segment...</option>
                    {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="Don't miss out on our summer sale!"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">A/B Test Subject (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="Vary the subject line to test engagement"
                    value={formData.ab_test_subject}
                    onChange={(e) => setFormData({...formData, ab_test_subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HTML Content</label>
                <textarea
                  required
                  rows="10"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-medium text-gray-600 resize-none"
                  placeholder="Paste your HTML template here or write content..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Use {"{{ first_name }}"} for personalization</p>
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
                  className="bg-[#F97316] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
