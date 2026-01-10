import React from "react";
import { assets } from "../assets/assets";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Activity,
  Users,
  Calendar,
  Award,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const About = () => {
  // --- MAGNETIC SPOTLIGHT LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const stats = [
    { icon: <Users size={24} />, label: "Patients Served", value: "10K+" },
    { icon: <Calendar size={24} />, label: "Appointments", value: "50K+" },
    { icon: <ShieldCheck size={24} />, label: "Verified Doctors", value: "500+" },
    { icon: <Award size={24} />, label: "Success Rate", value: "99%" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-visible">
      
      {/* 1. THE MAIN HERO VESSEL: Magnetic Aura & Radiating Border */}
      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group/container relative overflow-hidden transition-all duration-700
                   bg-white border border-slate-100 shadow-sm rounded-[3rem] 
                   p-10 sm:p-16 lg:p-20
                   dark:bg-slate-950 dark:backdrop-blur-xl dark:border-white/20 dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]
                   dark:rounded-[4.5rem]"
      >
        {/* INTERACTIVE AURA (z-0) */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-hover/container:opacity-100 transition-opacity duration-700"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`
            )
          }}
        />

        <div className="relative z-10">
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-primary dark:text-teal-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles size={12} /> The Future of Booking
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              About <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400">MediQueue.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* HERO IMAGE with Glassmorphic Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative group/img"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full hidden dark:block animate-pulse" />
              <div className="relative p-2 bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-slate-100 dark:border-white/20 shadow-2xl overflow-hidden">
                <img
                  className="rounded-4xl w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-105"
                  src={assets.about_image}
                  alt="MediQueue"
                />
              </div>
            </motion.div>

            {/* HERO TEXT CONTENT */}
            <div className="space-y-8">
              <div className="space-y-6 text-slate-600 dark:text-slate-400">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                  Trusted Healthcare <br /> 
                  <span className="text-primary dark:text-teal-400 italic font-medium">For a digital-first world.</span>
                </h2>
                <p className="text-lg leading-relaxed font-medium">
                  At <span className="text-primary font-black">MediQueue</span>, we eliminate the friction of traditional booking, providing a seamless bridge between patients and world-class specialists.
                </p>
                <p className="text-lg leading-relaxed font-medium">
                  By leveraging modern technology, we ensure your appointments are synced and your health remains the top priority.
                </p>
              </div>

              {/* Vision Card: Indigo Glow Highlight */}
              <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-4xl border-l-4 border-primary hover-glow">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary dark:text-teal-400 mb-2">Our Vision</p>
                <p className="text-xl text-slate-800 dark:text-slate-200 italic font-medium">
                  "To empower every individual with instant access to personalized healthcare, making long queues a thing of the past."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS SECTION: Glassmorphic Tiles with Group Hover */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className="group/stat flex flex-col items-center justify-center p-8 transition-all duration-500
                       bg-white border border-slate-100 shadow-sm rounded-[2.5rem]
                       dark:bg-slate-950 dark:backdrop-blur-xl dark:border-white/10 hover-glow"
          >
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-primary dark:text-teal-400 mb-4 transition-transform group-hover/stat:rotate-12 group-hover/stat:scale-110">
              {stat.icon}
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {stat.value}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3. WHY CHOOSE US: High-Visibility Feature Cards */}
      <div className="mt-32">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-primary dark:text-teal-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Activity size={14} className="animate-pulse" /> Core Pillars
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            Why <span className="text-primary dark:text-teal-400">Choose Us.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Efficiency",
              desc: "Smart scheduling algorithms that minimize wait times and maximize clinical output.",
              icon: <Clock size={24} />,
            },
            {
              title: "Convenience",
              desc: "Book from anywhere, anytime. Integrated reminders ensure you never miss a checkup.",
              icon: <Calendar size={24} />,
            },
            {
              title: "Personalization",
              desc: "Customized health dashboards and smart recommendations tailored to your medical history.",
              icon: <ShieldCheck size={24} />,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group/card relative cursor-pointer p-10 bg-white border border-slate-100 rounded-[2.5rem] transition-all duration-500
                         dark:bg-slate-950 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-none hover-glow"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary dark:text-teal-400 mb-6 transition-all group-hover/card:bg-primary group-hover/card:text-white dark:group-hover/card:bg-teal-500">
                {item.icon}
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 transition-colors group-hover/card:text-primary dark:group-hover/card:text-teal-400">
                {item.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
              <div className="mt-8 flex justify-end opacity-0 group-hover/card:opacity-100 transition-opacity">
                <ArrowUpRight className="text-primary dark:text-teal-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;