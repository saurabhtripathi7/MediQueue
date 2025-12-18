import React from "react";
import { assets } from "../assets/assets";
import { CheckCircle2, UserPlus, Clock, Award } from 'lucide-react'; 

const Header = () => {
  // Stats Data
  const stats = [
    { label: "Verified Doctors", value: "100+", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Happy Patients", value: "50k+", icon: UserPlus, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Appointments", value: "24/7", icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Awards Won", value: "15+", icon: Award, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  ];

  return (
    <div className="flex flex-col gap-10 mb-10">
      <div></div>
      {/* ================= HERO BANNER ================= */}
      {/* 1. CHANGED BACKGROUND: 
             From: 'bg-secondary' 
             To:   'bg-gradient-to-r from-violet-600 to-indigo-600'
          
          2. ADDED SHADOW:
             Added 'shadow-xl' to give it depth.
      */}
      <div className="flex flex-col md:flex-row flex-wrap text-white font-medium bg-linear-to-r from-violet-600 to-indigo-600 dark:bg-gray-800 rounded-2xl px-6 md:px-10 lg:px-20 shadow-xl transition-all duration-300 relative overflow-hidden">
        
        {/* ---------------Left-Side------------- */}
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:-mb-7.5 z-10 relative">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight drop-shadow-sm">
            Book Appointments <br /> With trusted Doctors!
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3 text-white text-lg font-light">
            <img className="w-28 drop-shadow-md" src={assets.group_profiles} alt="Group Profiles" />
            <p className="text-white/90 font-normal py-2 leading-relaxed">
              Simply browse through our extensive list of trusted doctors,{" "}
              <br className="hidden sm:block" /> schedule your appointment hassle-free.
            </p>
          </div>
          <a
            href="#speciality"
            className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-xl m-auto md:m-0 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
          >
            Book appointment <img className="w-3" src={assets.arrow_icon} alt="" />
          </a>
        </div>

        {/* --------------Right-Side------------- */}
        <div className="md:w-1/2 relative">
          <img
            className="w-full md:absolute bottom-0 h-auto rounded-lg object-contain drop-shadow-2xl"
            src={assets.header_img}
            alt="Header Illustration"
          />
        </div>
      </div>

      {/* ================= STATS / BADGES SECTION ================= */}
      <div className="max-w-7xl mx-auto w-full px-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-300"
            >
               <div className={`p-3 rounded-full mb-3 ${stat.bg} ${stat.color}`}>
                 <stat.icon size={28} strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Header;