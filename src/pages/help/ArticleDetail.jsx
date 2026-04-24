import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Clock, Eye, Share2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API_URL}/kb/${slug}`);
      setArticle(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Article not found');
      navigate('/help');
    }
  };

  const handleVote = async (type) => {
    if (voted) return;
    try {
      await axios.post(`${API_URL}/kb/${article.id}/vote`, { type });
      setVoted(true);
      toast.success('Thank you for your feedback!');
      // Update local state for immediate feedback
      setArticle(prev => ({
        ...prev,
        [type === 'helpful' ? 'helpful_count' : 'not_helpful_count']: prev[type === 'helpful' ? 'helpful_count' : 'not_helpful_count'] + 1
      }));
    } catch (error) {
      toast.error('Error submitting feedback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/help" className="inline-flex items-center text-gray-500 hover:text-[#F97316] mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Help Center
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F97316] uppercase tracking-widest mb-4">
              <span>{article.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-10 border-b border-gray-50 pb-8">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                Updated {new Date(article.updated_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1.5" />
                {article.views} views
              </div>
            </div>

            <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: article.content }}>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Was this article helpful?</h3>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleVote('helpful')}
                    disabled={voted}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      voted ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-green-600 border border-green-100 hover:bg-green-50 shadow-sm'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Yes ({article.helpful_count})</span>
                  </button>
                  <button
                    onClick={() => handleVote('not_helpful')}
                    disabled={voted}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      voted ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-red-600 border border-red-100 hover:bg-red-50 shadow-sm'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>No ({article.not_helpful_count})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 flex justify-between items-center px-4">
          <p className="text-sm text-gray-500 italic">Still need help? <Link to="/help/contact" className="text-[#F97316] font-bold hover:underline">Contact us</Link></p>
          <button className="text-gray-400 hover:text-gray-600 flex items-center text-sm font-medium">
            <Share2 className="w-4 h-4 mr-2" /> Share Article
          </button>
        </div>
      </div>
    </div>
  );
}
