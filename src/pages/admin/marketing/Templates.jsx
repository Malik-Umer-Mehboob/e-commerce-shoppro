import { useState, useEffect } from 'react';
import { 
  Plus, 
  FileCode, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle,
  Eye,
  Settings,
  MoreVertical,
  Code
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/email-templates`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setTemplates(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load templates');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/email-templates`, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Template saved successfully');
      setShowModal(false);
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Email Templates</h1>
          <p className="text-gray-500 font-medium">Reusable designs for system and marketing emails</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-64 bg-white animate-pulse rounded-[2.5rem] border border-gray-100"></div>)
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <div key={template.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center`}>
                  <FileCode className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-300 hover:text-[#0F172A] rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-xl font-black text-[#0F172A] mb-2">{template.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Subject: {template.subject}</p>

              <div className="bg-gray-50 p-4 rounded-2xl mb-8 group-hover:bg-gray-100 transition-colors">
                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Code className="w-3 h-3 mr-1.5" />
                  Code Preview
                </div>
                <p className="text-[10px] text-gray-400 font-mono mt-2 line-clamp-2">{template.content}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${template.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{template.is_active ? 'Active' : 'Disabled'}</span>
                </div>
                <button className="text-xs font-black text-purple-600 flex items-center hover:underline">
                  Preview <Eye className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <FileCode className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Create beautiful HTML templates to reuse in your campaigns and transactional emails.</p>
          </div>
        )}
      </div>

      {/* New Template Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-purple-600 p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Save Template</h2>
                <p className="text-white/80 text-sm font-medium">Build once, use everywhere</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors text-white">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Template Key (Unique)</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="e.g. order_confirmation"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Default Subject</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="Subject for this template"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Template Content (HTML)</label>
                <textarea
                  required
                  rows="12"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-medium text-gray-600 resize-none font-mono text-sm"
                  placeholder="Paste your HTML here..."
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
                  className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all transform hover:-translate-y-1"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
