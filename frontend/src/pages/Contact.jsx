import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="px-3 sm:px-6 md:px-10">
      {/* ---------- HEADER ---------- */}
      <div className="text-center pt-12">
        <p className="text-3xl font-semibold text-gray-800 dark:text-white">
          CONTACT <span className="text-primary">US</span>
        </p>
        <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <img
          className="w-full max-w-md mx-auto rounded-xl shadow-sm object-contain"
          src={assets.contact_image}
          alt="Contact"
        />

        {/* Info Cards */}
        <div className="flex flex-col gap-6">
          {/* Office */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
            <p className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
              Our Office
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Arjun Enclave Phase 2 <br />
              Kursi Road, Lucknow (226026) <br />
              <span className="flex items-center gap-1">
                India (🇮🇳)
                <img
                  src="https://flagcdn.com/16x12/in.png"
                  alt="Indian Flag"
                  className="inline-block w-4 h-3"
                />
              </span>
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
            <p className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
              Contact Details
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              📞 +91 95699 32897 <br />
              ✉️ saurabh7sde@gmail.com
            </p>
          </div>

          {/* Careers */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
            <p className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
              Careers at MediQueue
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Learn more about our teams and current job openings.
            </p>
            <button
              className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-full
              bg-primary text-white
              text-sm font-medium
              hover:opacity-90
              hover:-translate-y-0.5
              transition-all duration-300
            "
            >
              Explore Jobs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
