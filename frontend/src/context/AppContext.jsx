import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

/**
 * Global Application Context
 * --------------------------
 * Responsibilities:
 * - Public data (doctors list)
 * - Auth-dependent user data (profile)
 * - Centralized data-fetching helpers
 *
 * IMPORTANT:
 * - This context does NOT manage tokens
 * - Token lifecycle is handled entirely by axios interceptors
 */
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  /* =========================================================
     UI CONSTANTS
     ========================================================= */
  const currencySymbol = "₹";

  /* =========================================================
     AUTH BOOTSTRAP STATE
     =========================================================
     authReady = true means:
     - token check done
     - refresh (if needed) completed
     - profile fetch attempt completed
     - UI can safely render
  */
  const [authReady, setAuthReady] = useState(false);

  /* =========================================================
     DOCTORS (PUBLIC DATA)
     ========================================================= */
  const [doctors, setDoctors] = useState([]);

  const getDoctorsData = async () => {
    try {
      const { data } = await api.get("/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  /* =========================================================
     USER PROFILE (PROTECTED DATA)
     ========================================================= */
  const [userData, setUserData] = useState(null);

  const loadUserProfileData = async () => {
    try {
      const { data } = await api.get("/user/get-profile");

      if (data.success) {
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserData(null);
    }
  };

  /**
   * AUTH BOOTSTRAP EFFECT
   * --------------------
   * Runs once on app load
   */
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setUserData(null);
      setAuthReady(true);
      return;
    }

    const bootstrapAuth = async () => {
      await loadUserProfileData();
      setAuthReady(true);
    };

    bootstrapAuth();
  }, []);

  /* =========================================================
     UPDATE USER PROFILE (SAFE VERSION)
     ========================================================= */
  const updateUserProfileData = async (profileData) => {
    try {
      const formData = new FormData();

      // Append ONLY if value exists
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.phone) formData.append("phone", profileData.phone);
      if (profileData.dob) formData.append("dob", profileData.dob);
      if (profileData.gender) formData.append("gender", profileData.gender);

      if (profileData.address) {
        formData.append(
          "address",
          JSON.stringify(profileData.address)
        );
      }

      if (profileData.image instanceof File) {
        formData.append("image", profileData.image);
      }

      const { data } = await api.post(
        "/user/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        await loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        doctors,
        getDoctorsData,

        userData,
        setUserData,
        loadUserProfileData,

        authReady, // MUST be used by Navbar / protected UI

        currencySymbol,
        updateUserProfileData,
        backendURL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
