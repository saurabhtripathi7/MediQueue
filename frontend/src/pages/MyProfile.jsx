import React, { useContext, useEffect, useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, User, Save, Edit2, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

/* =========================================================================
 * COMPONENT: MyProfile
 * =========================================================================
 * Responsibilities:
 * 1. Display User Profile: Shows read-only data initially.
 * 2. Local Editing: Allows users to edit data in a "draft" state without
 *    immediately mutating the global store.
 * 3. API Synchronization: Syncs local changes to the backend via AppContext.
 *
 * DESIGN PATTERN: "Draft State"
 * We copy global `userData` into a local `formData` state. 
 * - Editing modifies `formData`.
 * - Clicking "Save" sends `formData` to the backend.
 * - This prevents UI flickering and partial updates on the global store.
 * ========================================================================= */

// -------------------------------------------------------------------------
// HELPER COMPONENT: ProfileField
// -------------------------------------------------------------------------
// NOTE: This is defined OUTSIDE the main component to prevent performance issues.
// If defined inside, React would re-create this component on every single keystroke,
// causing the input to lose focus and the keyboard to close.
// -------------------------------------------------------------------------
const ProfileField = ({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  options,
  readOnly = false,
  isEdit, // Controls whether we show an Input/Select or just Text
}) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
    {/* Icon Section */}
    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
      <Icon size={18} />
    </div>

    {/* Content Section */}
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">
        {label}
      </p>

      {/* Logic: Show Input if Editing AND not ReadOnly; otherwise show Text */}
      {isEdit && !readOnly ? (
        options ? (
          // Dropdown for Gender, etc.
          <select
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={value}
            onChange={onChange}
          >
            {options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          // Standard Input
          <input
            type={type}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={value}
            onChange={onChange}
          />
        )
      ) : (
        // Read-only Text View
        <p className="text-gray-700 dark:text-gray-200 font-medium text-sm">
          {value || "—"}
        </p>
      )}
    </div>
  </div>
);

// -------------------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------------------
const MyProfile = () => {
  // --- 1. Global State Access ---
  const { userData, updateUserProfileData } = useContext(AppContext);

  // --- 2. Local State Management ---
  const [isEdit, setIsEdit] = useState(false); // Toggles Edit Mode
  const [image, setImage] = useState(null);    // Stores NEW image file selected by user
  const [formData, setFormData] = useState(null); // The "Draft" copy of user data

  // --- 3. Synchronization Effect ---
  // When the component mounts (or userData updates), copy global data to local state.
  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  // --- 4. Loading Guard ---
  // Prevent rendering until we have data to show.
  if (!formData) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  // --- 5. Handlers ---
  const handleSave = async () => {
    // Send the LOCAL draft state to the global update function
    await updateUserProfileData({
      ...formData,
      image, // Include the new image file if one was selected
    });

    // Reset UI state
    setIsEdit(false);
    setImage(null);
  };

  // --- 6. Render ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-10 p-4 font-sans"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* === SECTION A: COVER PHOTO === */}
        <div className="h-40 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="px-6 pb-8">
          
          {/* === SECTION B: HEADER (Avatar & Name) === */}
          <div className="flex flex-col sm:flex-row gap-6 items-end -mt-12 mb-8">
            
            {/* 1. Avatar Image */}
            <div className="relative group">
              <img
                className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                // Logic: Show new preview if selected, otherwise show existing URL
                src={image ? URL.createObjectURL(image) : formData.image}
                alt="Profile"
              />

              {/* Upload Overlay (Only visible in Edit Mode) */}
              {isEdit && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera className="text-white w-8 h-8" />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* 2. User Name & Badge */}
            <div className="flex-1 w-full text-center sm:text-left mb-2">
              {isEdit ? (
                <input
                  className="text-3xl font-bold bg-transparent border-b border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {formData.name}
                  <BadgeCheck className="text-blue-500" size={24} />
                </h1>
              )}
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Verified Patient
              </p>
            </div>

            {/* 3. Action Button (Edit / Save) */}
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

          {/* === SECTION C: DETAILS GRID === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Contact Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2">
                Contact Details
              </h3>

              <ProfileField
                icon={Mail}
                label="Email"
                value={formData.email}
                readOnly={true} // Email should usually be immutable
                isEdit={isEdit}
              />

              <ProfileField
                icon={Phone}
                label="Phone"
                value={formData.phone}
                isEdit={isEdit}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />

              <ProfileField
                icon={MapPin}
                label="Address Line 1"
                value={formData.address?.line1}
                isEdit={isEdit}
                // Nested Object Update Logic
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    address: { ...p.address, line1: e.target.value },
                  }))
                }
              />

              <ProfileField
                icon={MapPin}
                label="Address Line 2"
                value={formData.address?.line2}
                isEdit={isEdit}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    address: { ...p.address, line2: e.target.value },
                  }))
                }
              />
            </div>

            {/* Column 2: Personal Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2">
                Basic Information
              </h3>

              <ProfileField
                icon={User}
                label="Gender"
                value={formData.gender}
                options={["Male", "Female", "Other"]}
                isEdit={isEdit}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, gender: e.target.value }))
                }
              />

              <ProfileField
                icon={Calendar}
                label="Date of Birth"
                type="date"
                isEdit={isEdit}
                /* * FIX: Date Parsing Issue
                 * The backend sends full ISO strings (YYYY-MM-DDTHH:mm:ss).
                 * HTML <input type="date"> ONLY accepts "YYYY-MM-DD".
                 * We split by 'T' to extract just the date part.
                 */
                value={formData.dob ? formData.dob.split('T')[0] : ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, dob: e.target.value }))
                }
              />
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;