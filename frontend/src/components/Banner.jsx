import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row bg-linear-to-r from-violet-600 to-indigo-600 dark:bg-gray-800 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-xl transition-all duration-300 overflow-hidden relative">
      
      {/* ---------- Left Side (Text & Button) -------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 z-10 relative ">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight drop-shadow-sm ">
          <p className="dark:text-white">Book Appointment</p>
          <p className="dark:text-white mt-4 opacity-90">With 100+ Trusted Doctors</p>
        </div>
        
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="group bg-white text-violet-600 font-bold my-6 px-8 py-3 rounded-full 
            transition-all duration-300 
            hover:bg-gray-50 hover:scale-105 hover:shadow-lg hover:shadow-violet-900/20
            dark:bg-primary dark:text-white dark:hover:bg-blue-600"
        >
          <span className="flex items-center gap-2 text-xl">
            Create account
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </div>

      {/* ---------- Right Side (Image) -------- */}
      <div className="hidden md:flex md:w-1/2 lg:w-92.5 relative justify-end items-end">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md object-contain hover:scale-105 transition-transform duration-500"
          src={assets.appointment_img}
          alt="Appointment banner"
        />
      </div>
      
      {/* Mobile Image (Visible only on small screens) */}
      <div className="md:hidden flex justify-center -mt-5">
         <img
          className="w-full max-w-75 object-contain"
          src={assets.appointment_img}
          alt="Appointment banner"
        />
      </div>

    </div>
  );
};

export default Banner;