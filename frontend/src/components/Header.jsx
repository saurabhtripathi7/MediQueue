import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
/* Added useSpring for a premium physics-based movement */
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  CheckCircle2,
  UserPlus,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  /* ================= EVOLVED MAGNETIC ENGINE ================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics makes the spotlight follow the mouse with a natural "damping" effect
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const stats = [
    {
      label: "Verified Doctors",
      value: "100+",
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Happy Patients",
      value: "50k+",
      icon: UserPlus,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Appointments",
      value: "24/7",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      label: "Awards Won",
      value: "15+",
      icon: Award,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-500/10",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 relative overflow-visible">
      
      {/* LIGHT MODE BACK BLOOM */}
      <div className="absolute inset-x-24 top-48 bottom-0 bg-teal-500/6 blur-[80px] rounded-full pointer-events-none z-0" />

      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="
          group/container isolate relative z-10 overflow-hidden
          transition-all duration-700
          bg-linear-to-r from-violet-600 to-indigo-700 rounded-[3rem]
          dark:bg-slate-950 dark:from-transparent dark:to-transparent
          dark:border dark:border-white/10 dark:backdrop-blur-xl
          dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_60px_140px_-30px_rgba(45,212,191,0.35)]
          dark:rounded-[4rem]
        "
      >
        {/* INNER EDGE SHADOW (DARK ONLY) */}
        <div className="pointer-events-none absolute inset-0 hidden dark:block rounded-[4rem] shadow-[inset_0_0_80px_rgba(255,255,255,0.08)]" />

        {/* ✅ EVOLVED: MAGNETIC TEAL SPOTLIGHT (Using Spring Physics) */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/container:opacity-100 transition-opacity duration-500 mix-blend-screen"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) =>
                `radial-gradient(
                  480px circle at ${x}px ${y}px,
                  rgba(45,212,191,0.7) 0%,
                  rgba(45,212,191,0.3) 35%,
                  transparent 72%
                )`
            ),
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 px-8 py-16 lg:px-20 lg:py-24">
          
          <div className="w-full md:w-3/5 text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 text-white dark:text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} className="animate-pulse" />
              MediQueue Smart Access
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
              Book Expert <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-200 via-white to-white/70 dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400">
                Consultations.
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
              <img className="w-24 drop-shadow-lg" src={assets.group_profiles} alt="Profiles" />
              <p className="text-white/80 dark:text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
                Connect with our elite network of{" "}
                <span className="text-white">100+ verified specialists</span> for personalized care.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, x: 6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {navigate("/doctors");  window.scrollTo(0, 0);}}
              className="group inline-flex items-center gap-6 bg-white text-indigo-900 dark:bg-white dark:text-slate-950 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white"
            >
              Start Booking Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end">
            {/* ✅ EVOLVED: 3D Hover & Entry for Header Image */}
            <motion.img
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05, rotateY: -10, rotateX: 5 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              src={assets.header_img}
              alt="Doctors"
              className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] cursor-pointer"
            />
          </div>
        </div>
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group/stat flex flex-col items-center justify-center p-8 bg-white border border-slate-100 shadow-sm rounded-[2.5rem] dark:bg-slate-900/50 dark:backdrop-blur-2xl dark:border-white/5 transition-all duration-500 cursor-default hover:shadow-xl dark:hover:shadow-teal-500/10"
          >
            <div className={`p-5 rounded-3xl mb-5 transition-all duration-500 group-hover/stat:rotate-12 group-hover/stat:scale-110 ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>

            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-300 group-hover/stat:text-teal-600 dark:group-hover/stat:text-teal-400">
              {stat.value}
            </h3>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] uppercase mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Header;