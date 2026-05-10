import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import { fetchCart } from '../../store/cartSlice';
import { fetchWishlist } from '../../store/wishlistSlice';
import api from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      const { user, token } = response.data?.data ?? response.data ?? {}; // Fallback to response.data just in case authService unwraps it

      // Debug: log what we received
      
      
      

      if (!user || !token) {
          toast.error('Login failed: invalid response from server');
          return;
      }

      // Save to Redux + localStorage
      dispatch(setCredentials({ user, token }));
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success('Logged in successfully');


      // Redirect based on role
      const role = user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'seller') navigate('/seller/dashboard');
      else if (role === 'support') navigate('/support/dashboard');
      else if (role === 'rider') navigate('/rider/dashboard');
      else navigate('/home');
     } catch (err) {
      if (err.response?.status === 429) {
        const minutesLeft = err.response?.data?.minutes_left || 15;
        toast.error(
          `Account locked! Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
          { duration: 6000 }
        );
      } else {
        const attemptsLeft = err.response?.data?.attempts_left;
        if (attemptsLeft !== undefined) {
          toast.error(
            `Invalid credentials. ${attemptsLeft} attempt(s) remaining.`,
            { duration: 4000 }
          );
        } else {
          toast.error(err.response?.data?.message || 'Login failed');
        }
      }
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
              Your one-stop<br />shopping destination
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
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#F97316] focus:ring-[#F97316] border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-[#F97316] hover:text-[#ea580c] transition-colors">Forgot Password?</Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-linear-to-r from-[#F97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] font-medium transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
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

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#F97316] hover:text-[#ea580c] transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
