import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X, Search, CheckCircle } from 'lucide-react';

const MediaLibrary = ({ onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedImage, setSelectedImage] = useState(null);

  // Mock library data - in production this would come from an API
  const libraryImages = [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42',
    'https://images.unsplash.com/photo-1432821596592-e2c18b78144f',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-black text-slate-900">Media Library</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'library' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Browse Library
              </button>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Upload Files
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' ? (
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search media..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {libraryImages.map((url, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(url)}
                    className={`aspect-square rounded-2xl overflow-hidden cursor-pointer relative group border-4 transition-all ${selectedImage === url ? 'border-orange-500' : 'border-transparent'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Media item" />
                    {selectedImage === url && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1 shadow-lg">
                        <CheckCircle size={16} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-black uppercase">Select</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-orange-500 transition-all cursor-pointer bg-slate-50">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-6">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drop files to upload</h3>
              <p className="text-sm text-slate-500 mb-8">Maximum file size 10MB. Supports JPG, PNG, GIF.</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
                Select Files
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-bold text-slate-400">
            {selectedImage ? '1 item selected' : 'No items selected'}
          </div>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all">
              Cancel
            </button>
            <button 
              disabled={!selectedImage}
              onClick={() => onSelect(selectedImage)}
              className="px-8 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              Insert Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
