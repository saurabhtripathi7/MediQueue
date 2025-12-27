import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronRight, User, Calendar, LogOut, Sun, Moon} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { AppContext } from "../context/AppContext";


/**
 * Navbar Component
 * ================
 * Manages the top navigation, authentication UI state, and responsive menu.
 *
 * Architecture Notes:
 * - Authentication state is derived directly from `localStorage` to ensure
 * compatibility with Axios interceptors.
 * - This component listens to route changes to automatically update UI
 * if a token expires or is removed elsewhere.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { userData, authReady } = useContext(AppContext);
  
  /* ----------------------------------------------------------------
  * STATE MANAGEMENT
  * ---------------------------------------------------------------- */
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [showMenu, setShowMenu] = useState(false);
 const [showDropdown, setShowDropdown] = useState(false);
 
 /**
  * Auth Check Effect
  * -----------------
  * Runs on mount and every time the route changes (`location.pathname`).
   * This ensures that if the user logs out or the token is cleared
   * while navigating, the Navbar UI updates immediately.
 */
useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, [location.pathname]);
  
  /**
   * Handle Logout
   * -------------
   * 1. Scrolls to top for UX.
   * 2. Clears storage tokens (access & refresh).
   * 3. Resets local UI state.
   * 4. Redirects to login.
  */
  const logout = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsAuthenticated(false);
    setShowMenu(false);
    setShowDropdown(false);
    
    navigate("/login");
  };
  
  if (!authReady) return null; // ⛔ wait before rendering
  return (
    <>
      {/* Container: Sticky Shell */}
      <div className="sticky top-0 z-50 pt-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Floating Glassmorphism Card */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Logo Section */}
            <img
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              src={assets.main_logo}
              alt="MediQueue"
              className="h-9 w-auto cursor-pointer"
            />

            {/* Desktop Navigation Links */}
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
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {({ isActive }) => (
                    <li className="relative group py-1">
                      <span
                        className={
                          isActive
                            ? "text-primary font-bold"
                            : "text-gray-700 dark:text-gray-300 hover:text-primary"
                        }
                      >
                        {link.label}
                      </span>
                      <div
                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </li>
                  )}
                </NavLink>
              ))}
            </ul>

            {/* Right Side: Theme Toggle & User Actions */}
            <div className="flex items-center gap-4">
              {/* THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 border border-black dark:border-white"
                aria-label="Toggle Theme"
              >
                {/* We use key={theme} so Framer Motion knows to trigger the animation on change */}
                <motion.div
                  key={theme}
                  initial={{ y: -5, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? (
                    // If Light mode, show Moon (to switch to dark)
                    <Moon
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    // If Dark mode, show Sun (to switch to light)
                    <Sun size={20} className="text-yellow-500" />
                  )}
                </motion.div>
              </button>

              {/* User Profile / Login Button */}
              {isAuthenticated ? (
                <div
                  className="hidden md:flex items-center gap-2 cursor-pointer relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={userData?.image || assets.defaultUserIcon}
                    alt="profile"
                    className="w-9 h-9 rounded-full border"
                  />
                  <ChevronRight size={14} className="rotate-90 opacity-60" />

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-0 right-0 pt-12 z-20"
                      >
                        <div className="bg-white dark:bg-black rounded-xl shadow-xl min-w-48 border overflow-hidden">
                          <p
                            onClick={() => navigate("/my-profile")}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm"
                          >
                            <User size={16} /> My Profile
                          </p>
                          <p
                            onClick={() => navigate("/my-appointments")}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-sm"
                          >
                            <Calendar size={16} /> Appointments
                          </p>
                          <p
                            onClick={logout}
                            className="px-4 py-3 text-red-500 hover:bg-red-50 cursor-pointer flex items-center gap-2 border-t text-sm"
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
                  onClick={() => navigate("/login")}
                  className="bg-primary text-white px-6 py-2 rounded-full hidden md:block"
                >
                  Create account
                </button>
              )}

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setShowMenu(true)}
                className="md:hidden p-2 rounded-lg"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileMenu
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          isAuthenticated={isAuthenticated}
          logout={logout}
        />
      </div>
    </>
  );
};

export default Navbar;
