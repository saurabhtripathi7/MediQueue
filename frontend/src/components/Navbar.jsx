import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';
// Added Calendar and LogOut icons
import { Menu, X, Home, Users, Info, Phone, ChevronRight, User, Calendar, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // 1. New State for Desktop/Tablet Dropdown (Fixes "Hover" issue on touch devices)
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    setToken(false);
    navigate("/login");
    setShowMenu(false);
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* LOGO */}
      <img 
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="MediQueue"
        className="mx-2 h-10 w-auto shrink-0 object-contain cursor-pointer bg-white rounded-md p-1"
      />
      
      {/* DESKTOP MENU */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/"><li className="py-1">HOME</li></NavLink>
        <NavLink to="/doctors"><li className="py-1">ALL DOCTORS</li></NavLink>
        <NavLink to="/about"><li className="py-1">ABOUT</li></NavLink>
        <NavLink to="/contact"><li className="py-1">CONTACT</li></NavLink>
      </ul>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-4">
        
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token ? (
          // 2. DESKTOP PROFILE (Hidden on Mobile, Visible on Tablet/Desktop)
          // Using onClick/onMouseEnter combination supports both Mouse and Touch
          <div 
            className="hidden md:flex items-center gap-2 cursor-pointer relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="pfp" />
            <img className="w-2.5 dark:invert" src={assets.dropdown_icon} alt="icon" />

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-0 right-0 pt-14 z-20"
                >
                  <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md shadow-lg min-w-48 border dark:border-gray-700 overflow-hidden">
                    <p onClick={() => navigate("my-profile")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                      <User size={16} /> My Profile
                    </p>
                    <p onClick={() => navigate("my-appointments")} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                      <Calendar size={16} /> Appointments
                    </p>
                    <p onClick={logout} className="px-4 py-2 hover:bg-red-50 text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-2 border-t dark:border-gray-700">
                      <LogOut size={16} /> Logout
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-6 py-2 rounded-full hidden md:block transition-all hover:bg-secondary hover:shadow-lg"
          >
            Create account
          </button>
        )}

        {/* MOBILE MENU TRIGGER */}
        <button 
          onClick={() => setShowMenu(true)} 
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* 3. MOBILE DRAWER (Now includes Profile Actions) */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl md:hidden border-l border-gray-100 dark:border-gray-800 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                 <div className="flex items-center gap-3">
                    {/* Show User Avatar in Drawer Header if Logged In */}
                    {token ? (
                       <div className="flex items-center gap-2">
                          <img src={assets.profile_pic} alt="User" className="w-10 h-10 rounded-full border border-gray-200" />
                          <div>
                             <p className="text-sm font-semibold dark:text-white">Hello, User</p>
                             <p className="text-xs text-gray-500">Welcome back</p>
                          </div>
                       </div>
                    ) : (
                       <img src={assets.logo} alt="Logo" className="w-24 object-contain" />
                    )}
                 </div>
                <button onClick={() => setShowMenu(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-1 p-4">
                  {[
                    { path: "/", label: "HOME", icon: Home },
                    { path: "/doctors", label: "ALL DOCTORS", icon: Users },
                    { path: "/about", label: "ABOUT", icon: Info },
                    { path: "/contact", label: "CONTACT", icon: Phone },
                  ].map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) => `flex items-center justify-between p-3 rounded-xl transition-all ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                       {({ isActive }) => (
                         <>
                           <div className="flex items-center gap-3">
                             <item.icon size={18} className={isActive ? "text-primary" : "text-gray-400"} />
                             <span>{item.label}</span>
                           </div>
                           <ChevronRight size={16} className="opacity-30" />
                         </>
                       )}
                    </NavLink>
                  ))}
                  
                  {/* --- MOBILE ONLY PROFILE LINKS --- */}
                  {token && (
                    <>
                       <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
                       <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                       
                       <NavLink to="/my-profile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <User size={18} className="text-gray-400" /> My Profile
                       </NavLink>
                       <NavLink to="/my-appointments" onClick={() => setShowMenu(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Calendar size={18} className="text-gray-400" /> Appointments
                       </NavLink>
                       <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 text-left">
                          <LogOut size={18} /> Logout
                       </button>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Bottom Action (If not logged in) */}
              {!token && (
                 <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={() => { navigate("/login"); setShowMenu(false); }} className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/30">
                       Create Account
                    </button>
                 </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;