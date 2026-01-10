import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  Calendar, Clock, MapPin, CreditCard, 
  CheckCircle2, XCircle, AlertCircle, ArrowRight, Sparkles, Activity
} from "lucide-react";

const MyAppointments = () => {
  const { currencySymbol } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  // --- MAGNETIC SPOTLIGHT LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const magneticAura = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.12), transparent 80%)`
  );

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const formatDate = (slotDate) => {
    if (!slotDate) return "";
    const dateObj = new Date(slotDate);
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/appointments");
      if (res.data.success) {
        const sorted = res.data.appointments.sort((a, b) => {
            const getWeight = (apt) => {
                if (apt.cancelled) return 2;
                if (apt.isCompleted) return 1;
                return 0;
            };
            const weightA = getWeight(a);
            const weightB = getWeight(b);
            if (weightA !== weightB) return weightA - weightB;
            const dateA = new Date(a.slotDate);
            const dateB = new Date(b.slotDate);
            return weightA === 0 ? dateA - dateB : dateB - dateA;
        });
        setAppointments(sorted);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      const res = await api.post("/user/cancel-appointment", { appointmentId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAppointments();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = async (appointment) => {
    try {
      setPayingId(appointment._id);
      const res = await api.post("/user/payment-razorpay", { appointmentId: appointment._id });
      if (!res.data.success) return;

      const { order } = res.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response) {
            const verifyRes = await api.post("/user/verify-razorpay", { ...response });
            if (verifyRes.data.success) {
                toast.success("Payment successful");
                fetchAppointments();
            }
        },
        modal: { ondismiss: () => setPayingId(null) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Gateway error");
    } finally {
      setPayingId(null);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const activeList = appointments.filter(apt => !apt.cancelled && !apt.isCompleted);
  const historyList = appointments.filter(apt => apt.cancelled || apt.isCompleted);
  const currentView = activeTab === "active" ? activeList : historyList;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-primary border-r-transparent relative z-10" />
        </div>
        <div className="text-center space-y-1">
            <p className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-[0.3em]">Syncing Neural Schedule</p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Establishing secure link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-10 mt-12 pb-32 overflow-visible">
      
      {/* 1. HEADER & NAVIGATION VESSEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">
            <Activity size={12} className="animate-pulse" /> Live Patient Portal
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Personal <span className="text-primary dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-teal-400 dark:to-emerald-500">Timeline.</span>
          </h2>
        </motion.div>

        <div className="flex bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-3xl relative w-full md:w-auto border border-slate-200 dark:border-white/5 backdrop-blur-xl">
          {["active", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-10 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-500 w-full md:w-36 ${
                activeTab === tab ? "text-primary dark:text-teal-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-white/10 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KINETIC LIST VESSEL */}
      <AnimatePresence mode="wait">
        {currentView.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white/40 dark:bg-slate-950/20 backdrop-blur-3xl rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <p className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-widest">No {activeTab} Records</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Your medical journey is waiting to begin.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            onMouseMove={handleMouseMove}
            className="grid gap-10 group/list"
          >
            {currentView.map((apt, index) => (
              <motion.div
                layout
                key={apt._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`group/card relative overflow-hidden transition-all duration-500 
                           bg-white border rounded-[3rem] p-6 md:p-10 flex flex-col lg:flex-row items-center gap-10
                           dark:bg-slate-950/40 dark:backdrop-blur-3xl dark:border-white/10
                           hover:shadow-2xl dark:hover:shadow-[0_0_50px_rgba(45,212,191,0.08)]
                           ${apt.cancelled ? "opacity-60 grayscale-[0.5]" : "border-slate-100 dark:border-white/5"}`}
              >
                {/* Magnetic Aura tracking */}
                <motion.div 
                  className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:group-card:opacity-100 transition-opacity duration-700"
                  style={{ background: magneticAura }}
                />

                {/* DOCTOR PROFILE SECTION */}
                <div className="relative shrink-0 z-10">
                  <div className="absolute -inset-4 bg-linear-to-tr from-primary/30 to-blue-400/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover/card:opacity-100 transition-all duration-700" />
                  <div className="relative p-1 bg-white dark:bg-white/10 rounded-4xl border border-slate-100 dark:border-white/20 shadow-2xl">
                    <img
                        className="w-32 h-32 md:w-44 md:h-44 rounded-[1.8rem] object-cover bg-slate-50 dark:bg-slate-900 transition-transform duration-700 group-hover/card:scale-105"
                        src={apt.doctorId.image}
                        alt="doctor"
                    />
                  </div>
                </div>

                {/* DATA GRID: Precision Markers */}
                <div className="flex-1 space-y-6 w-full z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary dark:text-teal-400 bg-primary/10 dark:bg-teal-400/10 px-3 py-1 rounded-full border border-primary/20">
                            {apt.doctorId.speciality}
                        </span>
                        {apt.payment && !apt.cancelled && (
                             <div className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                                <Sparkles size={12} className="animate-pulse" /> Payment Verified
                             </div>
                        )}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter group-hover/card:text-primary dark:group-hover/card:text-teal-400 transition-colors">
                      {apt.doctorId.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Location Access</p>
                        <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                            <MapPin size={18} className="text-primary shrink-0" />
                            <p className="text-sm font-bold leading-relaxed">
                                {apt.doctorId.address.line1}<br />
                                <span className="text-xs font-medium text-slate-400">{apt.doctorId.address.line2}</span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Time Marker</p>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <Clock size={18} className="text-blue-500 shrink-0" />
                            <p className="text-sm font-black">
                                {formatDate(apt.slotDate)} <span className="mx-2 text-slate-300 dark:text-slate-700">|</span> 
                                <span className="text-primary dark:text-teal-400">{apt.slotTime}</span>
                            </p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/10 group-hover/card:border-primary/30 transition-all">
                        <CreditCard size={18} className="text-slate-400" />
                        <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{currencySymbol}{apt.doctorId.fees}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Consultation</span>
                     </div>
                     <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] hidden md:block">
                        ID: {apt._id.slice(-8).toUpperCase()}
                     </p>
                  </div>
                </div>

                {/* STATUS & ACTION PILLS */}
                <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0 z-10">
                  {apt.isCompleted ? (
                    <div className="flex items-center justify-center gap-3 py-5 bg-emerald-500/10 text-emerald-500 rounded-3xl border border-emerald-500/20 font-black text-xs uppercase tracking-[0.2em] shadow-inner shadow-emerald-500/5">
                      <CheckCircle2 size={18} /> Visit Complete
                    </div>
                  ) : apt.cancelled ? (
                    <div className={`flex items-center justify-center gap-3 py-5 rounded-3xl border font-black text-xs uppercase tracking-[0.2em] shadow-inner ${apt.payment ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}>
                      {apt.payment ? <AlertCircle size={18} /> : <XCircle size={18} />}
                      {apt.payment ? "Refunded" : "Visit Voided"}
                    </div>
                  ) : (
                    <>
                      {apt.payment ? (
                        <div className="flex items-center justify-center gap-3 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl transition-transform hover:scale-[1.02]">
                          <CheckCircle2 size={16} /> Fully Paid
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={payingId === apt._id}
                          onClick={() => handlePayment(apt)}
                          className="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-[0_15px_35px_rgba(22,163,74,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 group/pay"
                        >
                          {payingId === apt._id ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Finalize Payment <ArrowRight size={18} className="group-hover/pay:translate-x-1 transition-transform" /></>}
                        </motion.button>
                      )}
                      
                      <button
                        disabled={cancellingId === apt._id}
                        onClick={() => { setSelectedAppointmentId(apt._id); setShowConfirm(true); }}
                        className="w-full py-5 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
                      >
                        {cancellingId === apt._id ? "Processing..." : "Abort Visit"}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showConfirm}
        title="Abort Consultation?"
        message={selectedAppointmentId && appointments.find(a => a._id === selectedAppointmentId)?.payment ? "System initiated: Full refund will be routed to your original payment gateway." : "This timeline slot will be released back to the global directory."}
        confirmText="Confirm Void"
        cancelText="Keep Timeline"
        isLoading={cancellingId === selectedAppointmentId}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => { cancelAppointment(selectedAppointmentId); setShowConfirm(false); }}
      />
    </div>
  );
};

export default MyAppointments;