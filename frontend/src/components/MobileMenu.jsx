import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Users,
  Info,
  Phone,
  ChevronRight,
  User,
  Calendar,
  LogOut,
} from "lucide-react";
import { assets } from "../assets/assets";

const MobileMenu = ({ showMenu, setShowMenu, token, logout }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {showMenu && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
          
          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white dark:bg-gray-800 z-50 shadow-2xl md:hidden border-l border-gray-100 dark:border-gray-700 flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              {token ? (
                <div className="flex items-center gap-3">
                  <img
                    src={assets.profile_pic}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-semibold dark:text-white">
                      Hello, User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Welcome back
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={assets.logo}
                  alt="Logo"
                  className="w-24 object-contain"
                />
              )}

              <button
                onClick={() => setShowMenu(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* LINKS */}
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
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon
                            size={18}
                            className={
                              isActive ? "text-primary" : "text-gray-400"
                            }
                          />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="opacity-30" />
                      </>
                    )}
                  </NavLink>
                ))}

                {token && (
                  <>
                    <div className="my-2 border-t border-gray-100 dark:border-gray-700" />
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                      Account
                    </p>

                    <NavLink
                      to="/my-profile"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <User size={18} /> My Profile
                    </NavLink>

                    <NavLink
                      to="/my-appointments"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Calendar size={18} /> Appointments
                    </NavLink>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 text-left"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                )}
              </ul>
            </div>

            {!token && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
                >
                  Create Account
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
