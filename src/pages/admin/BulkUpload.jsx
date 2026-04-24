import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, LayoutDashboard, Package, ShoppingCart, 
  Users, Tag, Settings, Upload, FileText, Download, 
  CheckCircle, AlertCircle, Trash2, X
} from 'lucide-react';
import { authService } from '../../services/authService';
import { bulkUploadService } from '../../services/bulkUploadService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function BulkUpload() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      const res = await bulkUploadService.uploadCSV(file);
      setResults(res.data);
      toast.success('Process completed');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Package, label: 'Products', path: '/admin/products', active: false },
    { icon: Upload, label: 'Bulk Upload', path: '/admin/bulk-upload', active: true },
    { icon: Tag, label: 'Categories', path: '/admin/categories', active: false },
    { icon: Settings, label: 'Settings', path: '/admin/settings', active: false },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">ShopPro Admin</div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button key={idx} onClick={() => navigate(item.path)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#0F172A] hidden md:block">Bulk Product Import</h1>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A]">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316]">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">Bulk Upload</h2>
                <p className="text-gray-500 text-sm mt-1">Upload multiple products and variants using a CSV file.</p>
              </div>
              <button 
                onClick={() => bulkUploadService.downloadTemplate()}
                className="flex items-center gap-2 text-[#F97316] font-bold text-sm hover:underline"
              >
                <Download className="w-4 h-4" /> Download Template
              </button>
            </div>

            <div 
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${file ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-[#F97316] bg-gray-50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile && droppedFile.name.endsWith('.csv')) {
                  setFile(droppedFile);
                  setResults(null);
                }
              }}
            >
              {file ? (
                <>
                  <FileText className="w-16 h-16 text-green-500 mb-4" />
                  <p className="font-bold text-[#0F172A] mb-1">{file.name}</p>
                  <p className="text-xs text-gray-500 mb-6">{(file.size / 1024).toFixed(2)} KB</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-[#F97316] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#EA580C] shadow-lg transition-all flex items-center gap-2"
                    >
                      {uploading ? 'Processing...' : <><Upload className="w-5 h-5" /> Start Import</>}
                    </button>
                    <button 
                      onClick={() => setFile(null)}
                      className="bg-white border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-orange-100 text-[#F97316] rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-[#0F172A] mb-1">Select CSV file to upload</p>
                  <p className="text-sm text-gray-500 mb-6">or drag and drop here</p>
                  <label className="bg-[#0F172A] text-white px-8 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-all shadow-md">
                    Browse Files
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
                  </label>
                </>
              )}
            </div>

            {results && (
              <div className="mt-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-[#0F172A]">Import Results</h3>
                  <div className="flex-1 h-[1px] bg-gray-100"></div>
                </div>
                
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4 mb-4">
                  <div className="p-2 bg-green-500 text-white rounded-lg"><CheckCircle className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-green-800">{results.message}</p>
                  </div>
                </div>

                {results.errors && results.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-bold">Errors Found ({results.errors.length})</p>
                    </div>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {results.errors.map((err, i) => (
                        <li key={i} className="text-sm text-red-500 bg-white p-2 rounded border border-red-50">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <h4 className="font-bold text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-2 list-disc pl-5">
              <li>Use the provided CSV template to ensure correct column mapping.</li>
              <li>Required fields: <strong>name, price</strong>.</li>
              <li>Image uploading via CSV is not supported (placeholders will be used).</li>
              <li>Variants (size, color, material) will be created automatically if data is provided.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
