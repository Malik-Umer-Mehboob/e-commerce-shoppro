import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, Book, ArrowRight, Loader2, Search } from 'lucide-react';
import api from '../../services/api';

export default function HelpSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kb?q=${encodeURIComponent(query)}`);
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/help" className="inline-flex items-center text-gray-500 hover:text-[#F97316] mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Help Center
        </Link>

        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-2">
            <Search className="w-6 h-6 text-gray-400" />
            <h1 className="text-3xl font-extrabold text-gray-900">Search Results</h1>
          </div>
          <p className="text-gray-500 font-medium">Showing results for "{query}"</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#F97316]" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/help/article/${article.slug}`}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                      <Book className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-[#F97316] transition-colors">{article.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">In {article.category} • {article.views} views</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              {articles.length === 0 && (
                <div className="p-16 text-center text-gray-500">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h2 className="text-xl font-black text-[#0F172A] mb-2">No results found</h2>
                  <p className="text-gray-500 font-medium mb-8">We couldn't find any articles matching your search. Try different keywords.</p>
                  <Link 
                    to="/help" 
                    className="inline-block px-8 py-3 bg-[#F97316] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#F97316]/20 hover:bg-[#ea580c] transition-all"
                  >
                    Back to Help Center
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
