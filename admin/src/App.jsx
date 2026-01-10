import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

/* ===================== ADMIN PAGES ===================== */
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

/* ===================== DOCTOR PAGES ===================== */
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

function App() {
  const { adminToken } = useContext(AdminContext);
  const { doctorToken } = useContext(DoctorContext);

  const isLoggedIn = adminToken || doctorToken;

  return (
    <>
      <ToastContainer />

      {/* ===================== NOT LOGGED IN ===================== */}
      {!isLoggedIn && <Login />}

      {/* ===================== LOGGED IN (ADMIN or DOCTOR) ===================== */}
      {isLoggedIn && (
        <div>
          <Navbar />
          <div className="flex items-start">
            <Sidebar />

            <Routes>
              {/* ========== ADMIN ROUTES ========== */}
              {adminToken && (
                <>
                  <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/admin-dashboard" element={<Dashboard />} />
                  <Route path="/all-appointments" element={<AllAppointments />} />
                  <Route path="/add-doctor" element={<AddDoctor />} />
                  <Route path="/doctor-list" element={<DoctorsList />} />
                </>
              )}

              {/* ========== DOCTOR ROUTES ========== */}
              {doctorToken && (
                <>
                  <Route path="/" element={<Navigate to="/doctor-dashboard" replace />} />
                  <Route path="/" element={<DoctorDashboard />} />
                  <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                  <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                  <Route path="/doctor-profile" element={<DoctorProfile />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
