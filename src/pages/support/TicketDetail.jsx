import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Send, 
  ChevronLeft, 
  Clock, 
  User, 
  ShieldCheck, 
  Paperclip, 
  MoreVertical, 
  CheckCircle2,
  Package,
  Info,
  ExternalLink,
  Lock,
  Flag
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function AgentTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data.data);
      setLoading(false);
    } catch (error) {
      
      toast.error('Could not load ticket');
      navigate('/support/dashboard');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await api.post(`/tickets/${id}/messages`, {
        message: newMessage,
        is_internal: isInternal
      });
      setNewMessage('');
      fetchTicket();
      toast.success(isInternal ? 'Internal note added' : 'Reply sent');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/tickets/${id}/status`, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTicket();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
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
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Left Column: Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-100 shadow-xl">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
              <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-[#F97316]" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="font-black text-[#0F172A] text-lg truncate max-w-md">{ticket.subject}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400 font-medium">
                <span>Ticket #{ticket.id}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{ticket.category}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Last update {new Date(ticket.updated_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              disabled={updatingStatus}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#F97316]/20 transition-all cursor-pointer"
              value={ticket.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
            >
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F8FAFC]/50">
          {/* Initial Message */}
          <div className="flex space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-[#0F172A] flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              {ticket.customer?.name?.[0]}
            </div>
            <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 max-w-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-[#0F172A]">{ticket.customer?.name}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(ticket.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          {/* Conversation History */}
          {ticket.messages.map((msg) => {
            const isMe = msg.user_id === localStorage.getItem('user_id'); // Agent's own message
            const isNote = msg.is_internal;
            const isCustomer = msg.user_id === ticket.customer_id;

            return (
              <div key={msg.id} className={`flex space-x-4 ${isCustomer ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 shadow-sm ${
                  isNote ? 'bg-yellow-500 text-white' : 
                  isCustomer ? 'bg-white border border-gray-200 text-[#0F172A]' : 'bg-[#0F172A] text-white'
                }`}>
                  {isNote ? <Lock className="w-4 h-4" /> : (msg.user?.name?.[0] || 'A')}
                </div>
                <div className={`p-6 rounded-3xl shadow-sm max-w-2xl ${
                  isNote ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-tr-none' :
                  isCustomer ? 'bg-white text-gray-600 border border-gray-100 rounded-tl-none' :
                  'bg-[#0F172A] text-white rounded-tr-none'
                }`}>
                  <div className={`flex items-center justify-between mb-2 ${isCustomer ? 'text-gray-400' : isNote ? 'text-yellow-600' : 'text-white/70'}`}>
                    <span className="font-black flex items-center">
                      {msg.user?.name}
                      {isNote && <span className="ml-2 text-[8px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded uppercase">Internal Note</span>}
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
        <footer className="bg-white border-t border-gray-100 p-6">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="flex items-center space-x-6 border-b border-gray-50 pb-4 mb-2">
              <button 
                type="button"
                onClick={() => setIsInternal(false)}
                className={`text-xs font-black uppercase tracking-widest pb-1 transition-all ${!isInternal ? 'text-[#F97316] border-b-2 border-[#F97316]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Reply to Customer
              </button>
              <button 
                type="button"
                onClick={() => setIsInternal(true)}
                className={`text-xs font-black uppercase tracking-widest pb-1 transition-all flex items-center ${isInternal ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Lock className="w-3 h-3 mr-1.5" />
                Internal Note
              </button>
            </div>

            <div className="relative">
              <textarea
                rows="3"
                className={`w-full pl-6 pr-20 py-4 rounded-3xl border outline-none transition-all resize-none font-medium text-gray-700 ${
                  isInternal ? 'bg-yellow-50 border-yellow-100 focus:bg-white focus:border-yellow-400' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-[#F97316]'
                }`}
                placeholder={isInternal ? "Add a private note only agents can see..." : "Type your reply to the customer..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className={`p-4 rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 ${
                    isInternal ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-200' : 'bg-[#F97316] hover:bg-[#ea6a0f] text-white shadow-orange-200'
                  }`}
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </footer>
      </div>

      {/* Right Column: Customer & Order Info */}
      <div className="w-96 bg-gray-50 overflow-y-auto hidden xl:block border-l border-gray-100">
        <div className="p-8 space-y-10">
          {/* Customer Profile */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Customer Profile</h3>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#0F172A] text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl shadow-[#0F172A]/20">
                {ticket.customer?.name?.[0]}
              </div>
              <h4 className="font-black text-[#0F172A] text-xl">{ticket.customer?.name}</h4>
              <p className="text-sm text-gray-400 font-medium mb-6">{ticket.customer?.email}</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Lifetime Value</p>
                  <p className="font-black text-[#F97316]">$1,240.50</p>
                </div>
                <div className="text-center border-l border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Orders</p>
                  <p className="font-black text-[#0F172A]">12</p>
                </div>
              </div>
            </div>
          </section>

          {/* Linked Order */}
          {ticket.order && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Linked Order</h3>
                <Link to={`/support/orders/${ticket.order.id}`} className="text-[#F97316] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
                  View Full <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400">Order ID</p>
                    <p className="font-black text-[#0F172A]">#{ticket.order.id}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                    {ticket.order.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {ticket.order.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 text-xs">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex-shrink-0"></div>
                      <div className="flex-1 truncate">
                        <p className="font-bold text-gray-700 truncate">{item.product?.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-[#0F172A]">${item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Order Total</span>
                  <span className="font-black text-[#F97316]">${ticket.order.grand_total}</span>
                </div>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center space-x-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#F97316] transition-all group">
                <Flag className="w-5 h-5 text-gray-400 group-hover:text-[#F97316]" />
                <span className="text-sm font-bold text-gray-700">Flag for Follow-up</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#F97316] transition-all group">
                <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-[#F97316]" />
                <span className="text-sm font-bold text-gray-700">Initiate Refund</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
