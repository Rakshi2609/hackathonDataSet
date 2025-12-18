import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Calendar, Phone, ArrowRight, Activity, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, dob: new Date(form.dob) };
      await registerUser(payload);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Matching the Warm Stone/Almond background
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f2ede9] relative overflow-hidden font-['Outfit',sans-serif] py-12">
      
      {/* Organic subtle shapes */}
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-stone-200/40 rounded-full blur-3xl opacity-30"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[460px] px-6"
      >
        <div className="bg-white/95 backdrop-blur-sm shadow-[0_30px_60px_-15px_rgba(100,80,60,0.1)] border border-stone-100 rounded-[40px] p-10">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-900 rounded-full mb-4">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Create Account</h2>
            <p className="text-stone-500 mt-2 text-sm font-medium">Join the Medical Practitioner Network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-stone-100/50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Official Email"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-stone-100/50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 outline-none transition-all"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Secure Access Code"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-stone-100/50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Row: DOB and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="date"
                  name="dob"
                  required
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-stone-100/50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:bg-white focus:border-stone-400 outline-none transition-all"
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  required
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 bg-stone-100/50 border border-stone-200 rounded-2xl text-stone-900 text-sm focus:bg-white focus:border-stone-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-stone-200 hover:bg-black transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Creating Account..." : "Confirm Registration"}
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-50 text-center">
            <p className="text-sm text-stone-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-stone-900 font-bold underline decoration-stone-300 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}