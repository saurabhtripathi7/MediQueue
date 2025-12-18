import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    // 1. CONTAINER FIX: Changed to 'flex-col md:flex-row'.
    // This stacks items vertically on mobile and horizontally on desktop.
    <div className="flex flex-col md:flex-row bg-secondary dark:bg-gray-800 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 transition-colors duration-300 overflow-hidden">
      
      {/* ---------- Left Side (Text & Button) -------- */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 z-10">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="group bg-white text-gray-800 font-semibold my-6 px-8 py-3 rounded-full 
            transition-all duration-300 
            hover:bg-gray-100 hover:scale-105 hover:shadow-lg
            dark:bg-primary dark:text-white dark:hover:bg-blue-600"
        >
          <span className="flex items-center gap-2">
            Create account
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </button>
      </div>

      {/* ---------- Right Side (Image) -------- */}
      {/* 2. IMAGE CONTAINER FIX:
          - Removed 'absolute positioning'.
          - Added 'flex justify-center items-end' to align image neatly at the bottom center on mobile, and bottom right on desktop.
          - Added negative margin 'mb-[-20px]' on desktop to make it sit subtly lower for a 3D effect, without getting trimmed.
      */}
      <div className="md:w-1/2 relative flex justify-center md:justify-end items-end lg:-mb-5">
        <img
          /* 3. IMAGE ITSELF FIX:
             - 'w-full': Allows it to take available width.
             - 'max-w-md': Prevents it from getting ridiculously huge on tablets.
             - 'h-auto': Ensures aspect ratio is maintained (no stretching).
             - 'object-contain': Ensures the whole image fits within its allotted space.
          */
          className="w-full max-w-75 md:max-w-md h-auto object-contain"
          src={assets.appointment_img}
          alt="Appointment banner"
        />
      </div>
    </div>
  );
};

export default Banner;