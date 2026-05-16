import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/customer/tickets');
      setTickets(response.data.data);
      setLoading(false);
    } catch (error) {
      
      toast.error('Failed to load tickets. Please log in.');
      navigate('/login');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'text-gray-400';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-orange-500';
      case 'Urgent': return 'text-red-500 font-black';
      default: return 'text-gray-400';
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'All' || t.status === filter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">Support Tickets</h1>
            <p className="text-gray-500 mt-1">Manage your inquiries and support requests</p>
          </div>
          <Link
            to="/help/contact"
            className="inline-flex items-center justify-center space-x-2 bg-[#F97316] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#F97316]/20"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Ticket</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  filter === s ? 'bg-[#0F172A] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:border-[#F97316] outline-none text-sm w-full md:w-64"
            />
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(n => <div key={n} className="h-24 bg-white animate-pulse rounded-2xl border border-gray-100"></div>)
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/my-tickets/${ticket.id}`}
                className="block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#F97316]/30 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${getStatusColor(ticket.status).replace('text-', 'bg-').replace('100', '10')}`}>
                      <MessageSquare className={`w-6 h-6 ${getStatusColor(ticket.status).split(' ')[1]}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#F97316] transition-colors">{ticket.subject}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium">
                        <span className="flex items-center">
                          <AlertCircle className={`w-3.5 h-3.5 mr-1 ${getPriorityColor(ticket.priority)}`} />
                          {ticket.priority} Priority
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Last updated {new Date(ticket.updated_at).toLocaleDateString()}
                        </span>
                        <span>#{ticket.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end md:space-x-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                      <p className="text-xs font-bold text-gray-600">{ticket.category}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">You don't have any support tickets yet. If you have an issue, feel free to reach out to us!</p>
              <Link
                to="/help/contact"
                className="inline-flex items-center space-x-2 text-[#F97316] font-bold hover:underline"
              >
                <span>Submit your first ticket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
