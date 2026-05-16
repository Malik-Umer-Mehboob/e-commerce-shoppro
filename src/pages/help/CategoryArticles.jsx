import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Book, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function CategoryArticles() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [slug]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kb?category=${encodeURIComponent(slug)}`);
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{slug}</h1>
          <p className="text-gray-500 font-medium">Browse all articles in this category</p>
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
                      <p className="text-xs text-gray-400 mt-1">{article.views} views • {new Date(article.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              {articles.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Book className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="font-medium">No articles found in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
