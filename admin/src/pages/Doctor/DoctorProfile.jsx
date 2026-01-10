import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { doctorToken, profileData, getProfileData, backendURL } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorToken) getProfileData();
  }, [doctorToken, getProfileData]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        fees: profileData.fees,
        address: profileData.address || { line1: "", line2: "" },
        available: profileData.available,
      });
    }
  }, [profileData]);

  const updateProfile = async () => {
    if (!formData) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendURL}/api/doctor/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${doctorToken}` } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success("Profile updated successfully");
      setIsEdit(false);
      getProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profileData || !formData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl transition-all duration-500">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500">View and manage your professional details</p>
        </div>
        {!isEdit ? (
          <button
            onClick={() => setIsEdit(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEdit(false)}
              className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={updateProfile}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <img
              className="w-full aspect-square object-cover rounded-2xl bg-indigo-50"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Availability</span>
              <div 
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  formData.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${formData.available ? "bg-emerald-500" : "bg-red-500"}`} />
                {formData.available ? "Active" : "Away"}
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <input
                type="checkbox"
                id="available"
                className="w-5 h-5 accent-primary cursor-pointer disabled:opacity-50"
                checked={formData.available}
                disabled={!isEdit}
                onChange={() => setFormData((p) => ({ ...p, available: !p.available }))}
              />
              <label htmlFor="available" className="text-sm font-medium text-slate-700 cursor-pointer">
                Available for Bookings
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Information Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">{profileData.name}</h2>
              <div className="flex items-center gap-2 text-primary font-medium bg-primary/5 px-4 py-1.5 rounded-full text-sm">
                {profileData.degree} — {profileData.speciality}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Experience Section */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Experience</label>
                <p className="text-lg font-semibold text-slate-700">{profileData.experience}</p>
              </div>

              {/* Fees Section */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation Fee</label>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-slate-800">{currency}</span>
                  {isEdit ? (
                    <input
                      type="number"
                      className="text-xl font-bold border-b-2 border-primary outline-none w-28 bg-transparent"
                      value={formData.fees}
                      onChange={(e) => setFormData((p) => ({ ...p, fees: Number(e.target.value) }))}
                    />
                  ) : (
                    <span className="text-xl font-bold text-slate-800">{profileData.fees}</span>
                  )}
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Professional Bio</label>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                {profileData.about}
              </p>
            </div>

            {/* Address Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Clinic Location</label>
              <div className="space-y-2">
                {isEdit ? (
                  <div className="grid grid-cols-1 gap-3 max-w-md">
                    <input
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary outline-none transition-all text-sm"
                      placeholder="Address Line 1"
                      value={formData.address.line1}
                      onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                    />
                    <input
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary outline-none transition-all text-sm"
                      placeholder="Address Line 2"
                      value={formData.address.line2}
                      onChange={(e) => setFormData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-slate-600 italic bg-slate-50 p-4 rounded-2xl w-fit border border-dashed border-slate-200">
                    <p className="text-sm">
                      {profileData.address?.line1} <br />
                      {profileData.address?.line2}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;