import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import {
    LayoutDashboard,
    Truck,
    Settings,
    LogOut,
} from 'lucide-react';
import api from '../../services/api';

export default function RiderSidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const menuItems = [
        {
            icon: <LayoutDashboard size={20} />,
            label: 'Dashboard',
            path: '/rider/dashboard',
        },
        {
            icon: <Truck size={20} />,
            label: 'My Deliveries',
            path: '/rider/deliveries',
        },
        {
            icon: <Settings size={20} />,
            label: 'Settings',
            path: '/rider/settings',
        },
    ];

    const handleLogout = async () => {
        try { 
            await api.post('/auth/logout'); 
        } catch {}
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div style={{
            width: '260px',
            minHeight: '100vh',
            backgroundColor: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>
            {/* Logo */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#F97316',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Truck size={18} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '900',
                            margin: 0,
                            letterSpacing: '-0.5px',
                        }}>
                            ShopPro <span style={{ color: '#F97316' }}>Rider</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* User Profile Summary */}
            <div style={{
                padding: '24px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                margin: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.1)',
                }}>
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        user?.name?.charAt(0).toUpperCase()
                    )}
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <p style={{
                        color: 'white',
                        fontWeight: '700',
                        margin: 0,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {user?.name}
                    </p>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)',
                        margin: '2px 0 0',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '600',
                    }}>
                        Active Rider
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{
                flex: 1,
                padding: '0 16px 16px',
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '10px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginBottom: '12px',
                    paddingLeft: '12px',
                }}>
                    Main Menu
                </p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            marginBottom: '6px',
                            cursor: 'pointer',
                            color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                            backgroundColor: isActive
                                ? '#F97316'
                                : 'transparent',
                            fontWeight: isActive ? '700' : '600',
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            boxShadow: isActive 
                                ? '0 10px 15px -3px rgba(249, 115, 22, 0.3)' 
                                : 'none',
                        })}
                        onMouseEnter={e => {
                            if (e.currentTarget.classList.contains('active')) return;
                            e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.1)';
                            e.currentTarget.style.color = '#F97316';
                        }}
                        onMouseLeave={e => {
                            if (e.currentTarget.classList.contains('active')) return;
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section / Logout */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        color: '#EF4444',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#EF4444';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                        e.currentTarget.style.color = '#EF4444';
                    }}
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </div>
    );
}
