import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  FileCode, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle,
  Eye,
  Settings,
  Code,
  Info,
  Save,
  X
} from 'lucide-react';
import api from '../../../services/api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [form, setForm] = useState({
    name: '',
    subject: '',
    content: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/email-templates');
      setTemplates(response.data?.data ?? []);
    } catch {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      subject: template.subject,
      content: template.content,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template? This cannot be undone.')) return;

    setDeleting(id);
    try {
      await api.delete(`/admin/email-templates/${id}`);
      toast.success('Template deleted!');
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleToggle = async (id) => {
    try {
        const response = await api.patch(`/admin/email-templates/${id}/toggle`);
        toast.success(response.data.message);
        fetchTemplates();
    } catch (err) {
        toast.error('Failed to toggle status');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.subject || !form.content) {
      toast.error('All fields are required');
      return;
    }

    setSaving(true);
    try {
      if (editingTemplate) {
        await api.put(`/admin/email-templates/${editingTemplate.id}`, form);
        toast.success('Template updated!');
      } else {
        await api.post('/admin/email-templates', form);
        toast.success('Template saved!');
      }
      setShowForm(false);
      setEditingTemplate(null);
      setForm({ name: '', subject: '', content: '' });
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Email Templates</h1>
          <p className="text-gray-500 font-medium">Reusable designs for system and marketing emails</p>
        </div>
        <button 
          onClick={() => {
            setEditingTemplate(null);
            setForm({ name: '', subject: '', content: '' });
            setShowForm(true);
          }}
          className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-orange-600/20 hover:bg-orange-600 transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Template</span>
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-start space-x-4 shadow-sm">
        <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-orange-900 font-black mb-1">✅ Templates are now connected to the system!</h4>
          <p className="text-orange-800 text-sm font-medium">
            <span className="font-bold underline">welcome_email</span> → sent on new user registration<br />
            <span className="font-bold underline">order_confirmation</span> → sent on order placement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-80 bg-white animate-pulse rounded-[2.5rem] border border-gray-100"></div>)
        ) : templates.length > 0 ? (
          templates.map((template) => (
            <div key={template.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <FileCode className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${template.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-md">🔑 {template.name}</span>
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mb-4 line-clamp-1">{template.subject}</h3>
                
                <div className="bg-gray-50 p-4 rounded-2xl mb-6 group-hover:bg-gray-100 transition-colors">
                  <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <Code className="w-3 h-3 mr-1.5" />
                    Preview
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono line-clamp-3 leading-relaxed">
                    {template.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <button 
                  onClick={() => handlePreview(template)}
                  className="flex items-center space-x-1.5 text-gray-500 hover:text-[#0F172A] transition-colors font-bold text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleEdit(template)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-blue-100"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    disabled={deleting === template.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100 disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === template.id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <FileCode className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Create beautiful HTML templates for system and marketing emails.</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{editingTemplate ? 'Edit Template' : 'Add New Template'}</h2>
                <p className="text-white/60 text-sm font-medium">HTML Email Builder</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto max-h-[calc(95vh-160px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Template Key</label>
                  <input
                    readOnly={!!editingTemplate}
                    type="text"
                    className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-bold text-[#0F172A] ${editingTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="e.g. order_confirmation"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {!editingTemplate && <p className="text-[10px] text-gray-400 font-medium ml-1">Use lowercase with underscores: <span className="font-bold">order_confirmation</span></p>}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Default Subject</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-bold text-[#0F172A]"
                    placeholder="Subject line"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">HTML Content</label>
                <textarea
                  rows="15"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-medium text-gray-600 resize-none font-mono text-sm"
                  placeholder="<div>Hello {{name}}...</div>"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                ></textarea>
                <div className="bg-blue-50 p-6 rounded-[1.5rem] border border-blue-100">
                  <h5 className="text-blue-900 text-xs font-black uppercase tracking-widest mb-3">Available Variables:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    <span className="text-xs text-blue-800"><span className="font-bold font-mono">{"{{customer_name}}"}</span> — Customer's full name</span>
                    <span className="text-xs text-blue-800"><span className="font-bold font-mono">{"{{order_number}}"}</span> — Order number</span>
                    <span className="text-xs text-blue-800"><span className="font-bold font-mono">{"{{total}}"}</span> — Order total amount</span>
                    <span className="text-xs text-blue-800"><span className="font-bold font-mono">{"{{name}}"}</span> — User's name</span>
                    <span className="text-xs text-blue-800"><span className="font-bold font-mono">{"{{email}}"}</span> — User's email</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button 
                  onClick={() => setShowForm(false)}
                  className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-gray-600/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingTemplate ? 'Update Template' : 'Save Template'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#0F172A]">Email Preview</h2>
                <div className="flex items-center space-x-2 mt-1">
                   <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">🔑 {previewTemplate.name}</span>
                   <span className="text-[10px] font-black text-gray-400">Subject: {previewTemplate.subject}</span>
                </div>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                <X className="w-8 h-8 text-gray-400" />
              </button>
            </div>

            <div className="p-8 bg-gray-100 overflow-y-auto max-h-[60vh]">
              <div 
                className="bg-white p-10 shadow-lg rounded-2xl mx-auto max-w-2xl min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
              />
            </div>

            <div className="p-8">
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="w-full py-4 bg-[#F97316] text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 hover:bg-orange-600 transition-all transform hover:-translate-y-1"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
