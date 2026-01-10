import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
/* Added useSpring for a premium "evolved" feel */
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Clock,
  Activity,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();

  /* ================= EVOLVED MAGNETIC ENGINE ================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics: Damping and Stiffness make the light feel "liquid"
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const highlights = [
    { label: "100+ Specialists", icon: Star },
    { label: "Neural Sync", icon: Activity },
    { label: "Verified Network", icon: CheckCircle2 },
    { label: "24/7 Global Access", icon: Clock },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 overflow-visible relative group/banner">
      
      {/* RADIANCE BLOOM (Dynamic Background Glow) */}
      <div className="absolute inset-x-10 -bottom-10 top-40 bg-teal-500/15 blur-[140px] rounded-full z-0 pointer-events-none opacity-0 group-hover/banner:opacity-100 transition-opacity duration-1000" />

      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="
          group/container relative z-10 overflow-hidden transition-all duration-700
          
          /* === LIGHT MODE: Deep Violet-Indigo === */
          bg-linear-to-r from-violet-600 to-indigo-700 rounded-[3rem]

          /* === DARK MODE: Cyber-Black === */
          dark:bg-[#020617] dark:from-transparent dark:to-transparent
          dark:rounded-[4rem] lg:dark:rounded-[6rem]
          dark:border dark:border-white/10
          dark:shadow-[0_0_80px_-20px_rgba(45,212,191,0.2)]
        "
      >
        {/* ✅ THE TEAL MAGNETIC SPOTLIGHT 
            Using 'plus-lighter' blend mode to ensure the teal cuts 
            vibrantly through the violet light mode background.
        */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500 mix-blend-plus-lighter"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) =>
                `radial-gradient(
                  600px circle at ${x}px ${y}px, 
                  rgba(45, 212, 191, 0.6) 0%, 
                  rgba(45, 212, 191, 0.2) 40%, 
                  transparent 80%)`
                ),
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-14 px-10 py-20 lg:px-24 lg:py-24">
          
          {/* LEFT: Copy Section */}
          <div className="w-full lg:w-3/5 space-y-10 text-center lg:text-left">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 text-white dark:text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <ShieldCheck size={12} className="animate-pulse" />
              Secure Digital Infrastructure
            </motion.div>

            <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85]">
              Precision <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-200 via-white to-white/50 dark:from-white dark:via-teal-200 dark:to-emerald-400">
                Healthcare.
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto lg:mx-0">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest group/item">
                  <div className="p-2 rounded-lg bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 group-hover/item:bg-white/20 transition-all duration-300">
                    <item.icon size={16} />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="group inline-flex items-center gap-8 bg-white text-indigo-900 dark:text-slate-950 pl-12 pr-4 py-4 rounded-full font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-teal-500 hover:text-white transition-all duration-500"
            >
              Join the Network
              <div className="w-12 h-12 rounded-full bg-indigo-900 dark:bg-slate-950 text-white flex items-center justify-center group-hover:bg-white dark:group-hover:text-teal-600 transition-all">
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>

          {/* RIGHT: Visual Section */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-end relative">
            {/* FLOATING GLASS CARD */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotateZ: [0, 2, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute -top-15 -left-10 z-20 hidden lg:flex items-center gap-3 p-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl"
            >
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 flex items-center justify-center text-white dark:text-teal-400">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Verified Doctors</p>
                <p className="text-teal-200 text-[8px] font-bold uppercase tracking-widest mt-1 opacity-70">Precision Tier</p>
              </div>
            </motion.div>

            <motion.img
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.08, y: -10, rotateZ: 1.5, rotateY: -8 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={assets.appointment_img}
              className="w-full max-w-md object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(45,212,191,0.25)] cursor-pointer"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;