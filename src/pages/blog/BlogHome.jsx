import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../store/blogSlice';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, User, ChevronRight, Search, Tag as TagIcon } from 'lucide-react';
import Header from '../../components/layout/Header';

const BlogHome = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts, loading, pagination } = useSelector((state) => state.blog);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    dispatch(fetchPosts(params));
  }, [dispatch, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get('search') || '';
      if (searchTerm !== currentSearch) {
        setSearchParams(prev => {
          if (searchTerm) prev.set('search', searchTerm);
          else prev.delete('search');
          return prev;
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchTerm) prev.set('search', searchTerm);
      else prev.delete('search');
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            ShopPro <span className="text-orange-500">Insights</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Your daily dose of e-commerce trends, product guides, and success stories.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search articles, trends, and guides..." 
              className="w-full bg-slate-800 border border-slate-700 px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-3 bg-orange-500 p-2 rounded-xl hover:bg-orange-600 transition-colors">
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {loading ? (
              <div className="space-y-12">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-[2.5rem] h-[300px] animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col md:flex-row h-full md:h-[300px]">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img 
                      src={post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900 tracking-wider">
                      {post.category?.name || 'Uncategorized'}
                    </div>
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-400 mb-4">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{post.author?.name}</span>
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="flex items-center space-x-2 text-sm font-black text-slate-900 group-hover:text-orange-500 transition-colors uppercase tracking-widest"
                    >
                      <span>Read Story</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-2xl font-black text-slate-900">No articles found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search terms or category filters.</p>
              </div>
            )}

            {/* Pagination Placeholder */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center space-x-2 pt-8">
                {/* Real pagination logic here */}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center space-x-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                <span>Categories</span>
              </h3>
              <div className="space-y-2">
                {['Growth', 'Technology', 'Culture', 'Design'].map((cat) => (
                  <Link key={cat} to={`/blog?category=${cat.toLowerCase()}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-500 transition-all hover:shadow-md">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <span className="text-xs font-black text-slate-300">12</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <TagIcon size={32} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Subscribe</h3>
                <p className="text-slate-400 text-sm mb-6">Get the latest stories delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="w-full bg-orange-500 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
                  Sign Me Up
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <a 
                href="/api/blog/rss" 
                target="_blank" 
                className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
              >
                <Search size={14} />
                <span>RSS Feed</span>
              </a>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default BlogHome;
