import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Award,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Activity,
} from "lucide-react";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);

  // --- MAGNETIC SPOTLIGHT LOGIC (Stored Preference) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const topDoctors = useMemo(() => {
    if (!doctors.length) return [];
    const source =
      doctors.filter((doc) => doc.available).length >= 10
        ? doctors.filter((doc) => doc.available)
        : doctors;

    return [...source]
      .sort(
        (a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0)
      )
      .slice(0, 10);
  }, [doctors]);

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      id="top-doctors"
    >
      {/* 1. THE MAIN VESSEL: Defined Boundaries in BOTH Light and Dark Mode */}
      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden transition-all duration-700
                   bg-white/50 border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[3rem] 
                   p-8 sm:p-12
                   dark:bg-slate-950 dark:border-white/5 dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]
                   dark:rounded-[4.5rem] lg:dark:p-20"
      >
        {/* 2. INTERACTIVE AURA (Teal/Emerald Tinge) */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(800px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`
            ),
          }}
        />

        {/* Ambient Dark Accents (Hidden in Light Mode) */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="relative z-10">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary dark:text-teal-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Activity size={14} className="animate-pulse" /> Expert
                Directory
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                Top Rated <br />
                <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400">
                  Specialists.
                </span>
              </h2>
            </div>
            <p className="max-w-xs text-slate-500 dark:text-slate-400 font-medium text-base border-l-2 border-slate-300 dark:border-white/20 pl-6 leading-relaxed mx-auto md:mx-0">
              Access our most experienced practitioners across all specialized
              medical departments.
            </p>
          </div>

          {/* --- THE GRID --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {topDoctors.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group/card relative cursor-pointer"
              >
                {/* Individual Card Body */}
                <div
                  className="relative overflow-hidden transition-all duration-500 border
                                bg-white border-blue-50 rounded-2xl shadow-sm
                                dark:bg-white/5 dark:backdrop-blur-3xl dark:border-white/10 dark:rounded-[2.2rem]
                                dark:group-hover/card:bg-white/10 dark:group-hover/card:border-teal-500/30"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-blue-50 dark:bg-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-110"
                    />

                    {/* Status Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end bg-linear-to-t from-black/60 to-transparent">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.available
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-slate-400"
                          }`}
                        />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">
                          {item.available ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-primary dark:text-teal-400 uppercase tracking-[0.2em]">
                          {item.speciality}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Award size={12} />
                          <span className="text-[10px] font-bold">
                            {item.experience}
                          </span>
                        </div>
                      </div>
                      <h3
                        className="text-lg font-black text-slate-900 dark:text-white truncate
    group-hover/card:text-primary
    transition-colors"
                      >
                        {item.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/card:text-slate-600 dark:group-hover/card:text-white transition-colors">
                        View Profile
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/card:bg-primary dark:group-hover/card:bg-teal-500 group-hover/card:text-white transition-all duration-200">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- THE CTA --- */}
          <div className="mt-20 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/doctors");
                window.scrollTo(0, 0);
              }}
              className="group relative flex items-center gap-6 bg-slate-950 text-white dark:bg-white dark:text-slate-950 pl-10 pr-3 py-3 rounded-full font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl hover:bg-primary dark:hover:bg-teal-500 dark:hover:text-white"
            >
              See Full Directory
              <div className="w-10 h-10 rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TopDoctors;
