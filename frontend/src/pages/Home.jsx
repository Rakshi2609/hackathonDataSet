import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, HeartPulse, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f2ede9] font-['Outfit',sans-serif] relative overflow-hidden flex flex-col justify-center items-center p-6 text-center">
      
      {/* Decorative organic background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-stone-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-stone-200 rounded-full mb-8 shadow-sm">
          <Sparkles className="text-blue-500 w-4 h-4" />
          <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Next-Gen Patient Care</span>
        </div>

        {/* Main Hero Text */}
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
          Precision Health <br /> 
          <span className="text-stone-400">Begins with Data.</span>
        </h1>

        <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          The unified portal for clinical vitals tracking, symptom analysis, 
          and AI-driven diagnostic insights.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/login"
              className="px-10 py-4 bg-stone-900 text-white rounded-[24px] font-bold shadow-xl shadow-stone-300 flex items-center gap-2 group transition-all"
            >
              Enter Workspace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register"
              className="px-10 py-4 bg-white border border-stone-200 text-stone-900 rounded-[24px] font-bold hover:bg-stone-50 transition-all"
            >
              New Practitioner
            </Link>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-stone-200/60 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2 grayscale opacity-60">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-widest">ISO 27001 Secure</span>
          </div>
          <div className="flex flex-col items-center gap-2 grayscale opacity-60">
            <HeartPulse className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-widest">Real-time Vitals</span>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2 grayscale opacity-60">
            <Activity className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-widest">Clinical AI</span>
          </div>
        </div>
      </motion.div>

      {/* Subtle Bottom Footer */}
      <p className="absolute bottom-8 text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em] opacity-50">
        Clinical OS • Verified Practitioner Environment
      </p>
    </div>
  );
}