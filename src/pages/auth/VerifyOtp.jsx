import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(email, otpValue);
      if (response.success) {
        toast.success(response.message || 'OTP Verified');
        navigate('/reset-password', { state: { email, otp: otpValue } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success('OTP resent successfully');
        setCountdown(60);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (!email) return null;

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
              Check your<br />inbox
            </h1>
            <p className="text-xl text-gray-300">
              We've sent a 6-digit verification code to your email.
            </p>
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
            <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>

            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Verify OTP</h2>
            <p className="text-gray-500 mb-8">
              Verification code sent to <span className="font-semibold text-gray-800">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handePaste : undefined}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-linear-to-r from-[#F97316] to-[#fb923c] hover:from-[#ea580c] hover:to-[#f97316] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${countdown > 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
