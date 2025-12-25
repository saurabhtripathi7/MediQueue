import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Upload, User, Mail, Lock, Stethoscope,
  MapPin, IndianRupee, GraduationCap, Eye, EyeOff, 
  FileText, ChevronDown, Camera, BriefcaseMedical
} from "lucide-react";


const InputWrapper = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
    <div className="relative group">
      {/* Render children (input/select) FIRST */}
      {children}
      
      {/* Render Icon SECOND so it sits on top of the input background */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
    <div className="p-2 bg-indigo-50 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
  </div>
);
// --------------------------------

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { backendURL, adminToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!docImg) return toast.error("Image Not Selected");

    try {
      setLoading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        backendURL + "/api/admin/add-doctor",
        formData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setProgress(0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 placeholder-gray-400 text-sm shadow-sm hover:border-gray-300";

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <form onSubmit={onSubmitHandler} className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
             <p className="text-gray-500 text-sm mt-1">Create a new profile for the medical team.</p>
          </div>
          {loading && (
             <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
               <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                 <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-xs font-semibold text-primary">{progress}%</span>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Image Upload */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <label htmlFor="doc-img" className="cursor-pointer group flex flex-col items-center gap-4 w-full">
                <div className={`relative w-40 h-40 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-md ${docImg ? 'border-primary' : 'border-gray-100 group-hover:border-indigo-100'}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                    alt="Upload"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white w-10 h-10" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <h3 className="text-lg font-bold text-gray-800">{name || "Doctor Name"}</h3>
                  <div className="mt-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Upload className="w-4 h-4" />
                    {docImg ? "Change Picture" : "Upload Picture"}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Allowed: JPG, PNG. Max 5MB</p>
                </div>
              </label>
              <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
            </div>
          </div>

          {/* RIGHT COLUMN: Form Details */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* 1. Account Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <SectionHeader title="Account Details" icon={User} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Full Name" icon={User}>
                  <input className={inputClasses} placeholder="e.g. Dr. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </InputWrapper>
                <InputWrapper label="Email Address" icon={Mail}>
                  <input className={inputClasses} placeholder="doctor@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </InputWrapper>
                <InputWrapper label="Set Password" icon={Lock}>
                   <input className={inputClasses} placeholder="••••••••" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                   </button>
                </InputWrapper>
                <InputWrapper label="Consultation Fees" icon={IndianRupee}>
                  <input className={inputClasses} placeholder="0.00" type="number" min="0" value={fees} onChange={(e) => { const val = e.target.value; if (val === '' || Number(val) >= 0) setFees(val); }} required />
                </InputWrapper>
              </div>
            </div>

            {/* 2. Professional Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <SectionHeader title="Professional Information" icon={BriefcaseMedical} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <InputWrapper label="Speciality" icon={Stethoscope}>
                   <div className="relative">
                      <select className={`${inputClasses} appearance-none cursor-pointer`} value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                        <option value="General physician">General physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                   </div>
                </InputWrapper>

                <InputWrapper label="Degree" icon={GraduationCap}>
                  <input className={inputClasses} placeholder="e.g. MBBS, MS" value={degree} onChange={(e) => setDegree(e.target.value)} required />
                </InputWrapper>

                <InputWrapper label="Experience" icon={FileText}>
                   <div className="relative">
                      <select className={`${inputClasses} appearance-none cursor-pointer`} value={experience} onChange={(e) => setExperience(e.target.value)}>
                        {[...Array(10)].map((_, i) => (
                           <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                   </div>
                </InputWrapper>
              </div>
              <div className="mt-6">
                 <label className="text-sm font-medium text-gray-700 ml-1 mb-1.5 block">About Doctor</label>
                 <textarea className={`${inputClasses} h-32 resize-none pl-4 pt-3`} placeholder="Write a professional bio..." value={about} onChange={(e) => setAbout(e.target.value)} required />
              </div>
            </div>

            {/* 3. Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <SectionHeader title="Clinic Address" icon={MapPin} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWrapper label="Address Line 1" icon={MapPin}>
                    <input className={inputClasses} placeholder="Street address" value={address1} onChange={(e) => setAddress1(e.target.value)} required />
                  </InputWrapper>
                  <InputWrapper label="Address Line 2 (Optional)" icon={MapPin}>
                    <input className={inputClasses} placeholder="City, State, Zip" value={address2} onChange={(e) => setAddress2(e.target.value)}/>
                  </InputWrapper>
               </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className={`px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg shadow-primary/20 transform transition-all duration-300 flex items-center gap-2 ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95"}`}>
                {loading ? "Saving..." : "Add Doctor"}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;