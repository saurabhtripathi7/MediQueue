import React from "react";
import { assets } from "../assets/assets";
import { CheckCircle2, UserPlus, Clock, Award } from "lucide-react";
import gradientBg from "../assets/bluePurpleYellowGradient.png";

const Header = () => {
  const stats = [
    {
      label: "Verified Doctors",
      value: "100+",
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Happy Patients",
      value: "50k+",
      icon: UserPlus,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Appointments",
      value: "24/7",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Awards Won",
      value: "15+",
      icon: Award,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  return (
    <section
      className="w-full py-12 sm:py-16"
      style={{
        backgroundImage: `url(${gradientBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ================= HERO ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="
            relative
            flex flex-col md:flex-row
            items-center
            gap-10
            bg-linear-to-r from-violet-600 to-indigo-600
            dark:bg-gray-800
            rounded-2xl
            shadow-xl
            overflow-hidden

            px-6 py-10
            sm:px-10 sm:py-12
            md:px-14 md:py-16
            lg:px-20 lg:py-20

            md:min-h-105
            lg:min-h-120
          "
        >
          {/* LEFT */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="drop-shadow-sm text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white">
              Book Appointments <br /> With trusted Doctors!
            </h1>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <img
                className="w-28"
                src={assets.group_profiles}
                alt="Group Profiles"
              />
              <p className="drop-shadow-sm text-white/90 text-sm sm:text-base max-w-md">
                Simply browse through our extensive list of trusted doctors,
                schedule your appointment hassle-free.
              </p>
            </div>

            <a
              href="#speciality"
              className="inline-flex items-center gap-2 mt-8 bg-white text-gray-700 px-7 py-3 rounded-full text-sm font-medium hover:scale-105 transition"
            >
              Book appointment
              <img className="w-3" src={assets.arrow_icon} alt="" />
            </a>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src={assets.header_img}
              alt="Doctors"
              className="
                w-55
                sm:w-65
                md:w-75
                lg:w-150
                object-contain
                select-none

              "
            />
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className={`p-3 rounded-full mb-3 ${stat.bg} ${stat.color}`}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Header;
