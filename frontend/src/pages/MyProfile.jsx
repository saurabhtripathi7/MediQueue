import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Camera, Mail, Phone, MapPin, Calendar, User, Save, Edit2, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const [userData, setUserData] = useState({
    name: "Saurabh Tripathi",
    email: "saurabh@example.com",
    phone: "+91 9569932897",
    gender: "Male",
    dob: "2004-04-18",
    image: "https://i.pravatar.cc/300?img=12",
    address: { line1: "Arjun Enclave Phase 2", line2: "Lucknow, India" },
  });

  const handleSave = () => {
    setIsEdit(false);
    setImage(null);
    console.log("Saved:", userData);
  };

  // Reusable Component for Fields to keep code clean
  const ProfileField = ({ icon: Icon, label, value, onChange, type = "text", options }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">{label}</p>
        {isEdit ? (
          options ? (
             <select 
               className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               value={value}
               onChange={onChange}
             >
                {options.map(opt => <option key={opt}>{opt}</option>)}
             </select>
          ) : (
            <input
              type={type}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={value}
              onChange={onChange}
            />
          )
        ) : (
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-10 p-4 font-sans"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Cover Photo */}
        <div className="h-40 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-6 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-end -mt-12 mb-8">
            {/* Avatar */}
            <div className="relative group">
              <img
                className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              {isEdit && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera className="text-white w-8 h-8" />
                  <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                </label>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 w-full text-center sm:text-left mb-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                 {isEdit ? (
                    <input 
                      className="text-3xl font-bold bg-transparent border-b border-blue-500 focus:outline-none text-gray-900 dark:text-white w-full sm:w-auto"
                      value={userData.name}
                      onChange={(e) => setUserData(p => ({...p, name: e.target.value}))}
                    />
                 ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {userData.name} 
                      <BadgeCheck className="text-blue-500" size={24} />
                    </h1>
                 )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Verified Patient</p>
            </div>

            {/* Action Button */}
            <div className="mb-2">
               {isEdit ? (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
                  >
                    <Save size={18} /> Save
                  </motion.button>
               ) : (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEdit(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Edit2 size={18} /> Edit
                  </motion.button>
               )}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Contact Details</h3>
              <ProfileField icon={Mail} label="Email ID" value={userData.email} onChange={() => {}} /* Read-only usually */ />
              <ProfileField 
                icon={Phone} 
                label="Phone Number" 
                value={userData.phone} 
                onChange={(e) => setUserData(p => ({...p, phone: e.target.value}))} 
              />
              <ProfileField 
                icon={MapPin} 
                label="Address Line 1" 
                value={userData.address.line1} 
                onChange={(e) => setUserData(p => ({...p, address: {...p.address, line1: e.target.value}}))} 
              />
               <ProfileField 
                icon={MapPin} 
                label="Address Line 2" 
                value={userData.address.line2} 
                onChange={(e) => setUserData(p => ({...p, address: {...p.address, line2: e.target.value}}))} 
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Basic Information</h3>
              <ProfileField 
                icon={User} 
                label="Gender" 
                value={userData.gender} 
                options={["Male", "Female", "Other"]}
                onChange={(e) => setUserData(p => ({...p, gender: e.target.value}))} 
              />
              <ProfileField 
                icon={Calendar} 
                label="Birthday" 
                value={userData.dob} 
                type="date"
                onChange={(e) => setUserData(p => ({...p, dob: e.target.value}))} 
              />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;