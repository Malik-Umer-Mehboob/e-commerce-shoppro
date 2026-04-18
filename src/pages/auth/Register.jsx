import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Loader2, User, Store, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'seller', 'support']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'customer') return data.email.endsWith('@gmail.com');
  return true;
}, {
  message: "Customers must use Gmail (@gmail.com)",
  path: ["email"],
}).refine((data) => {
  if (data.role === 'seller') return data.email.endsWith('@yahoo.com');
  return true;
}, {
  message: "Sellers must use Yahoo (@yahoo.com)",
  path: ["email"],
}).refine((data) => {
  if (data.role === 'support') return data.email.endsWith('@hotmail.com');
  return true;
}, {
  message: "Support staff must use Hotmail (@hotmail.com)",
  path: ["email"],
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data.name, data.email, data.password, data.role);
      if (response.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
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
                {!errors.email && selectedRole === 'customer' && <p className="mt-1 text-sm text-gray-500">Please use your Gmail address</p>}
                {!errors.email && selectedRole === 'seller' && <p className="mt-1 text-sm text-gray-500">Please use your Yahoo address</p>}
                {!errors.email && selectedRole === 'support' && <p className="mt-1 text-sm text-gray-500">Please use your Hotmail address (@hotmail.com)</p>}
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

              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Account Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none has-[:checked]:border-[#F97316] has-[:checked]:ring-1 has-[:checked]:ring-[#F97316] transition-all">
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
                  <label className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none has-[:checked]:border-[#F97316] has-[:checked]:ring-1 has-[:checked]:ring-[#F97316] transition-all">
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
                  <label className="relative flex cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none has-[:checked]:border-[#F97316] has-[:checked]:ring-1 has-[:checked]:ring-[#F97316] transition-all">
                    <input type="radio" value="support" {...register('role')} className="sr-only" />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="flex items-center space-x-2 text-sm font-medium text-[#0F172A]">
                          <HelpCircle className="w-4 h-4 text-[#F97316]" />
                          <span className="whitespace-nowrap">Support</span>
                        </span>
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-[#F97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] font-medium transition-all"
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
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all space-x-2 font-medium"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
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
