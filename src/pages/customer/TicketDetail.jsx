import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Send, ChevronLeft, Clock, User, ShieldCheck, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${API_URL}/tickets/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTicket(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Could not load ticket');
      navigate('/customer/tickets');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await axios.post(`${API_URL}/tickets/${id}/messages`, {
        message: newMessage,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewMessage('');
      fetchTicket();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/customer/tickets" className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
              <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-[#F97316]" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-[#0F172A] text-lg truncate max-w-[200px] sm:max-w-md">{ticket.subject}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Ticket #{ticket.id} • {ticket.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {ticket.status === 'Resolved' && (
              <div className="flex items-center bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-100">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Resolved
              </div>
            )}
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6 overflow-y-auto">
        {/* Initial Message */}
        <div className="flex space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold flex-shrink-0">
            {ticket.customer.name[0]}
          </div>
          <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#0F172A]">{ticket.customer.name}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
          </div>
        </div>

        {/* Conversation */}
        {ticket.messages.map((msg) => {
          if (msg.is_internal) return null; // Hide internal notes from customer
          
          const isMe = msg.user_id === ticket.customer_id;
          const isAgent = msg.user?.role === 'support' || msg.user?.role === 'admin';

          return (
            <div key={msg.id} className={`flex space-x-4 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${isMe ? 'bg-[#F97316] text-white' : 'bg-blue-600 text-white'}`}>
                {isAgent ? <ShieldCheck className="w-5 h-5" /> : (msg.user?.name?.[0] || 'U')}
              </div>
              <div className={`p-6 rounded-3xl shadow-sm border border-gray-100 max-w-2xl ${
                isMe ? 'bg-[#F97316] text-white rounded-tr-none border-[#F97316]/10' : 'bg-white text-gray-600 rounded-tl-none'
              }`}>
                <div className={`flex items-center justify-between mb-2 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                  <span className={`font-bold ${isMe ? 'text-white' : 'text-[#0F172A]'}`}>
                    {isAgent ? 'Support Agent' : msg.user?.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-100 p-4 md:p-6 sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          {ticket.status === 'Closed' ? (
            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-200">
              <p className="text-gray-500 font-bold">This ticket is closed. Please create a new ticket if you still need help.</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="relative group">
              <textarea
                rows="1"
                className="w-full pl-6 pr-24 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/5 outline-none transition-all resize-none font-medium text-gray-700"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              ></textarea>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button type="button" className="p-2 text-gray-400 hover:text-[#F97316] transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className={`p-3 bg-[#0F172A] text-white rounded-2xl hover:bg-black transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          )}
          <p className="text-[10px] text-gray-400 font-bold text-center mt-3 uppercase tracking-widest">
            Always maintain respectful communication with our support team.
          </p>
        </div>
      </footer>
    </div>
  );
}
