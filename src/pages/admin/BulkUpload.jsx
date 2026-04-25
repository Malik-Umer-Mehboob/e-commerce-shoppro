import { useState } from 'react';
import { 
  Upload, FileText, Download, CheckCircle, AlertCircle 
} from 'lucide-react';
import { bulkUploadService } from '../../services/bulkUploadService';
import { toast } from 'react-hot-toast';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Bulk Product Import</h1>
        <p className="text-gray-500 font-medium">Upload multiple products and variants using a CSV file.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-[#0F172A]">Import File</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Select your spreadsheet</p>
          </div>
          <button 
            onClick={() => bulkUploadService.downloadTemplate()}
            className="flex items-center space-x-2 text-[#F97316] font-black text-xs uppercase tracking-widest hover:underline bg-orange-50 px-4 py-2 rounded-xl transition-all"
          >
            <Download className="w-4 h-4" /> 
            <span>Download Template</span>
          </button>
        </div>

        <div 
          className={`border-4 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center transition-all ${file ? 'border-green-500 bg-green-50/30' : 'border-gray-100 hover:border-[#F97316] bg-gray-50/50'}`}
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
            <div className="text-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 text-green-500">
                <FileText className="w-10 h-10" />
              </div>
              <p className="font-black text-lg text-[#0F172A] mb-1">{file.name}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">{(file.size / 1024).toFixed(2)} KB</p>
              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center space-x-2"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : <Upload className="w-5 h-5" />}
                  <span>{uploading ? 'Processing...' : 'Start Import'}</span>
                </button>
                <button 
                  onClick={() => setFile(null)}
                  className="bg-white border border-gray-200 text-gray-400 px-8 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 text-[#F97316]">
                <Upload className="w-10 h-10" />
              </div>
              <p className="font-black text-lg text-[#0F172A] mb-1">Select CSV file to upload</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">or drag and drop here</p>
              <label className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black cursor-pointer hover:bg-black transition-all shadow-xl shadow-[#0F172A]/20 inline-block">
                Browse Files
                <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>

        {results && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-[0.2em] mb-6">Import Results</h3>
            
            <div className="bg-green-50 border border-green-100 p-6 rounded-3xl flex items-center space-x-6 mb-6">
              <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="font-black text-green-900">{results.message}</p>
                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mt-1">Operation completed successfully</p>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 p-8 rounded-3xl">
                <div className="flex items-center space-x-2 text-red-600 mb-6">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-black uppercase tracking-widest text-xs">Errors Found ({results.errors.length})</p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                  {results.errors.map((err, i) => (
                    <div key={i} className="text-xs font-bold text-red-500 bg-white/50 p-4 rounded-2xl border border-red-50/50">
                      {err}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem]">
        <h4 className="text-sm font-black text-blue-900 uppercase tracking-[0.2em] mb-4">Important Notes:</h4>
        <ul className="space-y-3">
          {[
            'Use the provided CSV template to ensure correct column mapping.',
            'Required fields: name, price.',
            'Image uploading via CSV is not supported (placeholders will be used).',
            'Variants (size, color, material) will be created automatically.'
          ].map((note, i) => (
            <li key={i} className="flex items-start space-x-3 text-sm font-bold text-blue-700/70">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
