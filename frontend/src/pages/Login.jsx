import React, { useState } from "react";
import api from "../api/axiosInstance.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("signup");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint =
        authMode === "signup" ? "/user/register" : "/user/login";

      const payload =
        authMode === "signup"
          ? formData
          : {
              email: formData.email,
              password: formData.password,
            };

      const { data } = await api.post(endpoint, payload);

      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6">
          {/* MODE SWITCH */}
          <div className="flex mb-6 bg-slate-100 dark:bg-slate-800 rounded-full">
            <button
              className={`flex-1 py-3 font-bold rounded-full ${
                authMode === "signup"
                  ? "bg-primary text-white"
                  : "text-slate-600"
              }`}
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </button>
            <button
              className={`flex-1 py-3 font-bold rounded-full ${
                authMode === "login"
                  ? "bg-primary text-white"
                  : "text-slate-600"
              }`}
              onClick={() => setAuthMode("login")}
            >
              Log In
            </button>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* NAME */}
            <AnimatePresence>
              {authMode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 py-3 rounded-xl border"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DOB */}
            <AnimatePresence>
              {authMode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm font-semibold">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                    className="w-full py-3 px-4 rounded-xl border"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 py-3 rounded-xl border"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {authMode === "signup" ? "Create Account" : "Login"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* GUEST LOGIN */}
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setFormData({
                  name: "",
                  email: "guest@example.com",
                  password: "Guest@123",
                  dob: "",
                });
              }}
              className="w-full border py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              <ShieldCheck className="text-green-600" />
              Guest Session
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
