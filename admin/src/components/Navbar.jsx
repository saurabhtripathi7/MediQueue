import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { adminToken, logoutAdmin } = useContext(AdminContext);
  const { doctorToken, logoutDoctor } = useContext(DoctorContext);

  const navigate = useNavigate();

  const isAdmin = !!adminToken;
  const isDoctor = !!doctorToken;

  // Safety guard: If no user is logged in, don't render the Navbar
  if (!isAdmin && !isDoctor) return null;

  const logoutHandler = isAdmin ? logoutAdmin : logoutDoctor;
  const roleLabel = isAdmin ? "Admin" : "Doctor";
  const dashboardPath = isAdmin
    ? "/admin-dashboard"
    : "/doctor-dashboard";

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all w-full">
      <div className="flex justify-between items-center px-4 py-3">
        {/* ===================== LEFT ===================== */}
        <div className="flex items-center gap-2 text-xs">
          <img
            className="w-36 sm:w-40 cursor-pointer hover:opacity-90 transition-opacity"
            src={assets.admin_logo}
            alt="Logo"
            onClick={() => navigate(dashboardPath)}
          />

          <span
            className={`px-2.5 py-0.5 rounded-full font-medium border cursor-default
            ${
              isAdmin
                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            {roleLabel}
          </span>
        </div>

        {/* ===================== RIGHT ===================== */}
        <button
          onClick={logoutHandler}
          className="group relative inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-95"
        >
          <span className="relative z-10">Logout</span>
          <LogOut className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
