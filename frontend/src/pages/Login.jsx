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
  UserCheck,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  /* =========================
     AUTH MODE
     ========================= */
  const [authMode, setAuthMode] = useState("signup");

  /* =========================
     FORM DATA
     ========================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* =========================
     UI STATES
     ========================= */
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* =========================
     INPUT HANDLER
     ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     DEMO LOGIN
     ========================= */
  const handleDemoLogin = () => {
    setAuthMode("login");
    setFormData({
      name: "",
      email: "guest@example.com",
      password: "12345678",
    });
  };

  /* =========================
     SUBMIT HANDLER
     ========================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "signup") {
        const { data } = await api.post("/user/register", formData);

        if (data.success) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await api.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });

        if (data.success) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     JSX
     ========================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl"
      >
        <form onSubmit={onSubmitHandler} className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">
              {authMode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Please {authMode === "signup" ? "sign up" : "log in"} to continue
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <AnimatePresence>
              {authMode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm font-medium mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 py-2.5 rounded-lg border"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 py-2.5 rounded-lg border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg"
            >
              {isLoading ? "Logging in..." : authMode === "signup" ? "Sign Up" : "Login"}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full border py-3 rounded-lg flex justify-center gap-2"
            >
              <UserCheck /> Guest Login
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            {authMode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button onClick={() => setAuthMode("login")} className="text-primary">
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <button onClick={() => setAuthMode("signup")} className="text-primary">
                  Sign up
                </button>
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
