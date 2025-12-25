import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2, UserCheck } from "lucide-react";

const Login = () => {
  // Access global context for API URL and Token management
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  
  // Controls the current view: either 'login' or 'signup'. 
  const [authMode, setAuthMode] = useState("signup"); 
  
  // Grouped form data into a single object for cleaner updates.
  // This replaces separate states for name, email, and password.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // UI states for loading indicators and password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- HANDLERS ---

  /**
   * Generic input handler.
   * Updates specific fields in the formData object based on the input's 'name' attribute.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Demo Login functionality for HR/Reviewers.
   * Automatically switches to 'login' mode and fills inputs with guest credentials.
   */
  const handleDemoLogin = () => {
    setAuthMode("login");
    setFormData({
      name: "", // Name is irrelevant for login
      email: "guest@example.com",
      password: "12345678"
    });
  };

  /**
   * Main Form Submission Handler.
   * Distinguishes between Registration and Login based on 'authMode'.
   */
  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent page reload
    setIsLoading(true);     // Start loading spinner

    try {
      if (authMode === "signup") {
        // --- REGISTER FLOW ---
        const { data } = await axios.post(backendUrl + "/api/user/register", formData);
        
        if (data.success) {
          localStorage.setItem("token", data.token); // Persist token
          setToken(data.token); // Update global context
        } else {
          toast.error(data.message);
        }

      } else {
        // --- LOGIN FLOW ---
        const { data } = await axios.post(backendUrl + "/api/user/login", {
            email: formData.email,
            password: formData.password
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Stop loading spinner regardless of success/fail
    }
  };

  // Redirect user to Home page if they are already logged in (token exists)
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // --- JSX RENDER ---
  return (
    // Outer container with responsive background colors
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-900 p-4 transition-colors duration-500">
      
      {/* Main Card with Entry Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md w-full max-w-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden"
      >
        <form onSubmit={onSubmitHandler} className="p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {authMode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Please {authMode === "signup" ? "sign up" : "log in"} to book an appointment
            </p>
          </div>

          <div className="flex flex-col gap-5">
            
            {/* Name Input - Conditionally Rendered 
              Only shows if authMode is 'signup'. 
              AnimatePresence handles the smooth slide up/down animation when it disappears.
            */}
            <AnimatePresence mode="popLayout">
              {authMode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      name="name" 
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      type="text"
                      placeholder="John Doe"
                      onChange={handleInputChange}
                      value={formData.name}
                      required={authMode === "signup"} // Only required if we are signing up
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  type="email"
                  placeholder="john@example.com"
                  onChange={handleInputChange}
                  value={formData.email}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  type={showPassword ? "text" : "password"} // Toggle input type based on state
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {/* Eye Icon Button to toggle visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              
              {/* Main Submit Button (Login or Create Account) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  authMode === "signup" ? "Create Account" : "Login"
                )}
              </button>

              {/* Guest / Demo Login Button */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                 <UserCheck className="w-4 h-4" /> Guest Login (HR Demo)
              </button>
            </div>
          </div>

          {/* Footer: Toggle between Login and Signup modes */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {authMode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="text-primary font-semibold hover:underline"
                >
                  Create one
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