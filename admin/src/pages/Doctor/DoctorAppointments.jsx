import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    doctorToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (doctorToken) {
      getAppointments();
    }
  }, [doctorToken, getAppointments]);

  return (
    <div className="p-4 md:p-8 bg-[#F8F9FD] min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-slate-500 text-sm">Manage and track all patient bookings</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          Total: <span className="text-primary font-bold">{appointments.length}</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
        
        {/* TABLE HEADER - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2.5fr_1fr_1.2fr] gap-4 py-4 px-8 bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p className="text-center">Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-right">Action</p>
        </div>

        {/* APPOINTMENT LIST */}
        <div className="overflow-y-auto max-h-[70vh] divide-y divide-slate-50">
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
               <img src={assets.list_icon} alt="" className="w-12 opacity-20 mb-4" />
               <p className="text-lg font-medium">No appointments found</p>
               <p className="text-sm text-slate-400">Your scheduled list will appear here.</p>
            </div>
          ) : (
            [...appointments].reverse().map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col lg:grid lg:grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2.5fr_1fr_1.2fr] gap-4 items-center py-5 px-8 hover:bg-slate-50/50 transition-colors group"
              >
                {/* # Number (Desktop Only) */}
                <p className="hidden lg:block text-slate-400 font-medium">{index + 1}</p>

                {/* PATIENT INFO */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <img
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    src={item.userId?.image || "/default-user.png"}
                    alt="patient"
                  />
                  <div>
                    <p className="text-slate-900 font-bold leading-none mb-1">
                      {item.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500 lg:hidden">
                      {slotDateFormat(item.slotDate)}, {item.slotTime}
                    </p>
                  </div>
                </div>

                {/* PAYMENT STATUS */}
                <div className="w-full lg:w-auto flex lg:block">
                   <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter border ${
                     item.payment 
                     ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                     : "bg-blue-50 text-blue-600 border-blue-100"
                   }`}>
                    {item.payment ? "Online" : "Cash"}
                  </span>
                </div>

                {/* AGE */}
                <p className="hidden lg:block text-center text-slate-600 font-medium">
                  {item.userId?.dob ? calculateAge(item.userId.dob) : "—"}
                </p>

                {/* DATE & TIME (Desktop) */}
                <p className="hidden lg:block text-slate-600 font-medium">
                  {slotDateFormat(item.slotDate)} <span className="text-slate-400 mx-1">|</span> {item.slotTime}
                </p>

                {/* FEES */}
                <p className="w-full lg:w-auto text-slate-800 font-bold text-base">
                  <span className="text-slate-400 font-medium mr-1">{currency}</span>
                  {item.amount}
                </p>

                {/* ACTIONS */}
                <div className="flex items-center justify-end w-full lg:w-auto gap-3">
                  {item.cancelled ? (
                    <span className="text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      Completed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all group/btn"
                        title="Cancel Appointment"
                      >
                        <img className="w-6 opacity-70 group-hover/btn:opacity-100" src={assets.cancel_icon} alt="Cancel" />
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="p-2 bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 rounded-full transition-all group/btn"
                        title="Mark Completed"
                      >
                        <img className="w-6 opacity-70 group-hover/btn:opacity-100" src={assets.tick_icon} alt="Complete" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;