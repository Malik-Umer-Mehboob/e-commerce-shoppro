import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingBag, Users, X } from 'lucide-react';
import api from '../../services/api';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [counts, setCounts] = useState({});
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    // Debounce search — wait 400ms after user stops typing
    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/global-search', {
                    params: { q: query }
                });
                setResults(response.data?.data?.results ?? []);
                setCounts(response.data?.data?.counts ?? {});
                setIsOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !inputRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
                inputRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleResultClick = (result) => {
        navigate(result.url);
        setQuery('');
        setIsOpen(false);
    };

    const getTypeIcon = (type) => {
        if (type === 'product') return <Package size={16} color="#F97316" />;
        if (type === 'order') return <ShoppingBag size={16} color="#6366F1" />;
        if (type === 'user') return <Users size={16} color="#10B981" />;
        return null;
    };

    const getTypeLabel = (type) => {
        if (type === 'product') return 'Product';
        if (type === 'order') return 'Order';
        if (type === 'user') return 'User';
        return type;
    };

    const getBadgeColor = (badge) => {
        if (badge === 'published' || badge === 'delivered' || badge === 'customer') {
            return { bg: '#D1FAE5', color: '#065F46' };
        }
        if (badge === 'draft' || badge === 'pending') {
            return { bg: '#FEF3C7', color: '#92400E' };
        }
        if (badge === 'seller') {
            return { bg: '#FED7AA', color: '#9A3412' };
        }
        if (badge === 'admin') {
            return { bg: '#FEE2E2', color: '#991B1B' };
        }
        return { bg: '#E2E8F0', color: '#475569' };
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>

            {/* Search Input */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
                borderRadius: '16px',
                padding: '8px 16px',
                gap: '10px',
                border: isOpen
                    ? '2px solid #F97316'
                    : '2px solid #F1F5F9',
                transition: 'all 0.2s',
                boxShadow: isOpen ? '0 10px 25px -5px rgba(249, 115, 22, 0.1)' : 'none'
            }}>
                {loading
                    ? <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #E2E8F0',
                        borderTop: '2px solid #F97316',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                        flexShrink: 0,
                      }} />
                    : <Search size={16} color={isOpen ? "#F97316" : "#94A3B8"} style={{ flexShrink: 0 }} />
                }
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search orders, products, users..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#0F172A',
                        fontSize: '14px',
                        fontWeight: '600',
                        width: '100%',
                    }}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: '#F1F5F9'
                        }}
                    >
                        <X size={12} color="#64748B" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999,
                        overflow: 'hidden',
                        minWidth: '400px',
                        border: '1px solid #F1F5F9'
                    }}
                >
                    {/* Results count header */}
                    <div style={{
                        padding: '14px 20px',
                        backgroundColor: '#F8FAFC',
                        borderBottom: '1px solid #F1F5F9',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#64748B',
                        display: 'flex',
                        gap: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <span style={{ color: '#0F172A' }}>
                            {counts.total ?? 0} results for "{query}"
                        </span>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            {counts.products > 0 &&
                                <span style={{ color: '#F97316' }}>
                                    {counts.products} P
                                </span>
                            }
                            {counts.orders > 0 &&
                                <span style={{ color: '#6366F1' }}>
                                    {counts.orders} O
                                </span>
                            }
                            {counts.users > 0 &&
                                <span style={{ color: '#10B981' }}>
                                    {counts.users} U
                                </span>
                            }
                        </div>
                    </div>

                    {/* Results list */}
                    {results.length === 0 ? (
                        <div style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            color: '#94A3B8',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px' }}>
                            {results.map((result, index) => {
                                const badgeStyle = getBadgeColor(result.badge);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleResultClick(result)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            padding: '12px 16px',
                                            cursor: 'pointer',
                                            borderRadius: '12px',
                                            marginBottom: '2px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = '#F8FAFC';
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        {/* Thumbnail or Icon */}
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            backgroundColor: '#F1F5F9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            border: '2px solid white',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                        }}>
                                            {result.thumbnail ? (
                                                <img
                                                    src={result.thumbnail}
                                                    alt={result.title}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                getTypeIcon(result.type)
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '2px',
                                            }}>
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    color: '#0F172A',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {result.title}
                                                </span>
                                                {result.badge && (
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: '800',
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        backgroundColor: badgeStyle.bg,
                                                        color: badgeStyle.color,
                                                        flexShrink: 0,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.02em'
                                                    }}>
                                                        {result.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                color: '#94A3B8',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {result.subtitle}
                                            </div>
                                        </div>

                                        {/* Type label */}
                                        <div style={{
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            color: '#CBD5E1',
                                            flexShrink: 0,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {getTypeLabel(result.type)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        padding: '10px 20px',
                        backgroundColor: '#F8FAFC',
                        borderTop: '1px solid #F1F5F9',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#94A3B8',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>Press</span>
                        <kbd style={{
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            color: '#64748B',
                            boxShadow: '0 2px 0 #E2E8F0'
                        }}>ESC</kbd>
                        <span>to close search</span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
