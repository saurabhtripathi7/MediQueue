import React from "react";
import { assets } from "../assets/assets";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Activity, 
  Github, 
  Linkedin, 
  Globe 
} from "lucide-react";

const Contact = () => {
  // --- MAGNETIC SPOTLIGHT LOGIC (Synchronized with Header) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const contactInfo = [
    { 
      title: "Our Office", 
      content: "F-391, Gomti Nagar, Lucknow (226010) India 🇮🇳",
      icon: <MapPin className="text-blue-500" size={24} />,
      label: "VISIT US"
    },
    { 
      title: "Direct Reach", 
      content: "📞 +91 95XXX-XXX97 \n ✉️ saurabh7sde@gmail.com",
      icon: <Mail className="text-emerald-500" size={24} />,
      label: "CHAT NOW"
    }
  ];

  return (
    <div className="px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. THE MAIN VESSEL: Radiating Stroke & Magnetic Aura */}
      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group/container relative overflow-hidden transition-all duration-700
                   bg-white border border-slate-200 rounded-[3rem] p-10 sm:p-16
                   dark:bg-slate-950 dark:backdrop-blur-2xl dark:border-white/20 dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]
                   dark:rounded-[4rem]"
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

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: Floating Illustration with Bio-Luminescent Glow */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full hidden dark:block animate-pulse" />
            
            <motion.img
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-md rounded-[3rem] shadow-2xl z-10 border border-white/10"
              src={assets.contact_image}
              alt="Contact"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-primary dark:text-teal-400 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Activity size={12} className="animate-pulse" /> Get In Touch
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                Connect <br />
                <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-sky-400 dark:via-teal-400 dark:to-emerald-400">
                  With Us.
                </span>
              </h1>
            </div>

            {/* INTERACTIVE INFO CARDS */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                  className="group/card cursor-pointer p-8 rounded-2xl transition-all duration-500
                             bg-white border border-slate-100 shadow-sm
                             dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/5 hover-glow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 group-hover/card:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <h3 className="font-black text-lg text-slate-800 dark:text-white transition-colors group-hover/card:text-primary dark:group-hover/card:text-teal-400">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 whitespace-pre-line text-sm leading-relaxed font-medium">
                    {item.content}
                  </p>
                </motion.div>
              ))}

              {/* CONNECTIVITY SECTION (Replaced Careers) */}
              <div className="p-8 rounded-3xl bg-slate-950 text-white overflow-hidden relative border border-white/10 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                  <Sparkles size={18} className="text-teal-400" /> Digital Presence
                </h3>
                <p className="text-slate-500 text-xs mb-6 font-medium tracking-wide">Find Saurabh Tripathi across these platforms.</p>
                
                {/* SOCIAL CONNECTIVITY ROW: Useful Replacement */}
                <div className="flex gap-4">
                  {[
                    { icon: <Github size={20} />, link: "https://github.com/saurabhtripathi7", label: "GitHub" },
                    { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/saurabhtripathicr7/", label: "LinkedIn" },
                    { icon: <Globe size={20} />, link: "https://saurabhtripathi-sde.me", label: "Portfolio" }
                  ].map((social, sIdx) => (
                    <motion.a
                      key={sIdx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5, scale: 1.1 }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-teal-500 hover:text-white transition-all duration-300"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Contact;