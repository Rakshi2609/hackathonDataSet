import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendFormChatMessage,
  getFormChatHistory,
  clearFormChatHistory,
} from "../services/chatService";
import { getFormById } from "../services/formService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Trash2, 
  ArrowLeft, 
  Activity, 
  User, 
  Bot, 
  ChevronLeft 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FormChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [formRes, chatRes] = await Promise.all([
          getFormById(id),
          getFormChatHistory(id),
        ]);
        setForm(formRes.data.data);
        setMessages(chatRes.data.messages || []);
      } catch (err) {
        toast.error("Error synchronizing history");
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    setLoading(true);
    try {
      const res = await sendFormChatMessage(id, userMessage);
      setMessages(res.data.chatHistory);
    } catch (err) {
      toast.error("Consultant is busy. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Delete this consultation history?")) return;
    try {
      await clearFormChatHistory(id);
      setMessages([]);
      toast.success("History Cleared");
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f2ede9] font-['Outfit',sans-serif]">
      <Toaster position="top-center" />

      {/* --- CHAT HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/form/${id}`)}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900 leading-none">Health Consultant</h1>
            {form && (
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                Analyzing: {form.problemArea} case
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40"
            >
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center">
                <Activity size={32} className="text-stone-400" />
              </div>
              <p className="max-w-xs text-sm font-medium text-stone-500">
                Data loaded. I'm ready to discuss your vitals and symptoms.
              </p>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-stone-900" : "bg-white border border-stone-200"
                  }`}>
                    {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-blue-500" />}
                  </div>

                  {/* Bubble */}
                  <div className={`px-5 py-3.5 rounded-[24px] shadow-sm text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-stone-900 text-white rounded-tr-none" 
                      : "bg-white text-stone-800 border border-stone-100 rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center">
                <Bot size={14} className="text-blue-500" />
             </div>
             <div className="bg-white border border-stone-100 px-5 py-3 rounded-[24px] rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <footer className="p-4 md:p-8 bg-gradient-to-t from-[#f2ede9] via-[#f2ede9] to-transparent">
        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-white border border-stone-100 p-2 rounded-[28px] shadow-[0_10px_30px_-5px_rgba(100,80,60,0.1)] transition-all focus-within:border-stone-400">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Discuss your metrics..."
            className="flex-1 px-4 py-3 bg-transparent text-stone-900 placeholder-stone-400 outline-none font-medium text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-stone-900 text-white rounded-[20px] hover:bg-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[9px] text-stone-400 font-bold tracking-[0.2em] mt-4 uppercase">
           AI Insights are not medical prescriptions
        </p>
      </footer>
    </div>
  );
}