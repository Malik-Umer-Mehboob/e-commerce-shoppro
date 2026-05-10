import { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, ChevronDown, ChevronRight, 
  Folder, FolderOpen, Tag, CheckCircle2, XCircle,
  MoreVertical, Clock, Check, X, AlertCircle, 
  Layers, Package, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    parent_id: null,
    is_active: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [subForms, setSubForms] = useState([
    { name: '', description: '' }
  ]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data?.data?.categories ?? []);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/category-requests');
      setRequests(response.data?.data ?? []);
    } catch {
      toast.error('Failed to load requests');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRequests();
  }, []);

  const toggleExpand = (id) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddCategory = (parentCat = null) => {
    setEditingCategory(null);
    setParentId(parentCat?.id ?? null);
    setForm({
      name: '',
      description: '',
      parent_id: parentCat?.id ?? null,
      is_active: true,
      order: 0,
    });
    setSubForms([{ name: '', description: '' }]);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setParentId(category.parent_id);
    setForm({
      name: category.name || '',
      description: category.description ?? '',
      parent_id: category.parent_id,
      is_active: category.is_active,
      order: category.order ?? 0,
    });
    setShowModal(true);
  };

  const addSubField = () => {
    if (subForms.length >= 10) return; // max 10
    setSubForms(prev => [
      ...prev,
      { name: '', description: '' }
    ]);
  };

  const removeSubField = (index) => {
    if (subForms.length === 1) return; // keep at least 1
    setSubForms(prev => prev.filter((_, i) => i !== index));
  };

  const updateSubField = (index, field, value) => {
    setSubForms(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/admin/categories', form);
        toast.success(form.parent_id ? 'Subcategory created!' : 'Category created!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMultipleSubs = async () => {
    // Filter out empty ones
    const validSubs = subForms.filter(s => s.name.trim());

    if (validSubs.length === 0) {
      toast.error('Please enter at least one name');
      return;
    }

    setSaving(true);
    try {
      // Save all at once using Promise.all
      await Promise.all(
        validSubs.map(sub =>
          api.post('/admin/categories', {
            name: sub.name.trim(),
            description: sub.description?.trim()
              || null,
            parent_id: parentId,
            is_active: true,
            order: 0,
          })
        )
      );

      toast.success(
        validSubs.length === 1
          ? 'Subcategory created!'
          : `${validSubs.length} subcategories created!`
      );
      setShowModal(false);
      setSubForms([{ name: '', description: '' }]);
      fetchCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.message
          ?? 'Failed to save'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This will also check for products and subcategories.')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted!');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/categories/${id}/toggle`);
      setCategories(prev => prev.map(cat => {
        if (cat.id === id) return { ...cat, is_active: !cat.is_active };
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map(child => child.id === id ? { ...child, is_active: !child.is_active } : child)
          };
        }
        return cat;
      }));
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/category-requests/${id}/approve`);
      toast.success('Category request approved!');
      fetchRequests();
      fetchCategories();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Rejection reason (optional):');
    if (reason === null) return;
    try {
      await api.post(`/admin/category-requests/${id}/reject`, { reason });
      toast.success('Request rejected');
      fetchRequests();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const parentCategory = categories.find(c => c.id === parentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Category Management</h1>
          <p className="text-gray-500 font-medium">Manage product categories and subcategories</p>
        </div>
        <button 
          onClick={() => handleAddCategory()}
          className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
            activeTab === 'categories' 
              ? 'bg-white text-[#0F172A] shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center space-x-2 ${
            activeTab === 'requests' 
              ? 'bg-white text-[#0F172A] shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Seller Requests</span>
          {pendingRequests > 0 && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
              {pendingRequests}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'categories' ? (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2">No categories yet</h3>
              <p className="text-gray-500 mb-8">Start by adding your first main category.</p>
              <button 
                onClick={() => handleAddCategory()}
                className="bg-[#0F172A] text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all"
              >
                Add First Category
              </button>
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className="bg-white rounded-[2rem] border-l-4 border-l-[#0F172A] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-slate-50 rounded-2xl text-[#0F172A]">
                        {expandedCategories[category.id] ? <FolderOpen className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 
                            className="text-lg font-black text-[#0F172A] cursor-pointer hover:text-orange-600 transition-colors"
                            onClick={() => toggleExpand(category.id)}
                          >
                            {category.name}
                          </h3>
                          {category.is_active ? (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 rounded-full">Active</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 rounded-full">Inactive</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{category.description || 'No description provided'}</p>
                        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Package className="w-3 h-3" />
                            <span>{category.products_count || 0} Products</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Layers className="w-3 h-3" />
                            <span>{category.children?.length || 0} Subcategories</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span>Order: {category.order}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleAddCategory(category)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                        title="Add Subcategory"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleToggle(category.id)}
                        className={`p-2 rounded-xl transition-all ${category.is_active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        title={category.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {category.is_active ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.children?.length > 0 && (
                    <div className="mt-6 border-t border-gray-50 pt-4">
                      <button 
                        onClick={() => toggleExpand(category.id)}
                        className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 hover:text-[#0F172A] transition-colors"
                      >
                        {expandedCategories[category.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span>{expandedCategories[category.id] ? 'Hide' : 'Show'} Subcategories</span>
                      </button>

                      {expandedCategories[category.id] && (
                        <div className="space-y-3 pl-8 border-l-2 border-gray-100 ml-6">
                          {category.children.map(child => (
                            <div key={child.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-[#0F172A]">{child.name}</span>
                                    {child.is_active ? (
                                      <span className="text-[8px] font-black uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Active</span>
                                    ) : (
                                      <span className="text-[8px] font-black uppercase bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Inactive</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-medium">Products: {child.products_count || 0}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleEdit(child)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleToggle(child.id)}
                                  className={`p-1.5 rounded-lg transition-all ${child.is_active ? 'text-gray-400 hover:text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                                >
                                  {child.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                </button>
                                <button 
                                  onClick={() => handleDelete(child.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Seller Requests Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.length === 0 ? (
            <div className="col-span-full bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
              <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No category requests found</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl ${
                  req.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                  req.status === 'approved' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {req.status}
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#0F172A] font-black">
                    {req.requester_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-[#0F172A]">{req.requester_name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{req.requester_email}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Requested Category</label>
                    <p className="font-black text-[#0F172A] text-lg">{req.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Tag className="w-3 h-3 text-[#F97316]" />
                      <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest">{req.type}</span>
                    </div>
                  </div>
                  
                  {req.description && (
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reason/Description</label>
                      <p className="text-sm text-gray-600 leading-relaxed">{req.description}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {req.rejection_reason && (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                      <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Rejection Reason</label>
                      <p className="text-sm text-red-600 font-medium">{req.rejection_reason}</p>
                    </div>
                  )}
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="flex-1 bg-white border-2 border-red-100 text-red-600 py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 hover:bg-red-50 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-y-auto max-h-[90vh]">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    {editingCategory ? 'Edit Category' : parentId ? 'Add Subcategory' : 'Add Category'}
                  </h3>
                  {parentId && !editingCategory && (
                    <p className="text-xs text-orange-500 font-bold mt-1 uppercase tracking-widest">
                      Adding to: {parentCategory?.name}
                    </p>
                  )}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {parentId && !editingCategory ? (
                /* Multiple Subcategory Form */
                <div>
                  <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>
                    You can add multiple subcategories at once
                  </p>

                  {/* Subcategory fields */}
                  {subForms.map((sub, index) => (
                    <div key={index} style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid #E2E8F0',
                      position: 'relative',
                    }}>
                      {/* Field number */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#F97316',
                          backgroundColor: '#FFF7ED',
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}>
                          Subcategory {index + 1}
                        </span>

                        {/* Remove button - only if more than 1 */}
                        {subForms.length > 1 && (
                          <button
                            onClick={() => removeSubField(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                              fontSize: '18px',
                              padding: '0',
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Name field */}
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          display: 'block',
                          marginBottom: '4px',
                        }}>
                          Name *
                        </label>
                        <input
                          type="text"
                          value={sub.name || ''}
                          onChange={(e) => updateSubField(
                            index, 'name', e.target.value
                          )}
                          placeholder="e.g. Mobile Phones"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: 'white',
                          }}
                          autoFocus={index === 0}
                        />
                      </div>

                      {/* Description field (optional) */}
                      <div>
                        <label style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          display: 'block',
                          marginBottom: '4px',
                        }}>
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={sub.description || ''}
                          onChange={(e) => updateSubField(
                            index, 'description', e.target.value
                          )}
                          placeholder="Brief description..."
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            backgroundColor: 'white',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Another button */}
                  {subForms.length < 10 && (
                    <button
                      onClick={addSubField}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px dashed #E2E8F0',
                        borderRadius: '10px',
                        backgroundColor: 'transparent',
                        color: '#64748B',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginBottom: '16px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#F97316';
                        e.currentTarget.style.color = '#F97316';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#64748B';
                      }}
                    >
                      + Add Another Subcategory
                    </button>
                  )}

                  {/* Summary */}
                  {subForms.length > 1 && (
                    <p style={{
                      fontSize: '12px',
                      color: '#94A3B8',
                      textAlign: 'center',
                      marginBottom: '16px',
                    }}>
                      {subForms.filter(s => s.name.trim()).length}
                      {' of '}
                      {subForms.length} subcategories ready to save
                    </p>
                  )}

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveMultipleSubs}
                      disabled={saving}
                      style={{
                        flex: 2,
                        padding: '10px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#F97316',
                        color: 'white',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving
                        ? 'Saving...'
                        : subForms.length === 1
                          ? 'Save Subcategory'
                          : `Save All ${subForms.length} Subcategories`}
                    </button>
                  </div>
                </div>
              ) : (
                /* Original Single Category Form (Main or Edit) */
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Name</label>
                    <input
                      required
                      value={form.name || ''}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Electronics, Fashion..."
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    />
                  </div>

                  {!parentId && !editingCategory && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Parent Category</label>
                      <select
                        value={form.parent_id || ''}
                        onChange={e => setForm(f => ({ ...f, parent_id: e.target.value || null }))}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                      >
                        <option value="">None (Main Category)</option>
                        {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                    <textarea
                      value={form.description || ''}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Briefly describe this category..."
                      rows="3"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Order</label>
                      <input
                        type="number"
                        value={form.order ?? 0}
                        onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                      />
                      <p className="text-[10px] text-gray-400 font-bold mt-1.5 ml-1 uppercase tracking-widest">Lower = Shown First</p>
                    </div>
                    <div className="flex flex-col justify-center pt-6">
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={form.is_active}
                          onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                        />
                        <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-sm"></div>
                        <span className="ml-3 text-sm font-black text-gray-500 uppercase tracking-widest group-hover:text-[#0F172A] transition-colors">Active Status</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-black text-gray-400 hover:bg-slate-50 hover:text-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-4 rounded-2xl bg-[#0F172A] text-white font-black hover:bg-black transition-all shadow-xl shadow-[#0F172A]/20 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Save Category'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
