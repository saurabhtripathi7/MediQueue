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
  ArrowRight
} from "lucide-react";
import { assets } from "../assets/assets";

// Animation Variants
const drawerVariants = {
  hidden: { x: "100%", transition: { type: "spring", damping: 30, stiffness: 300 } },
  visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 + 0.1 },
  }),
};

const MobileMenu = ({ showMenu, setShowMenu, token, logout }) => {
  const navigate = useNavigate();

  const mainLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/doctors", label: "All Doctors", icon: Users },
    { path: "/about", label: "About Us", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <AnimatePresence>
      {showMenu && (
        <>
          {/* BACKDROP - Enhanced Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          />

          {/* DRAWER */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl md:hidden flex flex-col"
          >
            {/* HEADER - More compact and clean */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800">
              {token ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={assets.profile_pic}
                      alt="User"
                      className="w-11 h-11 rounded-full border-2 border-primary/20 p-0.5"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                      My Account
                    </p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                      Verified Member
                    </p>
                  </div>
                </div>
              ) : (
                <img src={assets.logo} alt="Logo" className="w-24" />
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(false)}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* NAVIGATION LINKS */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {mainLinks.map((item, i) => (
                  <motion.div key={item.path} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                    <NavLink
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-4">
                            <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary"} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight size={18} className={isActive ? "text-white/50" : "opacity-20"} />
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {token && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.4 }}
                    className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-800"
                  >
                    <p className="px-4 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Settings & Profile
                    </p>
                    <div className="space-y-1">
                      <NavLink to="/my-profile" onClick={() => setShowMenu(false)} className="flex items-center gap-4 p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                        <User size={20} className="text-gray-400" /> 
                        <span className="font-medium">My Profile</span>
                      </NavLink>
                      <NavLink to="/my-appointments" onClick={() => setShowMenu(false)} className="flex items-center gap-4 p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors">
                        <Calendar size={20} className="text-gray-400" /> 
                        <span className="font-medium">Appointments</span>
                      </NavLink>
                    </div>
                  </motion.div>
                )}
              </nav>
            </div>

            {/* FOOTER ACTION */}
            <div className="p-5 border-t border-gray-50 dark:border-gray-800">
              {token ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500 bg-red-50 dark:bg-red-500/10 font-bold transition-colors"
                >
                  <LogOut size={18} /> Logout
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all"
                >
                  Get Started <ArrowRight size={18} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;