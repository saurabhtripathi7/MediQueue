import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="px-3 sm:px-6 md:px-10">
      {/* ---------- ABOUT US HEADER ---------- */}
      <div className="text-center pt-12">
        <p className="text-3xl font-semibold text-gray-800 dark:text-white">
          ABOUT <span className="text-primary">US</span>
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      {/* ---------- ABOUT CONTENT ---------- */}
      <div className="my-14 flex flex-col md:flex-row items-center gap-12">
        {/* Image */}
        <img
          className="w-full md:max-w-105 rounded-xl shadow-sm object-contain"
          src={assets.about_image}
          alt="About MediQueue"
        />

        {/* Text */}
        <div className="flex flex-col gap-6 md:w-1/2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <p>
            Welcome to{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              MediQueue
            </span>
            , your trusted partner in managing your healthcare needs conveniently
            and efficiently. We understand the challenges individuals face when
            scheduling doctor appointments and managing health records.
          </p>

          <p>
            MediQueue is committed to excellence in healthcare technology. We
            continuously enhance our platform by integrating modern solutions to
            deliver a smooth and reliable user experience.
          </p>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white mb-1">
              Our Vision
            </p>
            <p>
              To create a seamless healthcare experience by bridging the gap
              between patients and healthcare providers, ensuring timely and
              accessible care for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* ---------- WHY CHOOSE US ---------- */}
      <div className="text-center mb-12">
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">
          WHY <span className="text-primary">CHOOSE US</span>
        </p>
        <div className="w-14 h-1 bg-primary mx-auto mt-3 rounded-full" />
      </div>

      {/* ---------- FEATURE CARDS (MODERN GRID) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group">
          <b className="text-gray-800 dark:text-white group-hover:text-white text-lg uppercase block mb-4">
            Efficiency
          </b>
          <p className="text-gray-600 dark:text-gray-400 group-hover:text-white">
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group">
          <b className="text-gray-800 dark:text-white group-hover:text-white text-lg uppercase block mb-4">
            Convenience
          </b>
          <p className="text-gray-600 dark:text-gray-400 group-hover:text-white">
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group">
          <b className="text-gray-800 dark:text-white group-hover:text-white text-lg uppercase block mb-4">
            Personalization
          </b>
          <p className="text-gray-600 dark:text-gray-400 group-hover:text-white">
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
