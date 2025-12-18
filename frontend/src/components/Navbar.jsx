import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom"; // Merged imports here
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Users, Info, Phone, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* 1. LOGO */}
      <img 
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="MediQueue"
        className="mx-2 h-10 w-auto shrink-0 object-contain cursor-pointer bg-white rounded-md p-1"
      />
      
      {/* 2. DESKTOP MENU */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      {/* 3. RIGHT SIDE ACTIONS (Profile / Theme / Login) */}
      <div className="flex items-center gap-4">
        
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token ? (
          <div className="flex justify-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="pfp"
            />
            <img
              className="w-2.5 dark:invert"
              src={assets.dropdown_icon}
              alt="dropdownIcon"
            />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md shadow-lg min-w-45 border dark:border-gray-700 overflow-hidden">
                <p
                  onClick={() => navigate("my-profile")}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-6 py-[0.550rem] text-[1.150rem] rounded-full hidden md:block transition-all duration-300 hover:bg-secondary hover:-translate-y-1 hover:shadow-lg"
          >
            Create account
          </button>
        )}

        {/* 4. MOBILE MENU TRIGGER BUTTON (Visible only on mobile) */}
        <button 
          onClick={() => setShowMenu(true)} 
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* 5. MOBILE MENU DRAWER (AnimatePresence) */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl md:hidden border-l border-gray-100 dark:border-gray-800 flex flex-col"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                   <img src={assets.logo} alt="Logo" className="w-24 object-contain bg-white rounded p-1" />
                </div>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Links */}
              <ul className="flex flex-col gap-2 p-4">
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
                    className={({ isActive }) => `
                      flex items-center justify-between p-4 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {/* ✅ FIX: Use a function here to access isActive for the icon */}
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-4">
                          <item.icon 
                            size={20} 
                            className={isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"} 
                          />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </NavLink>
                ))}
              </ul>

              <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-center text-gray-400">
                  MediQueue &copy; 2025
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Navbar;