import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Mail, 
  Send, 
  Search, 
  Users, 
  Calendar, 
  Trash2, 
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart,
  FileText,
  Loader2
} from 'lucide-react';
import api from '../../../services/api';

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('newsletters');
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [sending, setSending] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduled_at: '',
    status: 'draft'
  });

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/newsletters');
      setNewsletters(response.data?.data?.newsletters ?? []);
      setSubscriberCount(response.data?.data?.subscriber_count ?? 0);
    } catch (error) {
      toast.error('Failed to load newsletters');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await api.get('/admin/newsletters/subscribers');
      setSubscribers(response.data?.data ?? []);
    } catch (error) {
      toast.error('Failed to load subscribers');
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/newsletters`, formData);
      toast.success('Newsletter created');
      setShowModal(false);
      setFormData({ subject: '', content: '', scheduled_at: '', status: 'draft' });
      fetchNewsletters();
    } catch (error) {
      toast.error('Failed to create newsletter');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;

    setDeleting(id);
    try {
      await api.delete(`/admin/newsletters/${id}`);
      toast.success('Newsletter deleted successfully');
      fetchNewsletters();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete newsletter');
    } finally {
      setDeleting(null);
    }
  };

  const handleSend = async (id) => {
    if (!window.confirm('Send this newsletter to all subscribers?')) return;

    setSending(id);
    try {
      const response = await api.post(`/admin/newsletters/${id}/send`);
      toast.success(response.data?.message ?? 'Newsletter sent!');
      fetchNewsletters();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to send');
    } finally {
      setSending(null);
    }
  };

  const handleViewReport = async (newsletter) => {
    setShowReport(true);
    setLoadingReport(true);
    setReportData(null);
    try {
      const response = await api.get(`/admin/newsletters/${newsletter.id}/report`);
      setReportData(response.data?.data);
    } catch (error) {
      toast.error('Failed to load report');
      setShowReport(false);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Newsletter Management</h1>
          <p className="text-gray-500 font-medium">Keep your subscribers updated and engaged</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>New Blast</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-8 border-b border-gray-100 pb-px">
        <button 
          onClick={() => setActiveTab('newsletters')}
          className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'newsletters' ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Newsletters
          {activeTab === 'newsletters' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F97316] rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')}
          className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'subscribers' ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Subscribers ({subscriberCount})
          {activeTab === 'subscribers' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#F97316] rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'newsletters' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-white animate-pulse rounded-[2.5rem] border border-gray-100"></div>)
          ) : newsletters.length > 0 ? (
            newsletters.map((nl) => (
              <div key={nl.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    nl.status === 'sent' ? 'bg-green-100 text-green-700' : 
                    nl.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {nl.status}
                  </div>
                  <div className="flex space-x-1">
                    {nl.status === 'draft' && (
                      <button 
                        onClick={() => handleSend(nl.id)} 
                        disabled={sending === nl.id}
                        className="p-2 text-gray-400 hover:text-[#F97316] rounded-xl hover:bg-[#F97316]/5 transition-all disabled:opacity-50"
                      >
                        {sending === nl.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(nl.id)}
                      disabled={deleting === nl.id}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {deleting === nl.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-[#0F172A] mb-4 group-hover:text-[#F97316] transition-colors">{nl.subject}</h3>
                <div className="flex items-center text-xs text-gray-400 font-bold mb-8">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(nl.scheduled_at || nl.created_at).toLocaleString()}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipients</span>
                      <span className="text-lg font-black text-[#0F172A]">{nl.sent_count}</span>
                    </div>
                    {nl.status === 'sent' && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Open Rate</span>
                        <span className="text-lg font-black text-green-600">{nl.open_rate}%</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleViewReport(nl)}
                    className="text-xs font-black text-[#F97316] flex items-center hover:underline bg-[#F97316]/5 px-3 py-1.5 rounded-lg"
                  >
                    View Report <BarChart className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <Mail className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No newsletters sent</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Start a conversation with your subscribers by sending your first newsletter blast.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search subscribers..." className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-[#F97316]/20 outline-none w-full font-medium" />
            </div>
          </div>
          <div className="overflow-x-auto">
            {subscribers.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subscribed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-[#0F172A]">{sub.name}</td>
                      <td className="px-8 py-4 text-sm text-gray-500">{sub.email}</td>
                      <td className="px-8 py-4 text-xs font-bold text-gray-400">{sub.subscribed_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No subscribers yet</h3>
                <p className="text-gray-500 text-sm">Users can subscribe via newsletter signup or account preferences.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Newsletter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#F97316] p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Compose Newsletter</h2>
                <p className="text-white/80 text-sm font-medium">Broadcast to all {subscriberCount} subscribers</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors text-white">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject Line</label>
                <input
                  required
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                  placeholder="e.g. Weekly Roundup: New Arrivals & More!"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Newsletter Content (HTML)</label>
                <textarea
                  required
                  rows="12"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-medium text-gray-600 resize-none"
                  placeholder="Write your newsletter content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
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
                  Save Blast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#0F172A]">Newsletter Report</h2>
              <button onClick={() => setShowReport(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
              {loadingReport ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-[#F97316] animate-spin mb-4" />
                  <p className="text-gray-500 font-bold">Generating report...</p>
                </div>
              ) : reportData ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#0F172A]">{reportData.subject}</h3>
                      <p className="text-gray-400 text-sm font-bold">Sent on {new Date(reportData.sent_at).toLocaleString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      reportData.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {reportData.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recipients</p>
                      <p className="text-2xl font-black text-[#0F172A]">{reportData.sent_count}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Opens</p>
                      <p className="text-2xl font-black text-blue-600">{reportData.open_count}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Open Rate</p>
                      <p className="text-2xl font-black text-green-600">{reportData.open_rate}%</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subscribers</p>
                      <p className="text-2xl font-black text-[#F97316]">{reportData.subscriber_count}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Content Preview</h4>
                    <div className="p-6 bg-gray-50 rounded-3xl max-h-48 overflow-y-auto border border-gray-100 text-sm text-gray-600 prose prose-sm max-w-none">
                      {reportData.content}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowReport(false)}
                    className="w-full bg-[#F97316] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
                  >
                    Close Report
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
