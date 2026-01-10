import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronRight, User, Calendar, LogOut, Sun, Moon } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { userData, authReady } = useContext(AppContext);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, [location.pathname]);
  
  const logout = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setShowMenu(false);
    setShowDropdown(false);
    navigate("/login");
  };
  
  if (!authReady) return null;

  return (
    <>
      <div className="sticky top-0 z-50 pt-6 transition-all duration-500 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 1. THE MAIN VESSEL: Standard in Light, Bio-Luminescent in Dark */}
          <div className="relative group/nav bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] rounded-4xl px-6 py-3 flex items-center justify-between transition-all duration-500">
            
            {/* Subtle Aura inside the Navbar (Dark Mode Only) */}
            <div className="absolute inset-0 pointer-events-none opacity-0 dark:group-hover/nav:opacity-100 transition-opacity duration-700 bg-radial-gradient from-teal-500/5 to-transparent blur-2xl" />

            {/* Logo Section */}
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              src={assets.main_logo}
              alt="MediQueue"
              className="h-8 sm:h-9 w-auto cursor-pointer relative z-10"
            />

            {/* 2. KINETIC NAVIGATION LINKS */}
            <ul className="hidden md:flex items-center gap-10 font-black text-[11px] tracking-[0.15em] relative z-10">
              {[
                { path: "/", label: "HOME" },
                { path: "/doctors", label: "ALL DOCTORS" },
                { path: "/about", label: "ABOUT" },
                { path: "/contact", label: "CONTACT" },
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {({ isActive }) => (
                    <li className="relative group py-1 overflow-hidden">
                      <span
                        className={`transition-colors duration-300 ${
                          isActive
                            ? "text-primary dark:text-teal-400 font-black"
                            : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-300"
                        }`}
                      >
                        {link.label}
                      </span>
                      {/* Active Indicator: Radiant Underline */}
                      <div
                        className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary dark:bg-linear-to-r dark:from-teal-400 dark:to-emerald-400 transition-all duration-500 ${
                          isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                      />
                    </li>
                  )}
                </NavLink>
              ))}
            </ul>

            {/* Right Side: Theme Toggle & User Actions */}
            <div className="flex items-center gap-4 relative z-10">
              
              {/* THEME TOGGLE: Upgraded to Glassmorphism */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 transition-all hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm"
                aria-label="Toggle Theme"
              >
                <motion.div
                  key={theme}
                  initial={{ y: -5, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                >
                  {theme === "light" ? (
                    <Moon size={18} className="text-slate-600" />
                  ) : (
                    <Sun size={18} className="text-teal-400" />
                  )}
                </motion.div>
              </button>

              {/* User Profile / Dropdown */}
              {isAuthenticated ? (
                <div
                  className="hidden md:flex items-center gap-3 cursor-pointer relative group/user"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="relative">
                    <img
                      src={userData?.image || assets.defaultUserIcon}
                      alt="profile"
                      className="w-9 h-9 rounded-full border border-slate-200 dark:border-teal-500/50 object-cover shadow-lg group-hover/user:scale-105 transition-transform"
                    />
                    {/* Status Dot */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                  </div>
                  
                  <ChevronRight size={14} className="rotate-90 opacity-40 group-hover/user:translate-y-0.5 transition-transform" />

                  {/* 3. DROPDOWN MENU: Glassmorphic upgrade */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 pt-4 w-56 pointer-events-auto"
                      >
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden p-1.5">
                          <p
                            onClick={() => navigate("/my-profile")}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl cursor-pointer flex items-center gap-3 text-[11px] font-black uppercase tracking-wider transition-colors dark:text-slate-300 dark:hover:text-teal-400"
                          >
                            <User size={14} /> My Profile
                          </p>
                          <p
                            onClick={() => navigate("/my-appointments")}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl cursor-pointer flex items-center gap-3 text-[11px] font-black uppercase tracking-wider transition-colors dark:text-slate-300 dark:hover:text-teal-400"
                          >
                            <Calendar size={14} /> Appointments
                          </p>
                          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
                          <p
                            onClick={logout}
                            className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl cursor-pointer flex items-center gap-3 text-[11px] font-black uppercase tracking-wider transition-colors"
                          >
                            <LogOut size={14} /> Logout
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="bg-primary dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 rounded-full hidden md:block font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 dark:shadow-none hover:bg-teal-600 dark:hover:bg-teal-400 transition-colors"
                >
                  Create account
                </motion.button>
              )}

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setShowMenu(true)}
                className="md:hidden p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              >
                <Menu size={22} className="dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        <MobileMenu
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          token={isAuthenticated} 
          userData={userData}     
          logout={logout}
        />
      </div>
    </>
  );
};

export default Navbar;