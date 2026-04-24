import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  User, 
  CheckCircle2,
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function AgentTicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    priority: 'All'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.priority !== 'All') params.priority = filters.priority;

      const response = await axios.get(`${API_URL}/tickets`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTickets(response.data.data);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Tickets Management</h1>
          <p className="text-gray-500 text-sm">View and resolve customer inquiries</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-200 p-2 rounded-xl text-gray-500 hover:text-[#F97316] transition-colors">
            <ArrowUpDown className="w-5 h-5" />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, customer..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#F97316] text-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Filters:</span>
        </div>
        
        <select 
          className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-2 focus:ring-[#F97316]/20"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option>All Status</option>
          <option>Open</option>
          <option>Pending</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>

        <select 
          className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-2 focus:ring-[#F97316]/20"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="All">All Categories</option>
          <option>Order Issues</option>
          <option>Product Questions</option>
          <option>Returns & Refunds</option>
          <option>Technical Issues</option>
          <option>General Inquiry</option>
        </select>

        <select 
          className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 font-medium outline-none focus:ring-2 focus:ring-[#F97316]/20"
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="All">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </select>

        <button 
          onClick={() => setFilters({status: 'All', category: 'All', priority: 'All'})}
          className="text-xs font-bold text-[#F97316] hover:underline ml-auto"
        >
          Clear All
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Ticket</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Last Update</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-6 h-16 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/support/tickets/${ticket.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0F172A]/5 flex items-center justify-center text-[#0F172A] group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-[#F97316] transition-colors">{ticket.subject}</p>
                          <p className="text-[10px] text-gray-400 font-mono">#{ticket.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                          {ticket.customer?.name?.[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{ticket.customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-500">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(ticket.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
