import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';

const SplashPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useSelector(state => state.auth);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (isAuthenticated) {
            if (role === 'admin') navigate('/admin/dashboard', { replace: true });
            else if (role === 'seller') navigate('/seller/dashboard', { replace: true });
            else if (role === 'support') navigate('/support/dashboard', { replace: true });
            else if (role === 'rider') navigate('/rider/dashboard', { replace: true });
            else navigate('/home', { replace: true });
            return;
        }

        // Start 5 second countdown
        setCountdown(5);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    navigate('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated, navigate, role]);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
        }}>
            <style>
                {`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes pulseBorder {
                    0%, 100% { opacity: 1; border-color: #F97316; }
                    50% { opacity: 0.7; border-color: #EA6F10; }
                }
                `}
            </style>

            {/* Logo */}
            <div style={{ animation: 'fadeInScale 0.8s ease-out' }}>
                <ShoppingBag size={80} color="#F97316" />
            </div>

            {/* Brand name */}
            <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginTop: '16px',
                letterSpacing: '4px',
            }}>
                ShopPro
            </h1>

            {/* Tagline */}
            <p style={{
                color: '#94A3B8',
                fontSize: '18px',
                marginTop: '8px',
                textAlign: 'center',
            }}>
                Your One-Stop Shopping Destination
            </p>

            {/* Features */}
            <div style={{
                display: 'flex',
                gap: '40px',
                marginTop: '48px',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {[
                    { icon: <Truck size={24} color="#F97316" />, text: 'Fast Delivery' },
                    { icon: <Shield size={24} color="#F97316" />, text: 'Secure Payments' },
                    { icon: <Star size={24} color="#F97316" />, text: 'Top Rated' },
                ].map((item, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        {item.icon}
                        <span style={{
                            color: 'white',
                            fontSize: '14px',
                        }}>
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* Countdown */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '48px',
                gap: '12px',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '4px solid #F97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    animation: 'pulseBorder 1s infinite',
                }}>
                    {countdown}
                </div>

                <p style={{
                    color: '#94A3B8',
                    fontSize: '14px',
                }}>
                    Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        backgroundColor: '#F97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '12px 32px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '8px',
                        width: '280px',
                    }}
                    onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
                    onMouseOut={(e) => e.target.style.filter = 'none'}
                >
                    Get Started →
                </button>
            </div>

            {/* Bottom link */}
            <p style={{
                color: '#64748B',
                fontSize: '13px',
                marginTop: '32px',
            }}>
                Already have an account?{' '}
                <span
                    onClick={() => navigate('/login')}
                    style={{
                        color: '#F97316',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                    }}
                >
                    Sign In
                </span>
            </p>
        </div>
    );
};

export default SplashPage;
