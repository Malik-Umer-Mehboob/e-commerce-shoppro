import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Truck, 
  MapPin, 
  Calendar,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminShippingZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
    region: '',
    delivery_charge: 0,
    estimated_days: 3,
    is_active: true
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/shipping/zones');
      setZones(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch shipping zones');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (zone) => {
    setCurrentZone(zone);
    setFormData({
      city: zone.city,
      region: zone.region || '',
      delivery_charge: zone.delivery_charge,
      estimated_days: zone.estimated_days,
      is_active: zone.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this zone?')) return;
    try {
      await api.delete(`/admin/shipping/zones/${id}`);
      toast.success('Zone deleted');
      fetchZones();
    } catch (error) {
      toast.error('Failed to delete zone');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentZone) {
        await api.put(`/admin/shipping/zones/${currentZone.id}`, formData);
        toast.success('Zone updated');
      } else {
        await api.post('/admin/shipping/zones', formData);
        toast.success('Zone created');
      }
      setIsModalOpen(false);
      setCurrentZone(null);
      setFormData({ city: '', region: '', delivery_charge: 0, estimated_days: 3, is_active: true });
      fetchZones();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save zone');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shipping Zones</h1>
          <p className="text-slate-500 text-sm">Manage delivery charges and estimated days for different cities.</p>
        </div>
        <button 
          onClick={() => { setCurrentZone(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
        >
          <Plus size={18} /> Add New Zone
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Charge</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Days</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : zones.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No zones defined.</td></tr>
            ) : (
              zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{zone.city}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{zone.region || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-indigo-600">Rs. {zone.delivery_charge}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Calendar size={14} className="text-slate-400" />
                      {zone.estimated_days} Days
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${zone.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {zone.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(zone)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(zone.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="text-indigo-600" size={24} />
                {currentZone ? 'Edit Shipping Zone' : 'Add New Shipping Zone'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">City Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Multan"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Region / Province</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Punjab"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Charge (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-indigo-600"
                    placeholder="0.00"
                    value={formData.delivery_charge}
                    onChange={(e) => setFormData({...formData, delivery_charge: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Est. Delivery Days</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="3"
                    value={formData.estimated_days}
                    onChange={(e) => setFormData({...formData, estimated_days: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="is_active"
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">Zone is active and visible to customers</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShippingZones;
