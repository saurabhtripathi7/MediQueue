import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

/* ===================== HELPER COMPONENT ===================== */
const MetricBox = ({ label, value, color, icon }) => {
  const styles = {
    indigo: "border-indigo-500 bg-indigo-50 text-indigo-600",
    blue: "border-blue-500 bg-blue-50 text-blue-600",
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-600",
    purple: "border-purple-500 bg-purple-50 text-purple-600",
  };

  return (
    <div className={`bg-white p-6 rounded-2xl border-l-4 ${styles[color].split(' ')[0]} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between group`}>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Live - Data</span>
      </div>
      <div className={`p-3 rounded-xl ${styles[color].split(' ')[1]} group-hover:scale-110 transition-transform`}>
        <img className="w-8 h-8 object-contain" src={icon} alt={label} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { adminToken, getAdminDashboardStats, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (adminToken) {
      getAdminDashboardStats().finally(() => setLoading(false));
    }
  }, [adminToken, getAdminDashboardStats]);

  const handleCancel = async (id) => {
    if (cancellingId) return;
    setCancellingId(id);
    await cancelAppointment(id);
    setCancellingId(null);
  };

  /* ===================== SHARED UI COMPONENTS ===================== */
  const StatusIndicator = ({ item }) => {
    if (item.cancelled) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100 uppercase">Cancelled</span>;
    if (item.isCompleted) return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">Completed</span>;
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8F9FD] min-h-screen w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Platform Performance</h1>
          <p className="text-sm text-slate-500 font-medium">Backend-verified activity metrics</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm w-fit uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync Active
        </div>
      </div>

      {/* KPI GRID — ALL DATA FROM BACKEND */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Revenue */}
  <MetricBox 
    label="Total Revenue" 
    value={`${currency}${(dashData?.earnings ?? 0).toLocaleString()}`} 
    icon={assets.earning_icon || assets.doctor_icon} 
    color="indigo" 
  />

  {/* Total Doctors */}
  <MetricBox 
    label="Total Doctors" 
    value={(dashData?.doctors ?? 0).toLocaleString()} 
    icon={assets.doctor_icon} 
    color="blue" 
  />

  {/* Appointments */}
  <MetricBox 
    label="Appointments" 
    value={(dashData?.appointments ?? 0).toLocaleString()} 
    icon={assets.appointments_icon} 
    color="emerald" 
  />

  {/* Total Patients */}
  <MetricBox 
    label="Total Patients" 
    value={(dashData?.patients ?? 0).toLocaleString()} 
    icon={assets.patients_icon} 
    color="purple" 
  />
</div>

      {/* PERFORMANCE BREAKDOWN (Optional extension if backend provides it) */}
      {dashData.completionRate && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase mb-4">Platform Completion Rate</p>
           <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full transition-all duration-1000" style={{width: `${dashData.completionRate}%`}} />
           </div>
           <p className="mt-2 text-right font-black text-slate-700">{dashData.completionRate}%</p>
        </div>
      )}

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Latest Transactions</h2>
          <Link to="/all-appointments" className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all">
            View All
          </Link>
        </div>

        {/* TABLE VIEW */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[11px] text-slate-400 uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashData.latestAppointments.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full border border-slate-100 shadow-sm object-cover" src={item.docData.image} alt="" />
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

        {dashData.latestAppointments.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic text-sm">No recent activity detected.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;