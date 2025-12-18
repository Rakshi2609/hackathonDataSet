import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFormById } from "../services/formService";
import { motion } from "framer-motion";
import { 
  Activity, Heart, Thermometer, Droplets, ArrowLeft, 
  MessageSquare, Calendar, ImageIcon, Camera, AlertCircle, ShieldCheck
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated helper to handle Windows paths and point to your Node server
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
  };

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await getFormById(id);
        setForm(res.data.data);
      } catch (err) {
        toast.error("Error loading clinical record");
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2ede9]">
      <Activity className="animate-spin text-stone-400" />
    </div>
  );
  
  if (!form) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2ede9]">
      <AlertCircle className="text-stone-300 w-12 h-12 mb-4" />
      <p className="font-bold text-stone-500">Record not found.</p>
      <Link to="/forms" className="mt-4 text-stone-900 underline">Back to List</Link>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] py-12 px-6 font-['Outfit',sans-serif]">
      <Toaster position="top-center" />
      
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/forms" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold transition-all">
            <ArrowLeft size={18} /> BACK
          </Link>
          <Link to={`/chat/form/${id}`} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl shadow-lg font-bold text-sm">
            <MessageSquare size={18} /> CONSULT AI
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-stone-100 rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(100,80,60,0.08)]">
          
          <div className="mb-10 text-center">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Patient Record</span>
            <h1 className="text-3xl font-bold text-stone-900 mt-2">
                {form.imageUrl ? "Visual Assessment" : "Vital Statistics"}
            </h1>
            <p className="text-stone-400 text-sm mt-1">{new Date(form.createdAt).toDateString()}</p>
          </div>

          {/* --- AI PREDICTION RESULT (Shows at the top if available) --- */}
          {form.result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-8 p-6 rounded-[32px] border-2 flex items-start gap-4 ${
                form.result.includes("HIGH") 
                  ? "bg-red-50 border-red-100 text-red-700" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              <div className={`p-3 rounded-2xl ${form.result.includes("HIGH") ? "bg-red-500" : "bg-emerald-500"}`}>
                <Activity size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">AI Diagnostic Insight</h3>
                <p className="text-lg font-bold leading-tight">{form.result}</p>
                <p className="text-[10px] mt-2 italic opacity-60">*Automated screening for clinical reference.</p>
              </div>
            </motion.div>
          )}

          {/* --- CONDITIONAL CONTENT --- */}
          {form.imageUrl ? (
            /* IF IMAGE EXISTS: Show only Type and Photo */
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 py-3 bg-stone-50 rounded-2xl border border-stone-100">
                <Camera size={18} className="text-stone-400" />
                <span className="text-sm font-bold text-stone-700 uppercase tracking-widest">
                  Type: {form.bodyPart || "General Clinical Photo"}
                </span>
              </div>
              
              <div className="rounded-[32px] overflow-hidden border-8 border-white shadow-2xl bg-stone-100">
                <img 
                  src={getFullImageUrl(form.imageUrl)} 
                  alt="Clinical analysis" 
                  className="w-full h-auto object-cover max-h-[500px]"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=Image+Load+Error"; }}
                />
              </div>
            </div>
          ) : (
            /* IF NO IMAGE: Show the Vitals (SPO2, Heart Rate, etc) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VitalCard icon={<Heart className="text-red-400" />} label="Heart Rate" value={`${form.heartRate} BPM`} />
              <VitalCard icon={<Droplets className="text-blue-400" />} label="SpO2 Level" value={`${form.spo2}%`} />
              <VitalCard icon={<Thermometer className="text-orange-400" />} label="Temperature" value={`${form.temperature}°C`} />
              <VitalCard icon={<Activity className="text-emerald-400" />} label="Blood Pressure" value={`${form.bloodPressure?.systolic}/${form.bloodPressure?.diastolic}`} />
            </div>
          )}

          {/* Bottom Diagnostic Context */}
          <div className="mt-12 pt-8 border-t border-stone-50 flex flex-col items-center">
            <h3 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-4">Diagnostic Path</h3>
            <div className="inline-block px-6 py-2 bg-stone-900 text-white rounded-full font-bold text-xs uppercase tracking-tighter">
              {form.problemArea} Analysis
            </div>
            <div className="mt-6 flex items-center gap-2 text-stone-400 text-[9px] font-bold tracking-widest uppercase">
               <ShieldCheck size={12}/> Verified Clinical Session
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function VitalCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-stone-50/50 border border-stone-100 rounded-3xl transition-all hover:bg-stone-50">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{label}</p>
        <p className="text-xl font-bold text-stone-900">{value}</p>
      </div>
    </div>
  );
}