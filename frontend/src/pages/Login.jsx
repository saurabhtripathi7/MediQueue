import React, { useState } from "react";
import api from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, User, Eye, EyeOff, Loader2, 
  ArrowRight, ShieldCheck, Calendar, Sparkles
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("signup");
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    dob: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const springTransition = { type: "spring", stiffness: 400, damping: 30 };
  const todayISO = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = authMode === "signup" ? "/user/register" : "/user/login";
      const payload = authMode === "signup" ? formData : { email: formData.email, password: formData.password };
      const { data } = await api.post(endpoint, payload);
      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-50 dark:bg-[#0B0F1A]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-120"
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
            <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
                <Sparkles size={14} /> MediQueue Smart Access
            </motion.div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {authMode === "signup" ? "Join the Future" : "Welcome Back"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                Streamlining healthcare, one appointment at a time.
            </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          
          {/* Custom Tabs */}
          <div className="flex p-2 bg-slate-100/50 dark:bg-slate-800/50 m-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <button 
              onClick={() => setAuthMode("signup")}
              className={`relative flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === "signup" ? "text-blue-600 dark:text-white shadow-sm" : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              {authMode === "signup" && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl" />}
              <span className="relative z-10">Sign Up</span>
            </button>
            <button 
              onClick={() => setAuthMode("login")}
              className={`relative flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${authMode === "login" ? "text-blue-600 dark:text-white shadow-sm" : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              {authMode === "login" && <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl" />}
              <span className="relative z-10">Log In</span>
            </button>
          </div>

          <form onSubmit={onSubmitHandler} className="px-8 pb-10 space-y-5">
            <AnimatePresence mode="wait">
              {authMode === "signup" && (
                <motion.div 
                  key="signup"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <InputField 
                    label="Full Name" 
                    icon={<User size={18}/>} 
                    name="name" 
                    placeholder="Saurabh Tripathi" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                  <InputField 
                    label="Date of Birth" 
                    icon={<Calendar size={18}/>} 
                    name="dob" 
                    type="date" 
                    max={todayISO}
                    value={formData.dob} 
                    onChange={handleInputChange} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField 
              label="Email Address" 
              icon={<Mail size={18}/>} 
              name="email" 
              type="email" 
              placeholder="name@example.com" 
              value={formData.email} 
              onChange={handleInputChange} 
            />

            <div className="relative">
              <InputField 
                label="Password" 
                icon={<Lock size={18}/>} 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleInputChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3.5 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 dark:text-slate-400 font-bold">Or</span></div>
            </div>

            <button 
                type="button" 
                onClick={() => { setAuthMode("login"); setFormData({ email: "guest@example.com", password: "Guest@123", name: "", dob: "" }); }}
                className="w-full group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl flex justify-center items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-all"
            >
              <ShieldCheck size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" /> 
              Try Guest Demo
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Sub-component for Cleaner Code
const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.15em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        required
        className="w-full pl-12 pr-4 py-3.5 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
      />
    </div>
  </div>
);

export default Login;