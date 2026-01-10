import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Award, Clock, Banknote, 
  Info, ChevronRight, CalendarCheck 
} from "lucide-react";

const Appointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, getDoctorsData } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  useEffect(() => { getDoctorsData(); }, [doctorId]);

  useEffect(() => {
    const info = doctors.find((doc) => doc._id === doctorId);
    setDocInfo(info || null);
  }, [doctors, doctorId]);

  const getBookedSlotsForDate = (dateStr) => {
    return docInfo?.slots_booked?.[dateStr] || [];
  };

  useEffect(() => {
    if (!docInfo) return;
    const generateSlots = () => {
      const today = new Date();
      const slotsArr = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        const endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        if (today.toDateString() === currentDate.toDateString()) {
          currentDate.setHours(currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10);
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }

        const daySlots = [];
        while (currentDate < endTime) {
          const formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toUpperCase();
          daySlots.push({ datetime: new Date(currentDate), time: formattedTime });
          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
        slotsArr.push(daySlots);
      }
      setDocSlots(slotsArr);
    };
    generateSlots();
  }, [docInfo]);

  const bookAppointmentHandler = async () => {
    try {
      if (!slotTime) return;
      const slotDate = docSlots[slotIndex][0].datetime.toISOString().split("T")[0];
      const { data } = await api.post("/user/book-appointment", {
        doctorId, slotDate, slotTime: slotTime.trim().toUpperCase()
      });

      if (data.success) {
        toast.success("Appointment secured!");
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  if (!docInfo) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-10 transition-all duration-500">
      
      {/* ---------------- DOCTOR PROFILE CARD ---------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        {/* Image Container */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="relative group overflow-hidden rounded-4xl shadow-2xl bg-secondary/10 border border-white/20">
            <img className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" src={docInfo.image} alt={docInfo.name} />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Info Container */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                {docInfo.name} <ShieldCheck className="text-primary" size={24} />
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                  {docInfo.speciality}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  <Award size={16} className="text-orange-400" /> {docInfo.experience} Experience
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Consultation Fee</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{currencySymbol}{docInfo.fees}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
              <Info size={16} className="text-primary" /> About Specialist
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm max-w-2xl">
              {docInfo.about}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---------------- BOOKING SECTION ---------------- */}
      <div className="mt-16 lg:ml-8 lg:pl-4 border-l-2 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <CalendarCheck className="text-primary" size={24} />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Schedule Appointment</h2>
        </div>

        {/* Days Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {docSlots.map((item, index) => item.length > 0 && (
            <motion.div
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSlotIndex(index); setSlotTime(""); }}
              className={`min-w-20 py-6 flex flex-col items-center rounded-3xl cursor-pointer transition-all duration-300 border ${
                slotIndex === index 
                ? "bg-primary text-white shadow-lg shadow-primary/30 border-primary -translate-y-1" 
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/50"
              }`}
            >
              <span className="text-[10px] font-bold tracking-widest opacity-80 mb-2">{daysOfWeek[item[0].datetime.getDay()]}</span>
              <span className="text-xl font-black">{item[0].datetime.getDate()}</span>
            </motion.div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="mt-10">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest mb-6">Available Time Slots</p>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="wait">
              {docSlots[slotIndex]?.length ? (
                docSlots[slotIndex].map((item, index) => {
                  const isBooked = getBookedSlotsForDate(docSlots[slotIndex][0].datetime.toISOString().split("T")[0]).includes(item.time);
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      disabled={isBooked}
                      onClick={() => setSlotTime(item.time)}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isBooked ? "bg-slate-100 dark:bg-slate-800 text-slate-300 cursor-not-allowed line-through border-transparent" :
                        slotTime === item.time ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105" :
                        "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-primary/50"
                      }`}
                    >
                      {item.time.toLowerCase()}
                    </motion.button>
                  );
                })
              ) : <p className="text-slate-400 italic">No available slots for this day.</p>}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={bookAppointmentHandler}
          disabled={!slotTime}
          className="mt-12 group flex items-center gap-4 bg-primary text-white px-12 py-5 rounded-4xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 disabled:opacity-30 disabled:grayscale transition-all"
        >
          Confirm Appointment <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="mt-32">
        <RelatedDoctors doctorId={doctorId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};

export default Appointment;