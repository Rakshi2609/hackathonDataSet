import { useState, useEffect, useRef } from "react";
import {
  sendMainChatMessage,
  getMainChatHistory,
  clearMainChatHistory,
} from "../services/chatService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Trash2, 
  Activity, 
  User, 
  Bot, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MainChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await getMainChatHistory();
        setMessages(res.data.messages || []);
      } catch (err) {
        toast.error("Connection sync failed");
      }
    }
    loadHistory();
  }, []);

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
      const res = await sendMainChatMessage(userMessage);
      setMessages(res.data.chatHistory);
    } catch (err) {
      toast.error("AI service interrupted");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the medical server. Please check your network.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Wipe general chat history?")) return;
    try {
      await clearMainChatHistory();
      setMessages([]);
      toast.success("History Reset");
    } catch (err) {
      toast.error("Clear operation failed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f2ede9] font-['Outfit',sans-serif]">
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg shadow-stone-200">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 leading-none">Health Assistant</h1>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Medical LLM Active</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
          title="Clear History"
        >
          <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </header>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 scrollbar-hide">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-stone-100">
                <Sparkles size={32} className="text-blue-500" />
              </div>
              <div className="max-w-xs">
                 <h2 className="text-xl font-bold text-stone-900 mb-2">Welcome, Doctor</h2>
                 <p className="text-sm font-medium text-stone-500 leading-relaxed">
                   How can I assist you today? I can help with wellness trends, general diagnostic advice, or nutrition insights.
                 </p>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user" ? "bg-stone-900" : "bg-white border border-stone-100"
                  }`}>
                    {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-600" />}
                  </div>

                  {/* Bubble */}
                  <div className={`px-6 py-4 rounded-[28px] shadow-sm text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-stone-900 text-white rounded-tr-none" 
                      : "bg-white text-stone-800 border border-stone-100 rounded-tl-none shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start items-center gap-4">
             <div className="w-9 h-9 rounded-xl bg-white border border-stone-100 flex items-center justify-center">
                <Bot size={16} className="text-blue-600" />
             </div>
             <div className="bg-white border border-stone-100 px-6 py-4 rounded-[28px] rounded-tl-none">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-stone-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-stone-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-stone-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT FOOTER --- */}
      <footer className="px-4 md:px-8 pb-8 pt-2 bg-gradient-to-t from-[#f2ede9] via-[#f2ede9] to-transparent">
        <div className="max-w-4xl mx-auto flex gap-3 items-center bg-white border border-stone-100 p-2.5 rounded-[32px] shadow-[0_20px_50px_-10px_rgba(100,80,60,0.15)] transition-all focus-within:border-stone-400">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything about health and wellness..."
            className="flex-1 px-5 py-3.5 bg-transparent text-stone-900 placeholder-stone-400 outline-none font-medium text-sm"
            disabled={loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-4 bg-stone-900 text-white rounded-[24px] hover:bg-black transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-lg shadow-stone-200"
          >
            <Send size={20} />
          </motion.button>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6 opacity-30 grayscale pointer-events-none">
           <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black tracking-widest uppercase">Encrypted</span>
           </div>
           <div className="w-1 h-1 rounded-full bg-stone-400" />
           <span className="text-[10px] font-black tracking-widest uppercase tracking-[0.3em]">HealthSync AI</span>
        </div>
      </footer>
    </div>
  );
}