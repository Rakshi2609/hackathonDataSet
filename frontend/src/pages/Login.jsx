import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f3ede8] px-4 md:px-0 relative overflow-hidden">

      {/* Soft background blob */}
      <div className="absolute top-[-15%] right-[-10%] w-[420px] h-[420px] bg-stone-300/30 rounded-full blur-[110px] opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-[0_25px_50px_-12px_rgba(50,35,20,0.1)] rounded-[32px] p-8 sm:p-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-5">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900">Staff Login</h2>
            <p className="text-stone-500 text-sm mt-2">Welcome to the Care Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                placeholder="Official Email"
                onChange={handleChange}
                className="w-full px-6 py-4 bg-stone-100 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 transition-all outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Access Code"
                onChange={handleChange}
                className="w-full px-6 py-4 bg-stone-100 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:border-stone-400 transition-all outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot"
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 uppercase tracking-widest"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 font-semibold rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Enter Workspace"}
              <ArrowRight size={18} />
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-stone-200 text-center">
            <Link to="/register" className="text-sm text-stone-600 hover:text-stone-900">
              New practitioner?{" "}
              <span className="underline decoration-stone-300">Request Access</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
