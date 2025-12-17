import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // 1. Import hook

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // 2. Get theme data
  const { theme, toggleTheme } = useTheme();

  return (
    // 3. Added dark:bg-gray-900, dark:text-white, dark:border-gray-700
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      
      {/* LOGO */}
      <img onClick={()=>navigate("/")}
        src={assets.logo}
        alt="MediQueue"
        // Added bg-white so logo is visible in dark mode if it's transparent
        className="mx-2 h-10 w-auto shrink-0 object-contain cursor-pointer bg-white rounded-md p-1"
      />
      
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        
        {/* 4. THEME SWITCHER BUTTON */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xl"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {token === true ? (
          <div className="flex justify-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="pfp"
            />
            <img
              className="w-2.5 dark:invert" // Invert arrow color in dark mode
              src={assets.dropdown_icon}
              alt="dropdownIcon"
            />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              {/* Dropdown Dark Mode Styles */}
              <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md shadow-lg min-w-45 border dark:border-gray-700">
                <p
                  onClick={() => {
                    navigate("my-profile");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("my-appointments");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer whitespace-nowrap"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-6 py-[0.550rem] text-[1.150rem] rounded-full hidden md:block
              transition-all duration-300
              hover:bg-secondary hover:-translate-y-1 hover:shadow-lg"
          >
            Create account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;