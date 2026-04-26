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
        const error = params.get('error');

        if (error === 'google_failed') {
            toast.error('Google login failed. Please try again.');
            navigate('/login');
            return;
        }

        if (!token || !userParam) {
            toast.error('Google login failed');
            navigate('/login');
            return;
        }

        try {
            const user = JSON.parse(atob(userParam));
            
            dispatch(setCredentials({ user, token }));
            toast.success(`Welcome, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'seller') {
                navigate('/seller/dashboard');
            } else if (user.role === 'support') {
                navigate('/support/dashboard');
            } else {
                navigate('/');
            }
        } catch {
            toast.error('Google login failed. Please try again.');
            navigate('/login');
        }
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            color: 'white',
            gap: '16px',
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(249,115,22,0.3)',
                borderTop: '4px solid #F97316',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <p style={{ fontSize: '16px', color: '#94A3B8' }}>
                Completing Google login...
            </p>
        </div>
    );
}
