import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  Activity,
  User,
} from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  /* ================= MAGNETIC HORIZON ================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 40 });

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmail("");
  };

  const socialLinks = [
    {
      Icon: Github,
      link: "https://github.com/saurabhtripathi7",
      label: "GitHub",
    },
    {
      Icon: Linkedin,
      link: "https://www.linkedin.com/in/saurabhtripathicr7/",
      label: "LinkedIn",
    },
    {
      Icon: Globe,
      link: "https://saurabhtripathi-sde.me",
      label: "Portfolio",
    },
  ];

  return (
    <footer className="w-full mt-12 relative group/footer">
      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="
          relative overflow-hidden
          bg-white/85 border-t border-slate-200
          dark:bg-slate-950/90 dark:backdrop-blur-3xl dark:border-white/10
          rounded-t-[3rem] lg:rounded-t-[6rem]
          px-8 py-12 lg:py-16
        "
      >
        {/* MAGNETIC AURA */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-hover/footer:opacity-100 transition-opacity duration-700"
          style={{
            background: useTransform(
              [springX, springY],
              ([x, y]) =>
                `radial-gradient(1000px circle at ${x}px ${y}px, rgba(45,212,191,0.12), transparent 75%)`
            ),
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* ================= MAIN GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* BRAND */}
            <div className="space-y-6">
              <img
                onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
                className="w-32 cursor-pointer hover:scale-105 transition"
                src={assets.main_logo}
                alt="MediQueue"
              />

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Empowering patients with smart queue management and instant specialist access.
              </p>

              <div className="flex gap-3">
                {socialLinks.map(({ Icon, link, label }) => (
                  <motion.a
                    key={label}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    className="
                      w-10 h-10 flex items-center justify-center rounded-xl
                      bg-slate-100 dark:bg-white/5
                      border border-slate-200 dark:border-white/10
                      text-slate-600 dark:text-slate-400
                      hover:text-primary dark:hover:text-teal-400 transition
                    "
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>

              {/* MY PROFILE BUTTON */}
              <button
                onClick={() => { navigate("/my-profile"); window.scrollTo(0, 0); }}
                className="
                  mt-2 inline-flex items-center gap-3 px-5 py-2.5
                  rounded-full bg-primary/10 dark:bg-teal-500/10
                  text-primary dark:text-teal-400
                  text-sm font-semibold
                  hover:bg-primary hover:text-white
                  dark:hover:bg-teal-500 dark:hover:text-white
                  transition
                "
              >
                <User size={16} />
                My Profile
              </button>
            </div>

            {/* PLATFORM */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.25em] mb-6 border-l-2 border-primary pl-3">
                Platform
              </h3>
              <ul className="space-y-4">
                {["Home", "All Doctors", "About Us", "Contact"].map(item => (
                  <li key={item}>
                    <Link
                      to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-teal-400 transition flex items-center gap-3"
                    >
                      <span className="h-px w-4 bg-slate-300 dark:bg-white/20" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.25em] mb-6 border-l-2 border-primary pl-3">
                Reach Us
              </h3>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary dark:text-teal-400" />
                  Lucknow, India
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-primary dark:text-teal-400" />
                  saurabh7sde@gmail.com
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div className="space-y-6">
              <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.25em] border-l-2 border-primary pl-3">
                Newsletter
              </h3>

              <form
                onSubmit={handleNewsletterSubmit}
                className="
                  flex p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5
                  border border-slate-200 dark:border-white/10
                "
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-transparent outline-none text-sm dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!email}
                  className="
                    bg-primary dark:bg-teal-500 text-white
                    px-4 rounded-xl
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-105 active:scale-95 transition
                  "
                >
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="flex items-center gap-2 text-primary dark:text-teal-400 text-xs font-bold uppercase tracking-widest">
                <Activity size={14} className="animate-pulse" />
                Live Service
              </div>
            </div>
          </div>

          {/* ================= SIGNATURE ================= */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
              © 2026 MediQueue • Built by Saurabh Tripathi
            </p>

            <div className="flex gap-10">
              {["Privacy", "Terms", "Sitemap"].map(text => (
                <span
                  key={text}
                  className="text-xs font-bold text-slate-500 hover:text-primary dark:hover:text-teal-400 transition cursor-pointer uppercase tracking-widest"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
