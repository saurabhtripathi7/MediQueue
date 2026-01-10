import React, { useContext, useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Save,
  Edit3,
  ShieldCheck,
  Settings,
  X,
  Lock,
  Activity,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const { userData, updateUserProfileData } = useContext(AppContext);

  /* --- Identity Context: Saurabh Tripathi | CS 2027 --- */

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- MAGNETIC SPOTLIGHT LOGIC (Fixed Hook Order) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // ✅ HOOK RULE FIX: useTransform must be called before early returns
  const magneticAura = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.15), transparent 80%)`
  );

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  useEffect(() => {
    if (userData) setFormData(userData);
  }, [userData]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Early return only happens after all hooks are declared
  if (!formData) return null;

  const handleEdit = () => {
    setOriginalData(JSON.parse(JSON.stringify(formData)));
    setIsEdit(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setImage(null);
    setIsEdit(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserProfileData({ ...formData, image });
      setIsEdit(false);
      setImage(null);
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 overflow-visible">
      {/* Ambient Background Engine */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-0 right-0 w-125 h-125 bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: IDENTITY VESSEL --- */}
        <motion.div 
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="lg:col-span-4 group/vessel relative"
        >
          <div className="sticky top-28 overflow-hidden bg-white/80 dark:bg-slate-950/40 dark:backdrop-blur-3xl rounded-[3rem] p-8 border border-slate-200 dark:border-white/20 shadow-2xl text-center">
            
            {/* Magnetic Aura tracking using the fixed hook variable */}
            <motion.div 
              className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-hover/vessel:opacity-100 transition-opacity duration-700"
              style={{ background: magneticAura }}
            />

            <div className="relative z-10">
              <div className="relative inline-block group/img">
                <motion.img
                  whileHover={isEdit ? { scale: 1.05 } : {}}
                  src={previewUrl ?? formData.image ?? ""}
                  alt="Profile"
                  className={`w-48 h-48 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-2xl transition-all ${isEdit ? 'ring-4 ring-teal-500/30' : ''}`}
                />
                
                <AnimatePresence>
                  {isEdit && (
                    <motion.label 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -bottom-2 -right-2 p-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl cursor-pointer shadow-xl transition-all"
                    >
                      <Camera size={20} />
                      <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 space-y-4">
                {isEdit ? (
                  <input
                    className="w-full text-2xl font-black text-center bg-slate-100 dark:bg-white/5 p-4 rounded-2xl outline-none border border-transparent focus:border-teal-500/50 transition-all text-slate-800 dark:text-white"
                    value={formData.name || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  />
                ) : (
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black flex justify-center items-center gap-2 text-slate-900 dark:text-white tracking-tighter">
                      {formData.name}
                      <ShieldCheck className="text-teal-500" size={24} />
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                      Account Verified
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest border border-teal-500/20">
                  <Sparkles size={12} /> Elite Tier Member
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: PRECISION DATA SECTIONS --- */}
        <div className="lg:col-span-8 space-y-8">
          <Section title="System Access" icon={Lock} delay={0.1}>
            <EditableField icon={Mail} label="User Email" value={formData.email} readOnly />
            <EditableField
              icon={Phone}
              label="Secure Contact"
              value={formData.phone}
              isEdit={isEdit}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
          </Section>

          <Section title="Location Profile" icon={MapPin} delay={0.2}>
            <EditableField
              icon={MapPin}
              label="Primary Address Line 1"
              value={formData.address?.line1}
              isEdit={isEdit}
              onChange={(e) => setFormData((p) => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
            />
            <EditableField
              icon={MapPin}
              label="Address Line 2 (Optional)"
              value={formData.address?.line2}
              isEdit={isEdit}
              onChange={(e) => setFormData((p) => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
            />
          </Section>

          <Section title="Biometric Data" icon={Activity} delay={0.3}>
            <EditableField
              icon={User}
              label="Gender"
              value={formData.gender}
              isEdit={isEdit}
              options={["Male", "Female", "Other"]}
              onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
            />
            <EditableField
              icon={Calendar}
              label="DOB Marker"
              type="date"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              isEdit={isEdit}
              onChange={(e) => setFormData((p) => ({ ...p, dob: e.target.value }))}
            />
          </Section>
        </div>
      </div>

      {/* --- FLOATING ACTION FAB --- */}
      <div className="fixed bottom-10 right-10 flex gap-4 z-50">
        <AnimatePresence mode="wait">
          {isEdit ? (
            <motion.div key="edit-mode" className="flex gap-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
              <button onClick={handleCancel} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-all">
                Discard Changes
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-teal-500 text-white shadow-[0_10px_30px_rgba(45,212,191,0.3)] hover:scale-105 transition-all">
                {isSaving ? "Syncing..." : "Save Vessel"}
              </button>
            </motion.div>
          ) : (
            <motion.button key="view-mode" onClick={handleEdit} className="px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xl hover:scale-110 transition-all flex items-center gap-3">
              <Edit3 size={18} /> Edit Profile
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* --- REUSABLE BIO-LUMINESCENT COMPONENTS --- */

const Section = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white/70 dark:bg-slate-950/40 dark:backdrop-blur-3xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover-glow"
  >
    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6 mb-8">
      <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
        <Icon size={22} />
      </div>
      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  </motion.div>
);

const EditableField = ({ icon: Icon, label, value, isEdit, onChange, type = "text", options, readOnly }) => {
  const editable = isEdit && !readOnly;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 ml-2">
        {label}
      </label>

      <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300
          ${editable 
            ? "border-teal-500/50 bg-white dark:bg-white/5 shadow-[0_0_20px_rgba(45,212,191,0.1)]" 
            : "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent opacity-80"}`}
      >
        {readOnly ? (
          <Lock size={18} className="text-slate-300" />
        ) : (
          <Icon size={18} className={editable ? "text-teal-400" : "text-slate-400"} />
        )}
        <div className="flex-1 overflow-hidden">
          {editable ? (
            options ? (
              <select value={value ?? ""} onChange={onChange} className="bg-transparent w-full outline-none font-bold text-slate-800 dark:text-white appearance-none cursor-pointer">
                {options.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
              </select>
            ) : (
              <input type={type} value={value ?? ""} onChange={onChange} className="bg-transparent w-full outline-none font-bold text-slate-800 dark:text-white" />
            )
          ) : (
            <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">
              {value || "N/A"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;