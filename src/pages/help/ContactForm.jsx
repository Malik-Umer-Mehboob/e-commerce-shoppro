import { useState } from 'react';
import { Send, User, Mail, MessageSquare, Paperclip, ChevronLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General Inquiry',
    message: '',
    attachment: null
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use centralized api instance which handles tokens automatically
      await api.post('/tickets', {
        subject: formData.subject,
        message: `[Contact Form Submission from ${formData.name}]\n\n${formData.message}`,
        category: formData.category,
      });

      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      
      toast.error('Failed to send message. Please log in first.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for reaching out. We've received your inquiry and our support team will get back to you shortly.
          </p>
          <Link
            to="/help"
            className="block w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Back to Help Center
          </Link>
        </div>
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

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="bg-[#0F172A] p-10 text-white">
            <h1 className="text-3xl font-extrabold mb-2">Get in touch</h1>
            <p className="text-gray-400">Have a question or need assistance? Send us a message and we'll help you out.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    required
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    required
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>General Inquiry</option>
                  <option>Order Issues</option>
                  <option>Product Questions</option>
                  <option>Returns & Refunds</option>
                  <option>Technical Issues</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  required
                  rows="5"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Attachment (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#F97316]/50 transition-colors cursor-pointer group">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#F97316]" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF up to 5MB</p>
                <input type="file" className="hidden" />
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 bg-[#F97316] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 active:translate-y-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
