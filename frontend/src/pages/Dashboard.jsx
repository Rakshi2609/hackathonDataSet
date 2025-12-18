import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  FilePlus, 
  ClipboardList, 
  MessageSquare, 
  LogOut, 
  User, 
  ChevronRight,
  Shield
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#f2ede9] font-['Outfit',sans-serif] p-6 md:p-12 relative overflow-hidden">
      
      {/* Decorative organic background element */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-stone-200/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- TOP BAR --- */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center shadow-lg shadow-stone-300">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-stone-900 uppercase tracking-widest text-xs">Vitals Hub</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white text-stone-500 hover:text-red-600 rounded-xl border border-stone-200 transition-all text-sm font-bold"
          >
            <LogOut size={16} />
            Exit Portal
          </motion.button>
        </header>

        {/* --- WELCOME SECTION --- */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              Welcome back, <br /> 
              <span className="text-stone-400">Dr. {user?.name?.split(' ')[0]}</span>
            </h1>
            <div className="flex items-center gap-2 mt-4 text-stone-500 font-medium">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-xs uppercase tracking-widest">Active Secure Session</span>
            </div>
          </motion.div>
        </section>

        {/* --- ACTION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <DashboardCard 
            to="/create-form"
            icon={<FilePlus className="text-blue-500" />}
            title="New Assessment"
            description="Log new patient vitals and symptoms"
            color="bg-blue-50"
          />

          <DashboardCard 
            to="/forms"
            icon={<ClipboardList className="text-emerald-500" />}
            title="Patient Records"
            description="Review clinical history and vitals"
            color="bg-emerald-50"
          />

          <DashboardCard 
            to="/chat"
            icon={<MessageSquare className="text-purple-500" />}
            title="AI Consultant"
            description="Discuss diagnostic insights with AI"
            color="bg-purple-50"
          />

        </div>

        {/* --- FOOTER INFO --- */}
        <footer className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase">
            Clinic OS v2.0 • HIPAA Compliant Environment
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Systems Online</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Reusable Navigation Card
function DashboardCard({ to, icon, title, description, color }) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={to} className="block h-full">
        <div className="bg-white/80 backdrop-blur-sm border border-stone-100 p-8 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(100,80,60,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(100,80,60,0.12)] transition-all flex flex-col h-full">
          <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
            {icon}
          </div>
          
          <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
          <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          <div className="flex items-center gap-2 text-stone-900 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
            Access <ChevronRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}