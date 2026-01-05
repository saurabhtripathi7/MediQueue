import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  /* ===================== CONTEXT ===================== */
  const { adminToken, getAdminDashboardStats, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  /* ===================== LOCAL UI STATE ===================== */
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  /* ===================== FETCH DASHBOARD DATA ===================== */
  useEffect(() => {
    if (adminToken) {
      getAdminDashboardStats().finally(() => setLoading(false));
    }
  }, [adminToken, getAdminDashboardStats]);

  /* ===================== HANDLERS ===================== */
  const handleCancel = async (id) => {
    if (cancellingId) return;
    setCancellingId(id);
    await cancelAppointment(id);
    setCancellingId(null);
  };

  /* ===================== HELPER: REVENUE CALCULATION (from latest appointments)===================== */
  const calculateRevenue = () => {
  if (!dashData?.latestAppointments) return 0;

  return dashData.latestAppointments.reduce((acc, item) => {
    if (item.isCompleted && !item.refunded) {
      return acc + Number(item.amount || 0);
    }
    return acc;
  }, 0);
};


  /* ===================== SHARED UI COMPONENTS ===================== */
  const StatusIndicator = ({ item }) => {
    if (item.cancelled) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100 uppercase tracking-tighter">Cancelled</span>;
    if (item.isCompleted) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">Completed</span>;
    return (
      <button 
        onClick={() => handleCancel(item._id)}
        disabled={cancellingId === item._id}
        className="p-2 hover:bg-red-50 rounded-full transition-all group/btn border border-transparent hover:border-red-100 disabled:opacity-30"
      >
        <img className="w-5 h-5 opacity-70 group-hover/btn:opacity-100" src={assets.cancel_icon} alt="Cancel" />
      </button>
    );
  };

  /* ===================== LOADING STATE ===================== */
  if (loading || !dashData) {
    return (
      <div className="p-4 md:p-8 animate-pulse space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8F9FD] min-h-screen w-full overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial & Activity Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time platform performance</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm w-fit uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* KPI GRID (Revenue + Statistics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-6 rounded-2xl border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between group">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
            <p className="text-2xl font-black text-slate-800">{currency}{calculateRevenue().toLocaleString()}</p>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">+5.2% Growth</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform">
             <img className="w-8 h-8 object-contain" src={assets.doctor_icon} alt="Revenue" />
          </div>
        </div>

        {/* Mapped Stats Cards */}
        {[
          { label: "Total Doctors", value: dashData.doctors, icon: assets.doctor_icon, color: "border-blue-500", bg: "bg-blue-50" },
          { label: "Appointments", value: dashData.appointments, icon: assets.appointments_icon, color: "border-emerald-500", bg: "bg-emerald-50" },
          { label: "Total Patients", value: dashData.patients, icon: assets.patients_icon, color: "border-purple-500", bg: "bg-purple-50" },
        ].map((item) => (
          <div key={item.label} className={`bg-white p-6 rounded-2xl border-l-4 ${item.color} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between group`}>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-800">{item.value.toLocaleString()}</p>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Active Status</span>
            </div>
            <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
              <img className="w-8 h-8 object-contain" src={item.icon} alt="" />
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
          <h2 className="font-bold text-slate-800 text-lg">Latest Transactions</h2>
          <Link
            to="/all-appointments"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl border border-blue-100 transition-all"
          >
            View All
          </Link>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[11px] text-slate-400 uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashData.latestAppointments.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={item.docData.image} alt="" />
                      <span className="font-bold text-slate-700 text-sm">{item.docData.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{slotDateFormat(item.slotDate)}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.slotTime}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {currency}{item.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusIndicator item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden divide-y divide-slate-100">
          {dashData.latestAppointments.map((item) => (
            <div key={item._id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" src={item.docData.image} alt="" />
                  <div>
                    <p className="font-bold text-slate-800">{item.docData.name}</p>
                    <p className="text-xs text-slate-500">{slotDateFormat(item.slotDate)} • {item.slotTime}</p>
                  </div>
                </div>
                <StatusIndicator item={item} />
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-2">
                <p className="text-slate-400 font-bold uppercase text-[10px]">Amount</p>
                <p className="font-bold text-slate-800">{currency}{item.amount}</p>
              </div>
            </div>
          ))}
        </div>

        {dashData.latestAppointments.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic text-sm font-medium">No recent activity detected.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;