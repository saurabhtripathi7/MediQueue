import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User, Calendar, LogOut } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    setToken(false);
    navigate("/login");
    setShowMenu(false);
    setShowDropdown(false);
  };

  return (
    // 1. OUTER STICKY SHELL: Handles the "Stickiness" and top spacing
    // Added 'pt-4' so it floats slightly off the top edge like the cards below
    <div className="sticky top-0 z-50 pt-4 transition-all duration-300">
      {/* 2. ALIGNMENT WRAPPER: EXACT match of your Home.jsx wrapper */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* 3. VISUAL CARD: The White Box */}
        {/* Used 'rounded-2xl' to match your Home sections */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <img
            onClick={() => {
              navigate("/");
              scroll(0, 0);
            }}
            src={assets.logo}
            alt="MediQueue"
            className="h-9 w-auto shrink-0 object-contain cursor-pointer"
          />

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-sm">
            {[
              { path: "/", label: "HOME" },
              { path: "/doctors", label: "ALL DOCTORS" },
              { path: "/about", label: "ABOUT" },
              { path: "/contact", label: "CONTACT" },
            ].map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                onClick={() => scroll(0, 0)} /* Added scroll(0,0) here */
              >
                {({ isActive }) => (
                  <li className="relative group py-1">
                    <span
                      className={
                        isActive
                          ? "text-primary font-bold"
                          : "text-gray-700 dark:text-gray-300 transition-colors hover:text-primary"
                      }
                    >
                      {link.label}
                    </span>
                    <div
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </li>
                )}
              </NavLink>
            ))}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-lg"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {token ? (
              <div
                className="hidden md:flex items-center gap-2 cursor-pointer relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={assets.profile_pic}
                  alt="pfp"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
                <ChevronRight size={14} className="rotate-90 opacity-60" />

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-0 right-0 pt-12 z-20"
                    >
                      <div className="bg-white dark:bg-black rounded-xl shadow-xl min-w-48 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <p
                          onClick={() => {
                            scroll(0, 0);
                            navigate("my-profile");
                          }}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer flex items-center gap-2 text-sm"
                        >
                          <User size={16} /> My Profile
                        </p>
                        <p
                          onClick={() => {
                            scroll(0, 0);
                            navigate("my-appointments");
                          }}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer flex items-center gap-2 text-sm"
                        >
                          <Calendar size={16} /> Appointments
                        </p>
                        <p
                          onClick={logout}
                          className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer flex items-center gap-2 border-t border-gray-200 dark:border-gray-800 text-sm"
                        >
                          <LogOut size={16} /> Logout
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  scroll(0, 0), navigate("/login");
                }}
                className="bg-primary text-white px-6 py-2 rounded-full hidden md:block hover:bg-secondary transition-all text-sm font-medium"
              >
                Create account
              </button>
            )}

            <button
              onClick={() => setShowMenu(true)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <MobileMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        token={token}
        logout={logout}
      />
    </div>
  );
};

export default Navbar;