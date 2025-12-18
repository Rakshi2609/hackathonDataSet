import { useEffect, useState } from "react";
import { getMyForms } from "../services/formService";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  MessageSquare, 
  ChevronRight, 
  Plus, 
  Clock, 
  ClipboardList 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AllForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyForms();
        setForms(res.data.data);
      } catch (err) {
        toast.error("Could not sync records", {
          style: { borderRadius: '16px', background: '#292524', color: '#fff' }
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] py-12 px-6 font-['Outfit',sans-serif]">
      <Toaster position="top-center" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Patient Records</span>
            <h1 className="text-4xl font-bold text-stone-900 mt-1">Submissions</h1>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/submit-form" // Update this route to your actual submission path
              className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-lg shadow-stone-200 text-sm font-bold"
            >
              <Plus size={18} />
              New Entry
            </Link>
          </motion.div>
        </div>

        {/* Records Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Activity className="text-stone-300 w-8 h-8" />
            </motion.div>
          </div>
        ) : forms.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-stone-200 rounded-[32px] p-16 text-center">
            <ClipboardList className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 font-medium tracking-tight">Your clinical history is empty.</p>
            <Link to="/submit-form" className="text-blue-600 font-bold text-sm mt-2 inline-block underline underline-offset-4">
              Submit your first form
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form, index) => (
              <motion.div
                key={form._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/95 backdrop-blur-sm border border-stone-100 p-6 rounded-[28px] shadow-[0_10px_30px_-15px_rgba(100,80,60,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(100,80,60,0.1)] transition-all flex justify-between items-center"
              >
                <Link to={`/form/${form._id}`} className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <h3 className="font-bold text-stone-900 text-lg capitalize leading-none">
                      {form.problemArea} Analysis
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
                    <Clock size={12} />
                    {new Date(form.createdAt).toLocaleString(undefined, { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    })}
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/chat/form/${form._id}`}
                    className="p-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center"
                    title="Chat with AI"
                  >
                    <MessageSquare size={18} />
                  </Link>
                  
                  <Link 
                    to={`/form/${form._id}`}
                    className="p-3 bg-stone-50 text-stone-400 rounded-xl group-hover:text-stone-900 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
            Certified Patient Management Interface
          </p>
        </div>
      </div>
    </div>
  );
}