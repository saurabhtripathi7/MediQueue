import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 md:mx-10 mt-40"> {/* Moved mt-40 here for cleaner spacing */}
      <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        {/* Left */}
        <div>
          <img 
            className="mb-5 w-40 bg-white rounded-md p-1" // Added bg-white so logo is visible on dark bg
            src={assets.logo} 
            alt="MediQueue Logo" 
          />
          <p className="w-full md:w-2/3 text-gray-600 dark:text-gray-400 leading-6">
            MediQueue helps you find trusted doctors and book appointments
            effortlessly. Browse by speciality, check availability in real time,
            and manage your appointments—all in one simple, secure platform.{" "}
          </p>
        </div>

        {/* Center */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-900 dark:text-white">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              Home
            </li>
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              About us
            </li>
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              Contact us
            </li>
            <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
              Privacy policy
            </li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-900 dark:text-white">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
            <li>
              <a 
                href="tel:+919569932897" 
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                +91 9569932897
              </a>
            </li>
            <li>
              <a
                href="mailto:saurabh7sde@gmail.com"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                saurabh7sde@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Copyright */}
      <p className="py-5 text-sm text-center text-gray-600 dark:text-gray-400">
        Copyright © 2025 Saurabh Tripathi – All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;