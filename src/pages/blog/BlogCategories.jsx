import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Header from '../../components/layout/Header';
import { Link } from 'react-router-dom';
import { ChevronRight, Folder } from 'lucide-react';

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/blog/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="bg-slate-900 text-white pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6">Explore <span className="text-orange-500">Topics</span></h1>
          <p className="text-slate-400 text-lg">Browse our collection of stories by category.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">Loading categories...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/blog?category=${cat.slug}`}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Folder size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{cat.name}</h2>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{cat.description || 'Discover stories about ' + cat.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{cat.posts_count || 0} Articles</span>
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-orange-50 transition-colors">
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCategories;
