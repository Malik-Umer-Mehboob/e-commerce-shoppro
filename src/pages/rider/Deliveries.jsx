import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import RiderLayout from '../../components/rider/Layout';
import { ArrowLeft, Phone, User, MapPin } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

export default function RiderDeliveries() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [updating, setUpdating] = useState(null);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/rider/assignments');
            setAssignments(response.data?.data ?? []);
        } catch (err) {
            if (err.response?.status === 404) {
                setAssignments([]);
            } else {
                toast.error('Failed to load deliveries');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const handleStatusUpdate = async (assignmentId, status) => {
        setUpdating(assignmentId);
        try {
            await api.patch(
                `/rider/assignments/${assignmentId}/status`,
                { status }
            );
            const labels = {
                picked_up: 'Picked Up',
                delivered: 'Delivered',
            };
            toast.success(
                `Marked as ${labels[status]}!`
            );
            fetchAssignments();
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const tabs = [
        { key: 'pending', label: 'Pending', emoji: '⏳' },
        { key: 'picked_up', label: 'In Transit', emoji: '🚚' },
        { key: 'delivered', label: 'Delivered', emoji: '✅' },
    ];

    const filtered = assignments.filter(
        a => a.status === activeTab
    );

    // Calculate paginated data
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'delivered':
                return { bg: '#D1FAE5', color: '#065F46' };
            case 'picked_up':
                return { bg: '#DBEAFE', color: '#1E40AF' };
            default:
                return { bg: '#FEF3C7', color: '#92400E' };
        }
    };

    // Helper functions for data extraction
    const formatAddress = (address) => {
        if (!address) return 'Address not available';
        try {
            const addr = typeof address === 'string'
                ? JSON.parse(address)
                : address;
            const parts = [
                addr.address_line_1,
                addr.address_line_2,
                addr.city,
                addr.country,
            ].filter(Boolean);
            return parts.length > 0 ? parts.join(', ') : (typeof address === 'string' ? address : 'Address details missing');
        } catch {
            return address;
        }
    };

    const getPhone = (address) => {
        if (!address) return null;
        try {
            const addr = typeof address === 'string'
                ? JSON.parse(address)
                : address;
            return addr.phone ?? null;
        } catch {
            return null;
        }
    };

    const getCustomerName = (assignment) => {
        if (assignment.customer?.name && assignment.customer.name !== 'Guest') {
            return assignment.customer.name;
        }
        try {
            const addr = typeof assignment.order?.shipping_address === 'string'
                ? JSON.parse(assignment.order.shipping_address)
                : assignment.order?.shipping_address;
            return addr?.full_name ?? 'Customer';
        } catch {
            return 'Customer';
        }
    };

    const pendingCount = assignments.filter(a => a.status === 'pending').length;
    const inTransitCount = assignments.filter(a => a.status === 'picked_up').length;
    const deliveredCount = assignments.filter(a => a.status === 'delivered').length;
    const totalCount = assignments.length;

    return (
        <RiderLayout>
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="font-black text-[#0F172A] text-lg uppercase tracking-tight">Overview</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                            <span className="text-xs font-bold text-gray-400">Today</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-auto">
                        <ThemeToggle />
                        <div className="text-right">
                            <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rider Panel</p>
                        </div>
                    </div>
                </header>

                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#F8FAFC',
                    padding: '24px',
                }}>
                    {/* Content */}
                    <div style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}>
                        {/* Summary stats row */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                        }}>
                            {[
                                { label: 'Pending', count: pendingCount, color: '#F97316' },
                                { label: 'In Transit', count: inTransitCount, color: '#60A5FA' },
                                { label: 'Delivered', count: deliveredCount, color: '#34D399' },
                                { label: 'Total', count: totalCount, color: '#0F172A' },
                            ].map(stat => (
                                <div key={stat.label} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '16px 24px',
                                    minWidth: '120px',
                                    textAlign: 'center',
                                    border: '1px solid #F1F5F9',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                }}>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: '800',
                                        color: stat.color,
                                    }}>
                                        {stat.count}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#94A3B8',
                                        marginTop: '2px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontWeight: '700',
                                    }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '24px',
                            backgroundColor: 'white',
                            padding: '6px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        backgroundColor:
                                            activeTab === tab.key
                                                ? '#F97316' : 'transparent',
                                        color: activeTab === tab.key
                                            ? 'white' : '#64748B',
                                    }}
                                    onMouseEnter={e => {
                                        if (activeTab === tab.key) {
                                            e.currentTarget.style.backgroundColor = '#EA6F10';
                                        } else {
                                            e.currentTarget.style.backgroundColor = '#F8FAFC';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (activeTab === tab.key) {
                                            e.currentTarget.style.backgroundColor = '#F97316';
                                        } else {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {tab.emoji} {tab.label}
                                    <span style={{
                                        backgroundColor:
                                            activeTab === tab.key
                                                ? 'rgba(255,255,255,0.3)'
                                                : '#F1F5F9',
                                        color: activeTab === tab.key
                                            ? 'white' : '#64748B',
                                        padding: '1px 8px',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        marginLeft: '6px',
                                    }}>
                                        {assignments.filter(
                                            a => a.status === tab.key
                                        ).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #E2E8F0',
                                    borderTop: '3px solid #F97316',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 16px',
                                }} />
                                <p style={{ color: '#94A3B8', fontWeight: '600' }}>
                                    Loading deliveries...
                                </p>
                                <style>{`
                                    @keyframes spin {
                                        from { transform: rotate(0deg); }
                                        to { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </div>
                        ) : filtered.length === 0 ? (
                            /* Empty state */
                            <div style={{
                                textAlign: 'center',
                                padding: '80px 24px',
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                border: '1px solid #F1F5F9',
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                                    {activeTab === 'pending' ? '📭'
                                        : activeTab === 'picked_up' ? '🚚'
                                        : '✅'}
                                </div>
                                <h3 style={{
                                    color: '#0F172A',
                                    margin: '0 0 8px',
                                    fontSize: '20px',
                                    fontWeight: '800',
                                }}>
                                    No {tabs.find(
                                        t => t.key === activeTab
                                    )?.label} Deliveries
                                </h3>
                                <p style={{
                                    color: '#94A3B8',
                                    fontSize: '15px',
                                    margin: 0,
                                }}>
                                    {activeTab === 'pending'
                                        ? 'No deliveries assigned to you yet'
                                        : activeTab === 'picked_up'
                                        ? 'No deliveries in transit'
                                        : 'No completed deliveries yet'}
                                </p>
                            </div>
                        ) : (
                            /* Delivery cards */
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}>
                                {paginated.map((assignment) => {
                                    const statusStyle = getStatusStyle(
                                        assignment.status
                                    );
                                    const customerName = getCustomerName(assignment);
                                    const addressPhone = getPhone(assignment.order?.shipping_address);
                                    const customerPhone = assignment.customer?.phone || addressPhone;
                                    
                                    return (
                                        <div
                                            key={assignment.id}
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '24px',
                                                padding: '24px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                                border: '1px solid #F1F5F9',
                                                borderLeft: '5px solid #F97316',
                                                transition: 'transform 0.2s',
                                            }}
                                        >
                                            {/* Card header */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '20px',
                                            }}>
                                                <div>
                                                    <h3 style={{
                                                        fontSize: '19px',
                                                        fontWeight: '900',
                                                        color: '#0F172A',
                                                        margin: '0 0 4px',
                                                        letterSpacing: '-0.5px',
                                                    }}>
                                                        Order #{String(assignment.order_id).padStart(4, '0')}
                                                    </h3>
                                                    <p style={{
                                                        fontSize: '12px',
                                                        color: '#94A3B8',
                                                        margin: 0,
                                                        fontWeight: '600',
                                                    }}>
                                                        {new Date(assignment.created_at).toLocaleDateString('en-PK', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <span style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '800',
                                                    backgroundColor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                }}>
                                                    {assignment.status === 'picked_up'
                                                        ? '🚚 In Transit'
                                                        : assignment.status === 'delivered'
                                                        ? '✅ Delivered'
                                                        : '⏳ Pending'}
                                                </span>
                                            </div>

                                            {/* Info grid */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '16px',
                                                marginBottom: '20px',
                                            }}>
                                                {/* Customer */}
                                                <div style={{
                                                    backgroundColor: '#F8FAFC',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    border: '1px solid #F1F5F9',
                                                }}>
                                                    <p style={{
                                                        fontSize: '10px',
                                                        color: '#94A3B8',
                                                        margin: '0 0 6px',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                    }}>
                                                        👤 Customer
                                                    </p>
                                                    <p style={{
                                                        fontSize: '15px',
                                                        color: '#0F172A',
                                                        margin: 0,
                                                        fontWeight: '700',
                                                    }}>
                                                        {customerName}
                                                    </p>
                                                    {customerPhone && (
                                                        <p style={{
                                                            fontSize: '13px',
                                                            color: '#64748B',
                                                            margin: '4px 0 0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontWeight: '500',
                                                        }}>
                                                            📞 {customerPhone}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Amount */}
                                                <div style={{
                                                    backgroundColor: '#FFF7ED',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    border: '1px solid #FFEDD5',
                                                }}>
                                                    <p style={{
                                                        fontSize: '10px',
                                                        color: '#94A3B8',
                                                        margin: '0 0 6px',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                    }}>
                                                        💰 Amount
                                                    </p>
                                                    <p style={{
                                                        fontSize: '20px',
                                                        color: '#F97316',
                                                        margin: 0,
                                                        fontWeight: '900',
                                                    }}>
                                                        Rs. {Number(assignment.order?.grand_total ?? 0).toLocaleString()}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '11px',
                                                        color: '#92400E',
                                                        margin: '4px 0 0',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                    }}>
                                                        {assignment.order?.payment_method === 'cod'
                                                            ? 'Cash on Delivery'
                                                            : (assignment.order?.payment_method?.toUpperCase() ?? 'COD')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div style={{
                                                backgroundColor: '#F8FAFC',
                                                borderRadius: '16px',
                                                padding: '16px',
                                                marginBottom: '20px',
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                                border: '1px solid #F1F5F9',
                                            }}>
                                                <div style={{ 
                                                    backgroundColor: 'white', 
                                                    padding: '8px', 
                                                    borderRadius: '10px', 
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <MapPin size={18} color="#F97316" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{
                                                        fontSize: '10px',
                                                        color: '#94A3B8',
                                                        margin: '0 0 4px',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                    }}>
                                                        Delivery Address
                                                    </p>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#334155',
                                                        margin: 0,
                                                        lineHeight: '1.6',
                                                        fontWeight: '500',
                                                    }}>
                                                        {formatAddress(assignment.order?.shipping_address)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            {assignment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(assignment.id, 'picked_up')}
                                                    disabled={updating === assignment.id}
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: '#3B82F6',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '16px',
                                                        borderRadius: '16px',
                                                        cursor: updating === assignment.id ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        fontWeight: '800',
                                                        fontSize: '14px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        opacity: updating === assignment.id ? 0.7 : 1,
                                                        boxShadow: '0 8px 15px rgba(59, 130, 246, 0.25)',
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (updating !== assignment.id) {
                                                            e.currentTarget.style.backgroundColor = '#2563EB';
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (updating !== assignment.id) {
                                                            e.currentTarget.style.backgroundColor = '#3B82F6';
                                                        }
                                                    }}
                                                >
                                                    {updating === assignment.id ? '...' : '📦 Mark as Picked Up'}
                                                </button>
                                            )}

                                            {assignment.status === 'picked_up' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(assignment.id, 'delivered')}
                                                    disabled={updating === assignment.id}
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: '#10B981',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '16px',
                                                        borderRadius: '16px',
                                                        cursor: updating === assignment.id ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        fontWeight: '800',
                                                        fontSize: '14px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        opacity: updating === assignment.id ? 0.7 : 1,
                                                        boxShadow: '0 8px 15px rgba(16, 185, 129, 0.25)',
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (updating !== assignment.id) {
                                                            e.currentTarget.style.backgroundColor = '#059669';
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (updating !== assignment.id) {
                                                            e.currentTarget.style.backgroundColor = '#10B981';
                                                        }
                                                    }}
                                                >
                                                    {updating === assignment.id ? '...' : '✅ Mark as Delivered'}
                                                </button>
                                            )}

                                            {assignment.status === 'delivered' && (
                                                <div style={{
                                                    backgroundColor: '#D1FAE5',
                                                    color: '#065F46',
                                                    padding: '16px',
                                                    borderRadius: '16px',
                                                    fontWeight: '800',
                                                    fontSize: '14px',
                                                    textAlign: 'center',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    border: '1px solid #A7F3D0',
                                                }}>
                                                    ✅ Successfully Delivered
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Pagination controls */}
                                {totalPages > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginTop: '24px',
                                    }}>
                                        {/* Previous */}
                                        <button
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #E2E8F0',
                                                backgroundColor: currentPage === 1
                                                    ? '#F8FAFC' : 'white',
                                                color: currentPage === 1
                                                    ? '#94A3B8' : '#0F172A',
                                                cursor: currentPage === 1
                                                    ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                            }}
                                            onMouseEnter={e => {
                                                if (currentPage === 1) return;
                                                e.currentTarget.style.borderColor = '#F97316';
                                                e.currentTarget.style.color = '#F97316';
                                            }}
                                            onMouseLeave={e => {
                                                if (currentPage === 1) return;
                                                e.currentTarget.style.borderColor = '#E2E8F0';
                                                e.currentTarget.style.color = '#0F172A';
                                            }}
                                        >
                                            ← Prev
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages },
                                            (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: currentPage === page
                                                        ? '#F97316' : '#E2E8F0',
                                                    backgroundColor: currentPage === page
                                                        ? '#F97316' : 'white',
                                                    color: currentPage === page
                                                        ? 'white' : '#0F172A',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    fontWeight: currentPage === page
                                                        ? '700' : '400',
                                                    fontSize: '14px',
                                                }}
                                                onMouseEnter={e => {
                                                    if (currentPage === page) return;
                                                    e.currentTarget.style.borderColor = '#F97316';
                                                    e.currentTarget.style.color = '#F97316';
                                                }}
                                                onMouseLeave={e => {
                                                    if (currentPage === page) return;
                                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                                    e.currentTarget.style.color = '#0F172A';
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next */}
                                        <button
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #E2E8F0',
                                                backgroundColor: currentPage === totalPages
                                                    ? '#F8FAFC' : 'white',
                                                color: currentPage === totalPages
                                                    ? '#94A3B8' : '#0F172A',
                                                cursor: currentPage === totalPages
                                                    ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                            }}
                                            onMouseEnter={e => {
                                                if (currentPage === totalPages) return;
                                                e.currentTarget.style.borderColor = '#F97316';
                                                e.currentTarget.style.color = '#F97316';
                                            }}
                                            onMouseLeave={e => {
                                                if (currentPage === totalPages) return;
                                                e.currentTarget.style.borderColor = '#E2E8F0';
                                                e.currentTarget.style.color = '#0F172A';
                                            }}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}

                                {/* Show count info */}
                                {filtered.length > 0 && (
                                    <p style={{
                                        textAlign: 'center',
                                        color: '#94A3B8',
                                        fontSize: '13px',
                                        marginTop: '12px',
                                    }}>
                                        {filtered.length} {filtered.length === 1
                                            ? 'delivery' : 'deliveries'} total
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
}
