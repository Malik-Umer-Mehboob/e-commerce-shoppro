import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { toast } from 'react-hot-toast';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (!token || !userParam) {
      toast.error('Google login failed');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(atob(userParam));
      dispatch(setCredentials({ user, token }));
      toast.success('Logged in with Google!');

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'seller') navigate('/seller/dashboard');
      else if (user.role === 'support') navigate('/support/dashboard');
      else navigate('/home');
    } catch {
      toast.error('Google login failed');
      navigate('/login');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A',
      color: 'white',
      fontSize: '18px'
    }}>
      Connecting with Google...
    </div>
  );
}
