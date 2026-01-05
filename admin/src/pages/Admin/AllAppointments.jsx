import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const adminToken = localStorage.getItem("adminToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (adminToken) {
      getAllAppointments().finally(() => setLoading(false));
    }
  }, [adminToken, getAllAppointments]);

  const getImage = (img) => {
    return img && typeof img === "string" && img.trim() !== ""
      ? img
      : assets.avatar_placeholder;
  };

  // Shared Status Component for consistency
  const StatusBadge = ({ item }) => {
    if (item.cancelled) {
      return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Cancelled</span>;
    }
    if (item.isCompleted) {
      return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Completed</span>;
    }
    return (
      <button
        onClick={() => cancelAppointment(item._id)}
        className="p-2 hover:bg-red-50 rounded-full transition-all active:scale-90"
        title="Cancel Appointment"
      >
        <img className="w-6 h-6" src={assets.cancel_icon} alt="cancel" />
      </button>
    );
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading appointments...</div>;

  return (
    <div className="w-full m-2 sm:m-5">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800">All Appointments</h1>
          <p className="text-sm text-gray-500">Manage patient bookings and schedules</p>
        </div>
        <div className="bg-white border px-4 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-gray-400 block uppercase">Total</span>
          <span className="font-bold text-lg">{appointments.length}</span>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW (Visible on md screens and up) --- */}
      <div className="hidden md:block bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="max-h-[80vh] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b z-10">
              <tr className="text-gray-500 text-[13px] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">#</th>
                <th className="py-4 px-6 font-semibold">Patient</th>
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Doctor</th>
                <th className="py-4 px-6 font-semibold text-right">Fees</th>
                <th className="py-4 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6 text-gray-400 text-xs">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full object-cover border border-gray-100" src={getImage(item.userData?.image)} alt="" />
                      <div>
                        <p className="font-medium text-gray-900 leading-none">{item.userData?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{calculateAge(item.userData?.dob)} Years</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-700">{slotDateFormat(item.slotDate)}</div>
                    <div className="text-xs text-gray-400">{item.slotTime}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <img className="w-6 h-6 rounded-full bg-gray-100" src={getImage(item.docData?.image)} alt="" />
                      <span className="text-sm text-gray-600">{item.docData?.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {currency}{item.amount}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <StatusBadge item={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARD VIEW (Visible only on small screens) --- */}
      <div className="md:hidden space-y-4">
        {appointments.map((item, index) => (
          <div key={item._id} className="bg-white border rounded-xl p-4 shadow-sm active:ring-2 ring-blue-100 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img className="w-12 h-12 rounded-full border border-gray-100" src={getImage(item.userData?.image)} alt="" />
                <div>
                  <p className="font-bold text-gray-900">{item.userData?.name}</p>
                  <p className="text-xs text-gray-500">{calculateAge(item.userData?.dob)} Years • {item.slotTime}</p>
                </div>
              </div>
              <p className="font-bold text-lg text-blue-600">{currency}{item.amount}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50 mb-4">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Doctor</p>
                <p className="text-sm text-gray-700 font-medium">{item.docData?.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Appointment Date</p>
                <p className="text-sm text-gray-700 font-medium">{slotDateFormat(item.slotDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">ID: #{item._id.slice(-6)}</span>
              <StatusBadge item={item} />
            </div>
          </div>
        ))}
      </div>
      
      {appointments.length === 0 && (
        <div className="bg-white border rounded-xl p-20 text-center text-gray-400">
          No appointments found in the system.
        </div>
      )}
    </div>
  );
};

export default AllAppointments;