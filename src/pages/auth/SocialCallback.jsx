import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import { setCredentials } from '../../store/authSlice';
import { fetchCart } from '../../store/cartSlice';
import { fetchWishlist } from '../../store/wishlistSlice';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const SocialCallback = () => {
  const { provider } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await api.get(`/auth/social/${provider}/callback${location.search}`);
        if (response.data.token) {
          dispatch(setCredentials({ 
            user: response.data.user, 
            token: response.data.token 
          }));
          dispatch(fetchCart());
          dispatch(fetchWishlist());
          toast.success(`Successfully logged in with ${provider}`);
          navigate('/');
        }
      } catch (err) {
        toast.error('Social login failed. Please try again.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [provider, location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Authenticating with {provider}...</h2>
        <p className="text-slate-500 mt-2">Please wait while we sync your account.</p>
      </div>
    </div>
  );
};

export default SocialCallback;
