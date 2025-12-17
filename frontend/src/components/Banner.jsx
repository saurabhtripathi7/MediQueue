import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    // 1. CONTAINER FIX: Added dark:bg-gray-800 to change background color in dark mode
    <div className="flex bg-secondary dark:bg-gray-800 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 transition-colors duration-300">
      {/* ---------- Left Side -------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          // 2. BUTTON FIX: Added dark:border-primary dark:hover:bg-gray-700
          // This keeps the button visible but adjusts the hover state for dark mode
          className="group bg-primary text-white my-4 px-6 py-[0.550rem] text-[1.150rem] rounded-full hidden md:block
             transition-all duration-300 border-2 border-transparent
             hover:bg-blue-600 hover:-translate-y-1 hover:shadow-lg
             dark:bg-primary dark:hover:bg-blue-700"
        >
          <span className="flex items-center gap-2">
            Create account
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </div>

      {/* ---------- Right Side -------- */}
      <div className="hidden md:block md:w-1/2 lg:w-92.5 relative">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;