import { useState } from 'react';
import { 
  Upload, FileText, Download, CheckCircle, AlertCircle, X 
} from 'lucide-react';
import { bulkUploadService } from '../../../services/bulkUploadService';
import { toast } from 'react-hot-toast';

export default function BulkUploadModal({ isOpen, onClose, onRefresh }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;
  
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
      toast.success('Bulk upload processed');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">Bulk Product Import</h2>
            <p className="text-gray-400 font-bold text-sm">Upload multiple products via CSV</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {!results ? (
            <div className="space-y-8">
              <div 
                className={`border-4 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center transition-all ${file ? 'border-green-500 bg-green-50/30' : 'border-gray-100 hover:border-[#F97316] bg-gray-50/50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile && droppedFile.name.endsWith('.csv')) {
                    setFile(droppedFile);
                  }
                }}
              >
                {file ? (
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="font-black text-[#0F172A]">{file.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-[#F97316] mx-auto mb-4" />
                    <p className="font-black text-[#0F172A]">Drop CSV file here</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">or click to browse</p>
                    <input type="file" className="hidden" id="csv-upload" accept=".csv" onChange={handleFileChange} />
                    <label htmlFor="csv-upload" className="mt-4 inline-block px-6 py-2 bg-[#0F172A] text-white rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-black transition-all">
                      Browse
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => bulkUploadService.downloadTemplate()}
                  className="flex items-center space-x-2 text-[#F97316] font-black text-xs uppercase tracking-widest hover:underline bg-orange-50 px-4 py-3 rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" /> 
                  <span>Template</span>
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex-1 bg-[#F97316] text-white py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-[#ea6a0f] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                  <span>{uploading ? 'Importing...' : 'Start Import'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-green-900">{results.message}</p>
                  <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mt-0.5">Success</p>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl">
                  <div className="flex items-center space-x-2 text-red-600 mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Row Errors ({results.errors.length})</p>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {results.errors.map((err, i) => (
                      <div key={i} className="text-xs font-bold text-red-500 bg-white/60 p-3 rounded-xl border border-red-50">
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => setResults(null)}
                className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all"
              >
                Upload Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
