import { useState, useEffect } from 'react';
import { Search, Book, Truck, RotateCcw, CreditCard, User, ArrowRight, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const categories = [
  { id: 'FAQ', name: 'FAQ', icon: Book, description: 'Frequently asked questions' },
  { id: 'Shipping & Delivery', name: 'Shipping', icon: Truck, description: 'Track your orders and delivery info' },
  { id: 'Returns & Exchanges', name: 'Returns', icon: RotateCcw, description: 'Easy returns and exchanges' },
  { id: 'Payment', name: 'Payment', icon: CreditCard, description: 'Payment methods and security' },
  { id: 'Account Management', name: 'Account', icon: User, description: 'Manage your profile and settings' },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularArticles();
  }, []);

  const fetchPopularArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/kb`);
      setPopularArticles(response.data.data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/help/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#0F172A] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">How can we help you today?</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for articles, topics, or keywords..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#F97316]/20 text-lg shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/help/category/${encodeURIComponent(cat.id)}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center group"
            >
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                <cat.icon className="w-8 h-8 text-[#F97316] group-hover:text-white" />
              </div>
              <h3 className="font-bold text-gray-900">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-2">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Articles</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => <div key={n} className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>)}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/help/article/${article.slug}`}
                  className="flex items-center justify-between py-5 hover:px-4 hover:bg-gray-50 transition-all rounded-xl group"
                >
                  <div className="flex items-center space-x-4">
                    <Book className="w-5 h-5 text-gray-400 group-hover:text-[#F97316]" />
                    <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900">{article.title}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#F97316]" />
                </Link>
              ))}
              {popularArticles.length === 0 && (
                <p className="text-center text-gray-500 py-8">No articles found yet. Check back later!</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="max-w-4xl mx-auto py-20 px-4 mb-12">
        <div className="bg-[#F97316] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-[#F97316]/20">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Still need help?</h2>
            <p className="text-[#0F172A] font-medium">Our support team is always here for you.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/help/contact"
              className="bg-[#0F172A] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-colors text-center"
            >
              Contact Support
            </Link>
            <Link
              to="/help/order-lookup"
              className="bg-white text-[#F97316] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors text-center shadow-lg"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
