import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostBySlug } from '../../store/blogSlice';
import Header from '../../components/layout/Header';
import { Calendar, User, Clock, Share2, MessageCircle, ArrowLeft } from 'lucide-react';

const Facebook = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Twitter = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const Linkedin = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
import DOMPurify from 'dompurify';
import CommentSection from './CommentSection.jsx';

const BlogPostDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentPost, relatedPosts, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchPostBySlug(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} | ShopPro Blog`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', currentPost.excerpt || 'Read more about ' + currentPost.title);
      }
    }
    return () => {
      document.title = 'ShopPro | Premium E-commerce';
    };
  }, [currentPost]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!currentPost) return null;

  const sanitizedContent = DOMPurify.sanitize(currentPost.content);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      {/* Hero Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors mb-8">
            <ArrowLeft size={16} />
            <span>Back to Stories</span>
          </Link>
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase mb-6 w-fit tracking-widest">
            {currentPost.category?.name || 'Uncategorized'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
            {currentPost.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 mb-12">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                {currentPost.author?.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900">{currentPost.author?.name}</span>
                <span className="text-xs text-slate-400 font-medium">Author</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
              <Calendar size={18} className="text-slate-300" />
              <span>{new Date(currentPost.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-6">
              <Clock size={18} className="text-slate-300" />
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl">
          <img 
            src={currentPost.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200'} 
            className="w-full h-full object-cover"
            alt={currentPost.title}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-4 gap-12">
        {/* Social Sharing Sticky */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Share Story</p>
            {[
              { icon: <Facebook />, color: 'hover:text-[#1877F2]' },
              { icon: <Twitter />, color: 'hover:text-[#1DA1F2]' },
              { icon: <Linkedin />, color: 'hover:text-[#0A66C2]' },
              { icon: <MessageCircle />, color: 'hover:text-[#25D366]' },
            ].map((social, i) => (
              <button key={i} className={`w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-slate-100 text-slate-400 ${social.color} transition-all hover:shadow-lg hover:-translate-y-1`}>
                {React.cloneElement(social.icon, { size: 20 })}
              </button>
            ))}
          </div>
        </div>

        {/* Article Body */}
        <div className="lg:col-span-3">
          <div 
            className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
            {currentPost.tags?.map((tag) => (
              <Link key={tag.id} to={`/blog?tag=${tag.slug}`} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-500 border border-slate-100 hover:border-orange-500 hover:text-orange-500 transition-all">
                # {tag.name}
              </Link>
            ))}
          </div>

          <CommentSection 
            postId={currentPost.id} 
            comments={currentPost.root_approved_comments} 
            onCommentAdded={() => dispatch(fetchPostBySlug(slug))}
          />

          {/* Related Posts */}
          <div className="mt-24">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <span>Keep Reading</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.featured_image || 'https://placehold.co/400'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={post.title}
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-slate-900 group-hover:text-orange-500 transition-colors leading-tight">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
