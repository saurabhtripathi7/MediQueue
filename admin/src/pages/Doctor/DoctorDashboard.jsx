import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

const DoctorDashboard = () => {
  const {
    doctorToken,
    dashData,
    getDoctorDashboardStats,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { currency, slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctorToken) getDoctorDashboardStats();
  }, [doctorToken, getDoctorDashboardStats]);

  if (!dashData)
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Activity className="animate-spin text-primary w-10 h-10" />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-10">
      {/* 1. TOP KPI SECTION: */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Total Earnings"
          value={`${currency}${dashData.earnings.toLocaleString()}`}
          icon={<Wallet className="text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          label="Appointments"
          value={dashData.appointments}
          icon={<CalendarCheck className="text-orange-600" />}
          bgColor="bg-orange-100"
        />
        <StatCard
          label="Total Patients"
          value={dashData.patients}
          icon={<Users className="text-emerald-600" />}
          bgColor="bg-emerald-100"
        />
        <StatCard
          label="Pending Tasks"
          value={dashData.pendingAppointments}
          icon={<Clock className="text-purple-600" />}
          bgColor="bg-purple-100"
        />
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER: LATEST BOOKINGS (66% Width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">
              Latest Bookings
            </h2>
            <button
              onClick={() => navigate("/doctor-appointments")}
              className="text-primary font-bold text-sm hover:underline transition-all"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-50">
                {dashData.latestAppointments?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-primary/30 transition-all"
                          src={item.userData.image}
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.userData.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {slotDateFormat(item.slotDate)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {item.cancelled ? (
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                          Completed
                        </span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2 bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-xl transition-all"
                          >
                            <XCircle size={20} />
                          </button>
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2 bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-500 rounded-xl transition-all"
                          >
                            <CheckCircle size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: EFFICIENCY ANALYTICS (33% Width) */}
        <div className="flex flex-col gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-primary w-5 h-5" />
              <h3 className="font-bold text-slate-800 text-lg">
                Efficiency Analytics
              </h3>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-slate-500">
                    Completion Rate
                  </span>
                  <span className="text-3xl font-black text-slate-800">
                    {dashData.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full p-1">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
                    style={{ width: `${dashData.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Completed
                  </p>
                  <p className="text-2xl font-black text-emerald-600">
                    {dashData.completedAppointments}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Cancelled
                  </p>
                  <p className="text-2xl font-black text-red-500">
                    {dashData.cancelledAppointments}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM STATUS CARD */}
          <div className="bg-primary p-8 rounded-3xl shadow-xl shadow-primary/20 text-white overflow-hidden relative group">
            <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold mb-2">System Status</h4>
            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
              Everything is running smoothly. Your server is fully operational.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Active Server
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---  STAT CARD --- */
const StatCard = ({ label, value, icon, bgColor }) => (
  <div className="bg-white p-7 rounded-4xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-primary/50 transition-all hover:shadow-md group">
    <div
      className={`${bgColor} w-16 h-16 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3`}
    >
      {React.cloneElement(icon, { size: 30 })}
    </div>
    <div>
      <p className="text-3xl font-black text-slate-800 tracking-tight">
        {value}
      </p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  </div>
);

export default DoctorDashboard;
