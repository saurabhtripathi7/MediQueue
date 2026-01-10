import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * ============================================================================
 * DoctorContext
 * ----------------------------------------------------------------------------
 * Centralized state + API actions for Doctor Panel
 * - Authentication handling
 * - Appointments management
 * - Dashboard statistics
 * - Profile management
 * ============================================================================
 */
export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  /* ===================== AUTH STATE ===================== */

  const [doctorToken, setDoctorToken] = useState(
    localStorage.getItem("doctorToken") || null
  );

  /* ===================== DATA STATE ===================== */

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  /* ===================== CONFIG ===================== */

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  /* ===================== AUTH HELPERS ===================== */

  const saveDoctorToken = (token) => {
    localStorage.setItem("doctorToken", token);
    setDoctorToken(token);
  };

  const logoutDoctor = useCallback(() => {
    localStorage.removeItem("doctorToken");
    setDoctorToken(null);
    setAppointments([]);
    setDashData(null);
    setProfileData(null);
    toast.info("Logged out successfully");
  }, []);

  /* ===================== API: APPOINTMENTS ===================== */

  const getAppointments = useCallback(async () => {
    if (!doctorToken) return;

    try {
      const { data } = await axios.get(
        `${backendURL}/api/doctor/appointments`,
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }
      );

      if (!data.success) throw new Error(data.message);

      setAppointments(data.appointments);
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();

      console.error("Doctor appointments fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch appointments"
      );

      throw error;
    }
  }, [doctorToken, backendURL, logoutDoctor]);

  const completeAppointment = async (appointmentId) => {
    if (!doctorToken) return;

    try {
      const { data } = await axios.post(
        `${backendURL}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDoctorDashboardStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();

      console.error("Complete appointment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete appointment"
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!doctorToken) return;

    try {
      const { data } = await axios.post(
        `${backendURL}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${doctorToken}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDoctorDashboardStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();

      console.error("Cancel appointment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  };

  /* ===================== API: DASHBOARD ===================== */

  const getDoctorDashboardStats = useCallback(async () => {
    if (!doctorToken) return;

    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });

      if (!data.success) throw new Error(data.message);

      setDashData(data.dashData);
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();

      console.error("Doctor dashboard error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load dashboard data"
      );

      throw error;
    }
  }, [doctorToken, backendURL, logoutDoctor]);

  /* ===================== API: PROFILE ===================== */

  const getProfileData = useCallback(async () => {
    if (!doctorToken) return;

    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/profile`, {
        headers: { Authorization: `Bearer ${doctorToken}` },
      });

      if (!data.success) throw new Error(data.message);

      setProfileData(data.profileData);
    } catch (error) {
      if (error.response?.status === 401) logoutDoctor();

      console.error("Doctor profile fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch profile data"
      );

      throw error;
    }
  }, [doctorToken, backendURL, logoutDoctor]);

  /* ===================== SIDE EFFECTS ===================== */

  useEffect(() => {
    if (doctorToken) {
      getAppointments();
      getDoctorDashboardStats();
      getProfileData();
    }
  }, [doctorToken, getAppointments, getDoctorDashboardStats, getProfileData]);

  /* ===================== CONTEXT VALUE ===================== */

  const value = {
    doctorToken,
    saveDoctorToken,
    logoutDoctor,

    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,

    dashData,
    getDoctorDashboardStats,

    profileData,
    getProfileData,

    backendURL,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
