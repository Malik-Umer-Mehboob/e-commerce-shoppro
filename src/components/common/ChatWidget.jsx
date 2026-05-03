import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, ShieldCheck, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'welcome', text: 'Hi! How can we help you today?', sender: 'agent', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to start a live chat');
      return;
    }
    setIsOpen(true);
    setIsMinimized(false);
    
    if (!sessionId) {
      try {
        const response = await axios.post(`${API_URL}/chat/start`, {}, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setSessionId(response.data.session_id);
      } catch (error) {
        
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date()
    };

    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate agent response after 1.5s
    setTimeout(() => {
      const agentMsg = {
        id: Date.now() + 1,
        text: "Thanks for your message! An agent will be with you shortly. For now, you can also check our Help Center.",
        sender: 'agent',
        time: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);
      setLoading(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleStartChat}
        className="fixed bottom-8 right-8 bg-[#0F172A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 group flex items-center space-x-2"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
          Chat with us
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-3xl shadow-2xl shadow-black/20 z-50 flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      {/* Header */}
      <header className="bg-[#0F172A] p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#F97316] rounded-xl flex items-center justify-center font-black">
            SP
          </div>
          <div>
            <h3 className="font-bold text-sm">ShopPro Support</h3>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {!isMinimized && (
        <>
          {/* Messages */}
          <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    isUser ? 'bg-[#F97316] text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-tl-none'
                  }`}>
                    <p className="font-medium">{msg.text}</p>
                    <p className={`text-[8px] mt-1 font-bold uppercase tracking-widest ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Footer */}
          <footer className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#F97316] outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-[#F97316] hover:scale-110 transition-transform disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[8px] text-center text-gray-400 mt-3 font-bold uppercase tracking-[0.2em]">
              Powered by ShopPro Support
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
