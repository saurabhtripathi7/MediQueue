import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ArrowUpRight, Activity, Sparkles } from "lucide-react";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors = [] } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    if (speciality) {
      setFilteredDoctors(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [doctors, speciality]);

  const handleFilterClick = (spec) => {
    navigate(spec === speciality ? "/doctors" : `/doctors/${spec}`);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 mt-5 mx-auto max-w-screen-2xl min-h-screen">
      <div className="flex flex-col sm:flex-row gap-8 items-start">

        {/* ================= LEFT SIDEBAR (Standardized Vessel) ================= */}
        <div className="hidden sm:flex flex-col gap-6 w-72 shrink-0 sticky top-24 h-[calc(100vh-120px)] border-r border-slate-100 dark:border-white/5 pr-4">
          <div className="pb-2">
            <p className="text-slate-400 dark:text-teal-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Directory
            </p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter">
              Specialties
            </h2>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {specialityData.map((item) => {
              const isActive = speciality === item.speciality;
              return (
                <motion.div
                  key={item.speciality}
                  onClick={() => handleFilterClick(item.speciality)}
                  whileHover={{ x: 5 }}
                  className={`
                    relative group flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300
                    ${isActive 
                      ? "bg-primary/10 border border-primary/20 shadow-sm" 
                      : "bg-white/50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10"}
                  `}
                >
                  <span className={`text-xs font-black transition-all duration-300 uppercase tracking-widest ${
                    isActive ? "text-primary dark:text-teal-400" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {item.speciality}
                  </span>
                  {isActive && (
                    <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="mt-auto p-5 bg-slate-50 dark:bg-white/5 rounded-4xl border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2 text-primary dark:text-teal-400">
              <Activity size={14} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Showing experts in <span className="text-slate-900 dark:text-white font-bold">{speciality || "all departments"}</span>.
            </p>
          </div>
        </div>

        {/* ================= RIGHT CONTENT AREA (Doctors Grid) ================= */}
        <div className="flex-1 w-full pb-20">
          
          {/* MOBILE FILTER UI */}
          <div className="sm:hidden mb-8 overflow-x-auto no-scrollbar flex gap-3">
            {specialityData.map((item) => (
              <button
                key={item.speciality}
                onClick={() => handleFilterClick(item.speciality)}
                className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  speciality === item.speciality
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                }`}
              >
                {item.speciality}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredDoctors.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -12 }}
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="group/card relative cursor-pointer"
                >
                  {/* MAIN VESSEL: Standard white in light, Bio-Luminescent in dark */}
                  <div className="relative h-full overflow-hidden transition-all duration-500 
                                  bg-white border border-slate-200 shadow-xl shadow-slate-200/50
                                  dark:bg-slate-950 dark:backdrop-blur-3xl dark:border-white/20 
                                  dark:rounded-[2.5rem] rounded-3xl
                                  dark:group-hover/card:border-teal-500/50 
                                  dark:group-hover/card:shadow-[0_0_40px_rgba(45,212,191,0.15)]"
                  >
                    
                    {/* Image Section */}
                    <div className="relative aspect-4/5 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-110"
                      />
                      
                      {/* Availability Overlay */}
                      <div className="absolute bottom-4 left-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-slate-950/40 border border-white/10 shadow-2xl">
                          <span className={`w-2 h-2 rounded-full ${item.available ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" : "bg-slate-400"}`} />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">
                            {item.available ? "Available" : "Busy"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-6 space-y-4 relative z-10">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-primary dark:text-teal-400 uppercase tracking-[0.2em]">
                             {item.speciality}
                           </span>
                           <div className="flex items-center gap-1 text-slate-400">
                              <Award size={14} className="group-hover/card:text-yellow-500 transition-colors" />
                              <span className="text-[10px] font-bold">{item.experience}</span>
                           </div>
                        </div>
                        
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight
                                       transition-colors duration-300 group-hover/card:text-primary dark:group-hover/card:text-teal-400">
                          {item.name}
                        </h3>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/card:text-slate-600 dark:group-hover/card:text-white transition-colors">
                          View Specialist
                        </span>
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 
                                        group-hover/card:bg-primary dark:group-hover/card:bg-teal-500 group-hover/card:text-white 
                                        transition-all duration-300">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>

                    {/* Subtle Indigo "Beauty Hover" Inner Glow */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500
                                    bg-linear-to-tr from-indigo-500/5 via-transparent to-teal-500/5" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* EMPTY STATE */}
          {filteredDoctors.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 opacity-30 text-center">
              <Sparkles size={48} className="mb-4" />
              <p className="text-lg font-black uppercase tracking-widest">No matching specialists found</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;