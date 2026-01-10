import React from 'react'
import { specialityData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Activity, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react'

const SpecialityMenu = () => {
  const navigate = useNavigate();

  // --- MAGNETIC SPOTLIGHT LOGIC (Stored Preference) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleNavigate = (speciality) => {
    navigate(`/doctors/${speciality}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' id='speciality'>
      
      {/* 1. THE MAIN VESSEL: Standard in Light, Pro-Vessel in Dark */}
      <motion.div
       
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="group/container relative overflow-hidden transition-all duration-700
                   bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[3rem] 
                   p-10 sm:p-16
                   dark:bg-slate-950 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]
                   dark:rounded-[4.5rem] lg:dark:p-20"
      >
        
        {/* 2. INTERACTIVE AURA (The fix is the 'group-hover/container' suffix) */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-hover/container:opacity-100 transition-opacity duration-700"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`
            )
          }}
        />

        {/* Ambient Dark Accents */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="relative z-10">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.div 
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 text-primary dark:text-teal-400 text-[12px] font-black uppercase tracking-[0.2em] mb-4"
            >
              <Activity size={15} className="animate-pulse" /> Precision Healthcare
            </motion.div>
            
            <h1 className='text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight'>
              Find by <span className='text-primary dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400'>Speciality</span>
            </h1>
          </div>

          {/* --- THE CAPSULE GRID --- */}
          <div className='flex flex-wrap justify-center gap-4 md:gap-6'>
            {specialityData.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.03 }}
                onClick={() => handleNavigate(item.speciality)}
                className='group/card cursor-pointer relative'
              >
                <div className='relative flex items-center gap-4 pl-2 pr-6 py-2.5 transition-all duration-300
                                bg-white border border-slate-100 rounded-full shadow-sm
                                dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 dark:shadow-none
                                dark:group-hover/card:border-teal-500/40'>
                  
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                    <img className='w-7 h-7 object-contain' src={item.image} alt={item.speciality} />
                  </div>

                  <div className="flex flex-col pr-2">
                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest transition-colors duration-300 group-hover/card:text-primary dark:group-hover/card:text-teal-400">
                      {item.speciality}
                    </p>
                    <div className="h-4 overflow-hidden mt-0.5">
                        <p className="text-[9px] font-bold text-primary dark:text-teal-400 opacity-0 group-hover/card:opacity-100 -translate-y-full group-hover/card:translate-y-0 transition-all flex items-center gap-1">
                            Book Slot <ChevronRight size={14} />
                        </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- FOOTER CTA --- */}
          <div className="mt-20 flex flex-col items-center">
            <button 
              onClick={() => navigate('/doctors')}
              className="group relative flex items-center gap-6 bg-slate-950 text-white dark:bg-white dark:text-slate-950 pl-10 pr-3 py-3 rounded-full font-black text-[13px] uppercase tracking-[0.3em] transition-all duration-500 shadow-xl hover:bg-primary dark:hover:bg-teal-600 dark:hover:text-white"
            >
              See All Specialities 
              <div className="w-10 h-10 rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SpecialityMenu;