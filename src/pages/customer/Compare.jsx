import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromComparison, clearComparison } from '../../store/comparisonSlice';
import Header from '../../components/layout/Header';

export default function Compare() {
    const { items } = useSelector(state => state.comparison);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚖️</div>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>Comparison list is empty</h2>
                    <p style={{ color: '#64748B', fontSize: '18px', marginBottom: '40px' }}>
                        Add at least two products to compare their features side by side.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        style={{
                            backgroundColor: '#F97316',
                            color: 'white',
                            border: 'none',
                            padding: '16px 32px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontWeight: '800',
                            fontSize: '16px',
                            boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.2)'
                        }}
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0F172A' }}>Product Comparison</h1>
                    <button
                        onClick={() => dispatch(clearComparison())}
                        style={{
                            color: '#EF4444',
                            border: '2px solid #FEE2E2',
                            backgroundColor: 'white',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.2s'
                        }}
                    >
                        Clear All
                    </button>
                </div>

                {/* Comparison table */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))`,
                    gap: '24px',
                }}>
                    {items.map((product) => (
                        <div key={product.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            border: '1px solid #F1F5F9',
                            position: 'relative'
                        }}>
                            {/* Remove button */}
                            <button
                                onClick={() => dispatch(removeFromComparison(product.id))}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: '#F1F5F9',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#64748B',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✕
                            </button>

                            {/* Image */}
                            <div style={{
                                width: '100%',
                                height: '200px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                overflow: 'hidden',
                                border: '1px solid #F1F5F9'
                            }}>
                                {product.thumbnail ? (
                                    <img
                                        src={product.thumbnail.startsWith('http') ? product.thumbnail : `http://localhost:8000/storage/${product.thumbnail}`}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#94A3B8', fontSize: '14px' }}>No Image</span>
                                )}
                            </div>

                            {/* Product info */}
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '800',
                                color: '#0F172A',
                                marginBottom: '8px',
                                lineHeight: '1.4'
                            }}>
                                {product.name}
                            </h3>

                            <p style={{
                                fontSize: '14px',
                                color: '#64748B',
                                marginBottom: '16px',
                                fontWeight: '500'
                            }}>
                                {product.category?.name || 'Uncategorized'}
                            </p>

                            {/* Price */}
                            <div style={{ marginBottom: '24px' }}>
                                {product.sale_price ? (
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '24px',
                                            fontWeight: '900',
                                            color: '#F97316',
                                        }}>
                                            Rs. {Number(product.sale_price).toLocaleString()}
                                        </span>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#94A3B8',
                                            textDecoration: 'line-through',
                                        }}>
                                            Rs. {Number(product.price).toLocaleString()}
                                        </span>
                                    </div>
                                ) : (
                                    <span style={{
                                        fontSize: '24px',
                                        fontWeight: '900',
                                        color: '#0F172A',
                                    }}>
                                        Rs. {Number(product.price).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Specs */}
                            <div style={{
                                borderTop: '1px solid #F1F5F9',
                                paddingTop: '16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                    fontSize: '14px',
                                }}>
                                    <span style={{ color: '#64748B', fontWeight: '500' }}>Stock Status</span>
                                    <span style={{
                                        color: product.stock_quantity > 0 ? '#10B981' : '#EF4444',
                                        fontWeight: '700',
                                    }}>
                                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                }}>
                                    <span style={{ color: '#64748B', fontWeight: '500' }}>SKU</span>
                                    <span style={{ color: '#0F172A', fontWeight: '700' }}>
                                        {product.sku || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* View Product */}
                            <button
                                onClick={() => navigate(`/products/${product.id}`)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#0F172A',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
