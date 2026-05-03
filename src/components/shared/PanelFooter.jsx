import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

const Facebook = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Twitter = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const Instagram = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function PanelFooter({ role = 'admin' }) {

    const quickLinks = {
        admin: [
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Products', path: '/admin/products' },
            { label: 'Orders', path: '/admin/orders' },
            { label: 'Users', path: '/admin/users' },
        ],
        seller: [
            { label: 'Dashboard', path: '/seller/dashboard' },
            { label: 'My Products', path: '/seller/products' },
            { label: 'Orders', path: '/seller/orders' },
            { label: 'Analytics', path: '/seller/analytics' },
        ],
        support: [
            { label: 'Dashboard', path: '/support/dashboard' },
            { label: 'Tickets', path: '/support/tickets' },
            { label: 'Knowledge Base',
                path: '/support/kb' }, // Fixed path based on earlier research
            { label: 'Settings', path: '/support/settings' },
        ],
        rider: [
            { label: 'Dashboard', path: '/rider/dashboard' },
            { label: 'My Deliveries',
                path: '/rider/deliveries' },
            { label: 'Settings', path: '/rider/settings' },
        ],
    };

    const supportLinks = {
        admin: [
            { label: 'Help Center', path: '/help' },
            { label: 'System Logs',
                path: '/admin/system-logs' },
            { label: 'Settings', path: '/admin/settings' },
        ],
        seller: [
            { label: 'Help Center', path: '/help' },
            { label: 'Contact Support',
                path: '/help/contact' },
            { label: 'Settings', path: '/seller/settings' },
        ],
        support: [
            { label: 'Help Center', path: '/help' },
            { label: 'Contact Admin',
                path: '/help/contact' },
        ],
        rider: [
            { label: 'Help Center', path: '/help' },
            { label: 'Contact Support',
                path: '/help/contact' },
        ],
    };

    const currentYear = new Date().getFullYear();
    const qLinks = quickLinks[role] ?? quickLinks.admin;
    const sLinks = supportLinks[role] ?? supportLinks.admin;

    const roleLabels = {
        admin: 'Admin Panel',
        seller: 'Seller Panel',
        support: 'Support Panel',
        rider: 'Rider Panel',
    };

    return (
        <footer className="bg-[#0F172A] text-[#F8FAFC] border-t border-white/10 pt-20 pb-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to={`/${role}/dashboard`} className="flex items-center space-x-2">
                            <div className="bg-[#F97316] p-1.5 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">ShopPro</span>
                        </Link>
                        <p className="text-[#94A3B8] text-sm leading-relaxed">
                            {roleLabels[role]} — Manage your store efficiently with ShopPro's powerful tools. Quality, style, and excellence delivered to your doorstep.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#F97316] transition-all duration-300 group">
                                <Facebook size={18} className="text-[#94A3B8] group-hover:text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#F97316] transition-all duration-300 group">
                                <Twitter size={18} className="text-[#94A3B8] group-hover:text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#F97316] transition-all duration-300 group">
                                <Instagram size={18} className="text-[#94A3B8] group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-4">
                            {qLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.path} className="text-[#94A3B8] hover:text-[#F97316] transition-colors text-sm font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
                        <ul className="space-y-4">
                            {sLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.path} className="text-[#94A3B8] hover:text-[#F97316] transition-colors text-sm font-medium">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-[#94A3B8]">
                                <MapPin size={18} className="text-[#F97316] flex-shrink-0 mt-0.5" />
                                <span>123 Commerce Way, Tech City, 10101</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-[#94A3B8]">
                                <Phone size={18} className="text-[#F97316] flex-shrink-0" />
                                <span>+1 (555) 000-0000</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-[#94A3B8]">
                                <Mail size={18} className="text-[#F97316] flex-shrink-0" />
                                <span>support@shoppro.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#94A3B8] text-xs">
                        © {currentYear} ShopPro E-commerce. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-[#94A3B8] hover:text-white text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[#94A3B8] hover:text-white text-xs transition-colors">Terms of Service</a>
                        <a href="#" className="text-[#94A3B8] hover:text-white text-xs transition-colors">Cookies Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
