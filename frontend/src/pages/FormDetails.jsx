import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFormById } from "../services/formService";
import { motion } from "framer-motion";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  ArrowLeft, 
  MessageSquare, 
  Calendar,
  AlertCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await getFormById(id);
        setForm(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to retrieve clinical data";
        toast.error(msg, {
          style: { borderRadius: '16px', background: '#292524', color: '#fff' }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2ede9]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Activity className="text-stone-400 w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2ede9] font-['Outfit'] text-stone-500">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <p>No clinical records found.</p>
        <Link to="/dashboard" className="mt-4 text-stone-900 font-bold underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] py-12 px-6 font-['Outfit',sans-serif]">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">Back</span>
          </Link>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={`/chat/form/${id}`}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl shadow-lg shadow-stone-200 text-sm font-bold transition-all"
            >
              <MessageSquare size={18} />
              Analyze with AI
            </Link>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-sm border border-stone-100 rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(100,80,60,0.08)]">
          
          <div className="mb-10">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Patient Record</span>
            <h1 className="text-3xl font-bold text-stone-900 mt-2">Clinical Vitals</h1>
            <div className="flex items-center gap-2 text-stone-400 mt-2 text-sm">
              <Calendar size={14} />
              {new Date(form.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vital Item */}
            <VitalCard icon={<Heart className="text-red-400" />} label="Heart Rate" value={`${form.heartRate} BPM`} />
            <VitalCard icon={<Droplets className="text-blue-400" />} label="SpO2 Level" value={`${form.spo2}%`} />
            <VitalCard icon={<Thermometer className="text-orange-400" />} label="Temperature" value={`${form.temperature}°C`} />
            <VitalCard icon={<Activity className="text-emerald-400" />} label="Blood Pressure" value={`${form.bloodPressure?.systolic}/${form.bloodPressure?.diastolic}`} />
          </div>

          {/* Diagnostic Context Section */}
          <div className="mt-10 pt-8 border-t border-stone-50">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Diagnostic Focus</h3>
            <div className="inline-block px-4 py-2 bg-stone-100 rounded-xl text-stone-700 font-bold text-sm">
              {form.problemArea.charAt(0).toUpperCase() + form.problemArea.slice(1)} Path
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
          Confidential Medical Record • Verified Encryption
        </p>
      </motion.div>
    </div>
  );
}

// Reusable Inner Component for Vitals
function VitalCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-stone-50/50 border border-stone-100 rounded-3xl transition-hover hover:bg-stone-50">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{label}</p>
        <p className="text-lg font-bold text-stone-900">{value}</p>
      </div>
    </div>
  );
}