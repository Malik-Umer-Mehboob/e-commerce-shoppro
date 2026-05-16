import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Loader2, User, Store, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import api from '../../services/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'seller', 'support', 'rider']),
  store_name: z.string().optional(),
  store_description: z.string().optional(),
  business_type: z.string().optional(),
  categories: z.array(z.string()).default([]),
  categoryRequest: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'customer' && !data.email.endsWith('@gmail.com')) return false;
  if (data.role === 'seller' && !data.email.endsWith('@yahoo.com')) return false;
  if (data.role === 'support' && !data.email.endsWith('@support.shoppro.com')) return false;
  if (data.role === 'rider' && !data.email.endsWith('@rider.shoppro.com')) return false;
  return true;
}, {
  message: "Invalid email domain for selected role",
  path: ["email"],
}).refine((data) => {
  if (data.role === 'seller') {
    // Check if at least one category is selected (excluding 'other')
    const validCount = (data.categories || []).filter(id => id !== 'other').length;
    return !!data.store_name && !!data.store_description && !!data.business_type && validCount > 0;
  }
  return true;
}, {
  message: "Please select at least one selling category",
  path: ["categories"],
}).refine((data) => {
  if (data.role === 'seller' && (data.categories || []).includes('other')) {
    return !!data.categoryRequest;
  }
  return true;
}, {
  message: "Please specify the category you'd like to request",
  path: ["categoryRequest"],
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const fetched = response.data?.data?.categories || [];
        const finalCategories = fetched.filter(c => 
          c.name.toLowerCase() !== 'other' && 
          c.id !== 'other' && 
          c.id !== 'Other'
        );
        setCategoryList(finalCategories);
      } catch {
        console.error('Failed to fetch categories');
        setCategoryList([]);
      }
    };
    fetchCategories();
  }, []);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
      categories: []
    }
  });

  const selectedRole = watch('role');
  const selectedCategoryIds = watch('categories') || [];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Filter out 'other' from the categories array
      const validCategoryIds = (data.categories || []).filter(id => id !== 'other');
      
      const response = await authService.register(
        data.name, 
        data.email, 
        data.password, 
        data.role,
        data.role === 'seller' ? {
          store_name: data.store_name,
          store_description: data.store_description,
          business_type: data.business_type,
          categories: validCategoryIds,
          categoryRequest: data.categoryRequest,
        } : null
      );
      
      toast.success(response.message || 'Account created successfully. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await api.get('/auth/google/redirect');
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Could not connect to Google');
      }
    } catch {
      toast.error('Could not connect to Google');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-1/2 bg-[#0F172A] relative flex-col justify-center px-12 overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#F97316] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#F97316] rounded-full opacity-20 blur-3xl"></div>
        
        <div className="z-10 flex flex-col h-full py-12">
          <div className="flex items-center space-x-3 text-2xl font-bold">
            <div className="bg-[#F97316] p-2 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <span>ShopPro</span>
          </div>
          
          <div className="mt-auto mb-auto">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Join the future<br />of commerce
            </h1>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#F97316] rounded-full animate-pulse"></div>
                </div>
                <span className="text-xl">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#F97316]" />
                </div>
                <span className="text-xl">Secure Payment</span>
              </div>
               <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col h-screen overflow-y-auto">
        <div className="md:hidden flex items-center p-6 bg-[#0F172A] text-white shrink-0">
          <ShoppingBag className="w-6 h-6 mr-2 text-[#F97316]" />
          <span className="font-bold text-xl">ShopPro</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-8">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8">Sign up for your new account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('name')}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                    placeholder="Full Name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                    placeholder="Email address"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}

              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                    placeholder="Confirm Password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {selectedRole === 'seller' && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-[#0F172A]">Store Information</p>
                    <p className="text-[11px] text-[#F97316] font-medium bg-[#FFF7ED] p-2 rounded border border-[#FFEDD5]">
                      Seller accounts require admin approval before selling products.
                    </p>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      {...register('store_name')}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                      placeholder="Store Name"
                    />
                    {errors.store_name && <p className="mt-1 text-sm text-red-500">{errors.store_name.message}</p>}
                  </div>

                  <div>
                    <textarea
                      {...register('store_description')}
                      rows="3"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all resize-none"
                      placeholder="Store Description"
                    ></textarea>
                    {errors.store_description && <p className="mt-1 text-sm text-red-500">{errors.store_description.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Identity</label>
                    <select
                      {...register('business_type')}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select Business Type</option>
                      <option value="Individual">Individual</option>
                      <option value="Company">Company</option>
                      <option value="Requested Brand">Requested Brand</option>
                    </select>
                    {errors.business_type && <p className="mt-1 text-sm text-red-500">{errors.business_type.message}</p>}
                  </div>

                  <div className="pt-2 relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Categories</label>
                    <p className="text-[10px] text-gray-400 mb-2 italic">Select one or more categories that apply to your store</p>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                      >
                        <span className="text-sm text-gray-700 truncate">
                          {selectedCategoryIds.length > 0 
                            ? `${selectedCategoryIds.length} categories selected`
                            : 'Choose categories...'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
                          <div className="p-2 grid grid-cols-1 gap-1">
                            {Array.isArray(categoryList) && categoryList.map((category) => {
                              const isSelected = selectedCategoryIds.includes(String(category.id));
                              return (
                                <label 
                                  key={category.id} 
                                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-gray-50'}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#F97316] border-[#F97316]' : 'border-gray-300'}`}>
                                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="text-sm font-medium">{category.name}</span>
                                  </div>
                                  <input
                                    type="checkbox"
                                    value={category.id}
                                    {...register('categories')}
                                    className="sr-only"
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Tags Display */}
                    {selectedCategoryIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedCategoryIds.map(catId => {
                          const category = categoryList.find(c => String(c.id) === String(catId));
                          return category ? (
                            <span key={catId} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-[#F97316]">
                              {category.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}

                    {/* Conditional "Other" Input */}
                    {selectedCategoryIds.includes('other') && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          {...register('categoryRequest')}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                          placeholder="What category would you like to request?"
                        />
                        {errors.categoryRequest && <p className="mt-1 text-sm text-red-500">{errors.categoryRequest.message}</p>}
                      </div>
                    )}
                    
                    {errors.categories && <p className="mt-1 text-sm text-red-500">{errors.categories.message}</p>}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Account Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none has-checked:border-[#F97316] has-checked:ring-1 has-checked:ring-[#F97316] transition-all">
                    <input type="radio" value="customer" {...register('role')} className="sr-only" />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="flex items-center space-x-2 text-sm font-medium text-[#0F172A]">
                          <User className="w-4 h-4 text-[#F97316]" />
                          <span>Customer</span>
                        </span>
                      </span>
                    </span>
                  </label>
                  <label className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none has-checked:border-[#F97316] has-checked:ring-1 has-checked:ring-[#F97316] transition-all">
                    <input type="radio" value="seller" {...register('role')} className="sr-only" />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="flex items-center space-x-2 text-sm font-medium text-[#0F172A]">
                          <Store className="w-4 h-4 text-[#F97316]" />
                          <span>Seller</span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-white bg-linear-to-r from-[#F97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] font-medium transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  style={{ cursor: 'pointer' }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.93 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Continue with Google
                  </span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 mb-8">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#F97316] hover:text-[#ea580c] transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
