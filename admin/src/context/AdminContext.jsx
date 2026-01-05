import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * ============================================================================
 * AdminContext
 * ----------------------------------------------------------------------------
 * Centralized state + API actions for Admin Panel
 * - Authentication handling
 * - Doctors management
 * - Appointments management
 * - Dashboard statistics
 * ============================================================================
 */
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  
  /* ===================== AUTH STATE ===================== */

  // Admin JWT token (persisted across reloads)
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  /* ===================== DATA STATE ===================== */

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  /* ===================== CONFIG ===================== */

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  /* ===================== AUTH HELPERS ===================== */

  const saveAdminToken = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    setDoctors([]);
    setAppointments([]);
    setDashData(null);
    toast.info("Logged out successfully");
  }, []);

  /* ===================== API: DOCTORS ===================== */

  const getAllDoctors = useCallback(async () => {
    if (!adminToken) return;

    try {
      const { data } = await axios.get(
        `${backendURL}/api/admin/all-doctors`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (!data.success) throw new Error(data.message);

      setDoctors(data.doctors);
    } catch (error) {
      if (error.response?.status === 401) logoutAdmin();

      console.error("Fetch doctors error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch doctors");
    }
  }, [adminToken, backendURL, logoutAdmin]);

  const changeAvailability = async (docId) => {
    if (!adminToken) return;

    try {
      const { data } = await axios.patch(
        `${backendURL}/api/admin/change-availability/${docId}`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) logoutAdmin();
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  /* ===================== API: APPOINTMENTS ===================== */

  const getAllAppointments = useCallback(async () => {
    if (!adminToken) return;

    try {
      const { data } = await axios.get(
        `${backendURL}/api/admin/appointments`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (!data.success) throw new Error(data.message);

      setAppointments(data.appointments);
    } catch (error) {
      if (error.response?.status === 401) logoutAdmin();

      console.error("Fetch appointments error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }, [adminToken, backendURL, logoutAdmin]);

  const cancelAppointment = async (appointmentId) => {
    if (!adminToken) return;

    try {
      const { data } = await axios.post(
        `${backendURL}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Re-sync dependent data
        getAllAppointments();
        getAdminDashboardStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) logoutAdmin();

      console.error("Cancel appointment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  /* ===================== API: DASHBOARD ===================== */

  const getAdminDashboardStats = useCallback(async () => {
    if (!adminToken) return;

    try {
      const { data } = await axios.get(
        `${backendURL}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (!data.success) throw new Error(data.message);

      setDashData(data.dashData);
    } catch (error) {
      if (error.response?.status === 401) logoutAdmin();

      console.error("Dashboard fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data"
      );
    }
  }, [adminToken, backendURL, logoutAdmin]);

  /* ===================== SIDE EFFECTS ===================== */

  // Load essential admin data after login
  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
      getAdminDashboardStats();
    }
  }, [adminToken, getAllDoctors, getAdminDashboardStats]);

  /* ===================== CONTEXT VALUE ===================== */

  const value = {
    adminToken,
    saveAdminToken,
    logoutAdmin,

    doctors,
    getAllDoctors,
    changeAvailability,

    appointments,
    getAllAppointments,
    cancelAppointment,

    dashData,
    getAdminDashboardStats,
    backendURL,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
