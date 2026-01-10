import React, { useState } from "react";
import api from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, User, Eye, EyeOff, Loader2, 
  ArrowRight, ShieldCheck 
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("signup");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const springTransition = { type: "spring", stiffness: 300, damping: 30 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = authMode === "signup" ? "/user/register" : "/user/login";
      const { data } = await api.post(endpoint, authMode === "signup" ? formData : { email: formData.email, password: formData.password });
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decorative Auras (Subtle branding) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-110 z-10"
      >
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 p-2 overflow-hidden">
          
          {/* AUTH MODE TOGGLE (Pill Switcher) */}
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-950 rounded-full mb-6 relative">
            <motion.div
              layoutId="tab-bg"
              className="absolute inset-y-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-200 dark:border-slate-700"
              style={{ width: "calc(50% - 6px)", left: authMode === "signup" ? "6px" : "50%" }}
              transition={springTransition}
            />
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${authMode === "signup" ? "text-primary" : "text-slate-500 hover:text-slate-700"}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-3 text-sm font-bold z-10 transition-colors ${authMode === "login" ? "text-primary" : "text-slate-500 hover:text-slate-700"}`}
            >
              Log In
            </button>
          </div>

          <form onSubmit={onSubmitHandler} className="px-6 pb-8 pt-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {authMode === "signup" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                Access your MediQueue health dashboard
              </p>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {authMode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                    <div className="group relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={authMode === "signup"}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                        placeholder="e.g. Saurabh Tripathi"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-slate-900 dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {authMode === "signup" ? "Get Started" : "Enter Dashboard"}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3">or quick access</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setFormData({ email: "guest@example.com", password: "Guest@123" });
                }}
                className="w-full border-2 border-slate-100 dark:border-slate-800 py-3.5 rounded-2xl flex justify-center items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ShieldCheck size={30} className="text-green-600" /> Guest Session (For Demo)
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;