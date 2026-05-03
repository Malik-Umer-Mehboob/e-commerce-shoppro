import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, LayoutDashboard, Package, ShoppingCart, 
  Users, Tag, Settings, Save, X, Upload, Plus, 
  Trash2, Image as ImageIcon, Check, ChevronRight, AlertTriangle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { variantService } from '../../services/variantService';
import { discountService } from '../../services/discountService';

export default function AddProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    price: '',
    sale_price: '',
    category_id: '',
    stock_quantity: '',
    low_stock_threshold: '5',
    status: 'draft',
    is_featured: false,
    tags: ''
  });

  const [variants, setVariants] = useState([]);
  const [discountData, setDiscountData] = useState({
    name: '',
    apply: false,
    type: 'percentage',
    value: '',
    badge_text: '',
    starts_at: '',
    ends_at: ''
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
      fetchVariants();
    }
  }, [id]);

  const fetchVariants = async () => {
    try {
      const response = await variantService.getVariants(id);
      const formattedVariants = response.data.data.map(v => ({
        ...v,
        size: v.size || '',
        color: v.color || '',
        material: v.material || '',
        price: v.price || '',
        stock_quantity: v.stock_quantity ?? 0
      }));
      setVariants(formattedVariants);
    } catch (error) {
      
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      
      // The API now returns { success: true, data: { categories: [...], flat: [...] } }
      // Or it might be direct if categoryService already unwrapped it
      const data = response.data || response;
      
      const nested = data.categories || [];
      const flat = data.flat || [];
      
      // Prefer nested for grouped display, but keep flat as fallback
      setCategories(nested.length > 0 ? nested : flat);
    } catch (error) {
      
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      const p = response.data;
      setFormData({
        name: p.name,
        short_description: p.short_description || '',
        description: p.description || '',
        price: p.price,
        sale_price: p.sale_price || '',
        category_id: p.category_id,
        stock_quantity: p.stock_quantity,
        low_stock_threshold: p.low_stock_threshold,
        status: p.status,
        is_featured: p.is_featured,
        tags: p.tags?.map(t => t.name).join(', ') || ''
      });
      if (p.thumbnail) {
        setThumbnailPreview(`http://localhost:8000/storage/${p.thumbnail}`);
      }
      setExistingImages(p.images || []);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryImages.length + existingImages.length > 5) {
      toast.error('Max 5 images allowed');
      return;
    }
    setGalleryImages([...galleryImages, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    const newImages = [...galleryImages];
    const newPreviews = [...galleryPreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
  };

  const removeExistingImage = async (imageId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await productService.deleteImage(id, imageId);
        setExistingImages(existingImages.filter(img => img.id !== imageId));
        toast.success('Image removed');
      } catch (error) {
        toast.error('Failed to remove image');
      }
    }
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', material: '', price: '', stock_quantity: 0, is_active: true }]);
  };

  const updateVariantField = (idx, field, value) => {
    const newVariants = [...variants];
    newVariants[idx][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      is_featured: formData.is_featured === true || 
                   formData.is_featured === 'true' || 
                   formData.is_featured === 1 ? true : false,
      sale_price: formData.sale_price || null,
      low_stock_threshold: formData.low_stock_threshold || 5,
      thumbnail: thumbnail,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    try {
      let savedProduct;
      if (isEdit) {
        const submissionData = new FormData();
        Object.keys(dataToSubmit).forEach(key => {
          if (key === 'thumbnail' && dataToSubmit[key] instanceof File) {
            submissionData.append('thumbnail', dataToSubmit[key]);
          } else if (key === 'tags' && Array.isArray(dataToSubmit[key])) {
            dataToSubmit[key].forEach(tag => submissionData.append('tags[]', tag));
          } else if (key === 'is_featured') {
            submissionData.append('is_featured', dataToSubmit[key] ? '1' : '0');
          } else if (dataToSubmit[key] !== null && dataToSubmit[key] !== undefined) {
            submissionData.append(key, dataToSubmit[key]);
          }
        });
        const res = await productService.updateProduct(id, submissionData);
        savedProduct = res.data;
        toast.success('Product updated successfully');
      } else {
        const res = await productService.createProduct(dataToSubmit);
        savedProduct = res.data;
        toast.success('Product created successfully');
      }

      // Handle Variants
      if (variants.length > 0) {
        await variantService.createVariants(savedProduct.id, variants);
      }

      // Handle Discount
      if (discountData.apply && (user.role === 'admin')) {
        await discountService.createDiscount({
          ...discountData,
          name: discountData.name || `Sale on ${savedProduct.name}`,
          product_id: savedProduct.id
        });
      }

      // Upload gallery images if any
      if (galleryImages.length > 0) {
        await productService.uploadImages(savedProduct.id, galleryImages);
      }

      navigate(user.role === 'admin' ? '/admin/products' : '/seller/products');
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const navItems = user?.role === 'admin' ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Package, label: 'Products', path: '/admin/products', active: true },
    { icon: Tag, label: 'Discounts', path: '/admin/discounts', active: false },
    { icon: Upload, label: 'Bulk Upload', path: '/admin/bulk-upload', active: false },
    { icon: AlertTriangle, label: 'Low Stock', path: '/admin/low-stock', active: false },
    { icon: Tag, label: 'Categories', path: '/admin/categories', active: false },
    { icon: Settings, label: 'Settings', path: '/admin/settings', active: false },
  ] : [
    { icon: Package, label: 'My Products', path: '/seller/products', active: true },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders', active: false },
    { icon: Users, label: 'Analytics', path: '/seller/analytics', active: false },
    { icon: Settings, label: 'Settings', path: '/seller/settings', active: false },
  ];

  if (fetching) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar - Reusing for consistency */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">
          ShopPro {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </div>
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
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Products</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0F172A] font-semibold">{isEdit ? 'Edit Product' : 'Add New Product'}</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A] hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)}
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316]">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Left Column - Main Info */}
            <div className="flex-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (Max 200 chars)</label>
                    <textarea 
                      maxLength="200"
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="Brief overview of the product..."
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                    <textarea 
                      rows="6"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="Detailed product features, specs, etc..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Pricing & Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (Rs.)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Rs. - Optional)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="0.00"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="0"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="5"
                      value={formData.low_stock_threshold}
                      onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Product Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {/* Thumbnail Row */}
                  <div className="col-span-full border-b pb-4 mb-2">
                    <p className="text-sm font-medium text-gray-600 mb-3">Main Thumbnail</p>
                    <label className="relative group cursor-pointer w-32 h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#F97316] transition-all overflow-hidden bg-gray-50">
                      {thumbnailPreview ? (
                        <>
                          <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ImageIcon className="text-white w-6 h-6" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-500 font-medium">Upload</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailChange} />
                    </label>
                  </div>

                  {/* Existing Gallery */}
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group w-full aspect-square border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                      <img src={`http://localhost:8000/storage/${img.image_path}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* New Previews */}
                  {galleryPreviews.map((preview, idx) => (
                    <div key={idx} className="relative group w-full aspect-square border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                      <img src={preview} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add Gallery Trigger */}
                  {galleryImages.length + existingImages.length < 5 && (
                    <label className="cursor-pointer w-full aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#F97316] transition-all bg-gray-50">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
                    </label>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-4">Max 5 gallery images are allowed. Ideal size 1200x1200px.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0F172A]">Variants Manager</h2>
                  <button 
                    type="button" 
                    onClick={addVariant}
                    className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Variant
                  </button>
                </div>
                <div className="space-y-4">
                  {variants.map((v, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                      <button 
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Size</label>
                            <select 
                              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-white outline-none focus:ring-1 focus:ring-[#F97316]"
                              value={v.size || ''}
                              onChange={(e) => updateVariantField(idx, 'size', e.target.value)}
                            >
                            <option value="">N/A</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                            <option value="One Size">One Size</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Color</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="color"
                              className="w-8 h-8 rounded border-none cursor-pointer"
                              value={/^#[0-9A-Fa-f]{6}$/.test(v.color || '') ? v.color : '#000000'}
                              onChange={(e) => updateVariantField(idx, 'color', e.target.value)}
                            />
                            <input 
                              type="text"
                              className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded outline-none"
                              placeholder="#000000"
                              value={v.color || ''}
                              onChange={(e) => updateVariantField(idx, 'color', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Material</label>
                          <input 
                            type="text"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none"
                            placeholder="Cotton"
                            value={v.material || ''}
                            onChange={(e) => updateVariantField(idx, 'material', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Price (Override)</label>
                          <input 
                            type="number"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none"
                            placeholder="Optional"
                            value={v.price || ''}
                            onChange={(e) => updateVariantField(idx, 'price', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Stock</label>
                          <input 
                            type="number"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none"
                            placeholder="0"
                            value={v.stock_quantity ?? ''}
                            onChange={(e) => updateVariantField(idx, 'stock_quantity', e.target.value)}
                          />
                        </div>
                      </div>
                      {v.sku && (
                        <div className="mt-2 text-[10px] font-mono text-gray-400">
                          SKU: <span className="bg-gray-200 px-1 rounded">{v.sku}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {variants.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4 italic">No variants added. Click "Add Variant" to start.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Options */}
            <div className="w-full lg:w-80 space-y-6">
              {/* Discount Section - Admin Only */}
              {user.role === 'admin' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">Apply Discount</h2>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={discountData.apply}
                        onChange={(e) => setDiscountData({ ...discountData, apply: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                    </label>
                  </div>
                  
                  {discountData.apply && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Name</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                          placeholder="e.g. Special Offer"
                          value={discountData.name}
                          onChange={(e) => setDiscountData({ ...discountData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex gap-2">
                          {['percentage', 'fixed'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setDiscountData({ ...discountData, type })}
                              className={`flex-1 py-1.5 text-xs font-bold rounded border capitalize transition-all ${discountData.type === type ? 'bg-[#F97316] text-white border-[#F97316]' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Value ({discountData.type === 'percentage' ? '%' : 'Rs.'})</label>
                        <input 
                          type="number"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                          placeholder="0"
                          value={discountData.value}
                          onChange={(e) => setDiscountData({ ...discountData, value: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                          placeholder="e.g. 20% OFF"
                          value={discountData.badge_text}
                          onChange={(e) => setDiscountData({ ...discountData, badge_text: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Starts At</label>
                          <input 
                            type="date"
                            className="w-full px-2 py-2 border border-gray-200 rounded lg text-xs outline-none"
                            value={discountData.starts_at}
                            onChange={(e) => setDiscountData({ ...discountData, starts_at: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Ends At</label>
                          <input 
                            type="date"
                            className="w-full px-2 py-2 border border-gray-200 rounded lg text-xs outline-none"
                            value={discountData.ends_at}
                            onChange={(e) => setDiscountData({ ...discountData, ends_at: e.target.value })}
                          />
                        </div>
                      </div>
                      {discountData.value && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-[10px] font-bold text-orange-600 uppercase">Preview Price</p>
                          <p className="text-xl font-black text-[#0F172A]">
                            Rs. {discountData.type === 'percentage' 
                              ? (formData.price - (formData.price * discountData.value / 100)).toFixed(2)
                              : (formData.price - discountData.value).toFixed(2)
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Organization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                      <button 
                        type="button"
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.status === 'draft' ? 'bg-white shadow text-[#F97316]' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                      >
                        Draft
                      </button>
                      <button 
                        type="button"
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${formData.status === 'published' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setFormData({ ...formData, status: 'published' })}
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none bg-white"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      style={{ color: formData.category_id ? '#0F172A' : '#94A3B8' }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        cat.children && cat.children.length > 0 ? (
                          <optgroup key={cat.id} label={cat.name}>
                            <option value={cat.id}>{cat.name} (General)</option>
                            {cat.children.map((child) => (
                              <option key={child.id} value={child.id}>
                                {child.name}
                              </option>
                            ))}
                          </optgroup>
                        ) : (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="e.g. apple, iphone, tech"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="is_featured"
                      className="w-4 h-4 text-[#F97316] rounded"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured Product</label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-[#F97316] text-white rounded-xl font-bold hover:bg-[#EA580C] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Saving...' : <><Save className="w-5 h-5" /> {isEdit ? 'Update Product' : 'Save Product'}</>}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate(user.role === 'admin' ? '/admin/products' : '/seller/products')}
                  className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
