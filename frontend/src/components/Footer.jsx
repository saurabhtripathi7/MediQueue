import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom"; 
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <div className="mt-20 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16">
        
        {/* TOP GRID AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-1">
            <img className="w-36 mb-6" src={assets.logo} alt="MediQueue" />
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              MediQueue simplifies healthcare access. Book appointments, manage health records, and connect with top doctors instantly.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary hover:bg-primary hover:text-white dark:hover:bg-primary transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              {[
                { label: 'Home', path: '/' },
                { label: 'All Doctors', path: '/doctors' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'My Profile', path: '/my-profile' }, 
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    onClick={() => window.scrollTo(0, 0)} // Added Scroll To Top Here
                    className="hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>KIET Group of Institutions,<br />Delhi NCR, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 9569932897</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>saurabh7sde@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Subscribe to get the latest health tips and updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full px-3 py-2.5 rounded-l-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary text-sm"
              />
              <button className="bg-primary text-white px-3 rounded-r-lg hover:bg-secondary transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 MediQueue. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span 
              onClick={() => window.scrollTo(0, 0)} // Added Scroll Here
              className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => window.scrollTo(0, 0)} // Added Scroll Here
              className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;