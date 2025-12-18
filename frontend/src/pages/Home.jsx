import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldCheck, 
  HeartPulse, 
  Sparkles, 
  ArrowRight, 
  Database, 
  Stethoscope, 
  Microscope,
  BrainCircuit
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f2ede9] font-['Outfit',sans-serif] relative overflow-x-hidden pt-20 pb-12 px-6">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-stone-200 rounded-full mb-8 shadow-sm">
            <Sparkles className="text-blue-500 w-4 h-4" />
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Next-Gen Clinical Portal</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold text-stone-900 tracking-tight leading-[1.05] mb-8">
            Precision Health <br /> 
            <span className="text-stone-400 font-medium italic font-serif">Begins with Data.</span>
          </h1>

          <p className="text-stone-500 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The unified medical workspace for clinical vitals tracking, multi-step symptom analysis, 
            and AI-driven diagnostic consultations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login" className="px-10 py-5 bg-stone-900 text-white rounded-[24px] font-bold shadow-xl shadow-stone-300 flex items-center gap-2 hover:bg-black transition-all">
              Enter Workspace <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register" className="px-10 py-5 bg-white border border-stone-200 text-stone-900 rounded-[24px] font-bold hover:bg-stone-50 transition-all">
              New Practitioner
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- SPECIALTY GRID --- */}
      <section className="max-w-6xl mx-auto mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Core Specialties</h2>
          <p className="text-3xl font-bold text-stone-800 tracking-tight">Diagnostic Coverage</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Cardiology', 'Respiratory', 'Dermatology', 'Diabetes', 'ENT'].map((item, i) => (
            <motion.div 
              key={item}
              whileHover={{ y: -5 }}
              className="bg-white/60 border border-stone-200 p-6 rounded-[28px] text-center"
            >
              <div className="w-10 h-10 bg-stone-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-stone-400" />
              </div>
              <span className="font-bold text-stone-800 text-sm tracking-tight">{item}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PLATFORM CAPABILITIES --- */}
      <section className="max-w-6xl mx-auto mb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <FeatureCard 
            icon={<HeartPulse className="text-red-400" />}
            title="Vital Sync"
            text="Capture Heart Rate, SpO2, Temperature, and Blood Pressure in a high-fidelity medical interface."
          />
          
          <FeatureCard 
            icon={<BrainCircuit className="text-blue-400" />}
            title="Mistral AI Analysis"
            text="Consult with our specialized Health Assistant to interpret vitals and receive diagnostic possibilities."
          />
          
          <FeatureCard 
            icon={<Database className="text-emerald-400" />}
            title="Clinical History"
            text="Securely store and retrieve past reports with end-to-end encrypted medical record management."
          />

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-6xl mx-auto pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-stone-900" />
          <span className="font-black text-[10px] uppercase tracking-widest">Clinic OS v2.0</span>
        </div>
        
        <div className="flex gap-8">
          <div className="flex items-center gap-2 grayscale font-bold text-[9px] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> ISO 27001 Secure
          </div>
          <div className="flex items-center gap-2 grayscale font-bold text-[9px] uppercase tracking-widest">
            <Microscope className="w-4 h-4" /> HIPAA Compliant
          </div>
        </div>
      </footer>

      {/* Organic Background Elements */}
      <div className="fixed top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-stone-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] bg-blue-100/20 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white p-10 rounded-[40px] border border-stone-100 shadow-[0_20px_40px_-15px_rgba(100,80,60,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(100,80,60,0.12)] transition-all">
      <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-8">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-stone-900 mb-4">{title}</h3>
      <p className="text-stone-500 text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );
}