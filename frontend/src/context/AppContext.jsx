import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * We use a pre-configured Axios instance instead of raw axios.
 *
 * This axios instance:
 *  - Automatically attaches the access token to every request
 *  - Detects expired access tokens (401 responses)
 *  - Calls the refresh-token API when needed
 *  - Retries the original request transparently
 *
 * IMPORTANT:
 * This means React components and contexts NEVER deal with tokens directly.
 */
import api from "../api/axiosInstance";

/**
 * Global application context
 * --------------------------
 * Used to share:
 *  - Public app data (doctors list)
 *  - Auth-dependent user data (profile)
 *  - Reusable data-fetching functions
 *
 * Auth logic itself is NOT stored here.
 */
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  /**
   * Shared UI constants
   * -------------------
   * Centralized here to avoid magic values scattered across components.
   */
  const currencySymbol = "₹";

  /* =========================================================
     DOCTORS (PUBLIC DATA)
     ========================================================= */

  /**
   * Doctors list
   * ------------
   * Public data.
   * Does NOT require authentication.
   * Safe to fetch on app load.
   */
  const [doctors, setDoctors] = useState([]);

  /**
   * Fetch doctors from backend
   *
   * Uses axios instance (`api`):
   * - If access token exists → attached automatically
   * - If token is expired → axios refreshes it silently
   * - If route is public → token is ignored
   */
  const getDoctorsData = async () => {
    try {
      const { data } = await api.get("/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      /**
       * Any final error that reaches here means:
       * - Network error
       * - Backend error
       * - Refresh also failed
       *
       * Auth failures are already handled inside axios interceptors.
       */
      console.error("Error fetching doctors:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  };

  /**
   * Fetch doctors once when app loads.
   * Safe because this route is public.
   */
  useEffect(() => {
    getDoctorsData();
  }, []);

  /* =========================================================
     USER PROFILE (PROTECTED DATA)
     ========================================================= */

  /**
   * Logged-in user's profile data
   *
   * null  → not logged in / not loaded
   * object → profile loaded
   */
  const [userData, setUserData] = useState(null);

  /**
   * Fetch logged-in user's profile
   *
   * This is a PROTECTED route.
   * Requirements:
   *  - Access token must exist
   *  - authUser middleware must pass
   *
   * Refresh-token flow (important):
   *  - If access token is expired → backend returns 401
   *  - Axios interceptor calls /user/refresh
   *  - New access token is stored
   *  - THIS request is retried automatically
   */
  const loadUserProfileData = async () => {
    try {
      const { data } = await api.get("/user/get-profile");

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch user profile data"
      );
    }
  };

  /**
   * Load profile ONLY if user is logged in.
   *
   * Why?
   * - Prevent unnecessary 401 errors
   * - Avoid refresh attempts when user is logged out
   * - Keep context auth-agnostic
   */
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      loadUserProfileData(); // Load profile on app start if logged in
    }
    else {
      setUserData(null); // Clear user data on logout
    }
  }, []);


  /**
 * Update logged-in user's profile
 *
 * Sends multipart/form-data because image upload may be included.
 * After successful update:
 *  - Refreshes user profile data
 *  - Keeps global state in sync
 */
const updateUserProfileData = async (profileData) => {
  try {
    const formData = new FormData();

    // Append primitive fields
    formData.append("name", profileData.name);
    formData.append("phone", profileData.phone);
    formData.append("dob", profileData.dob);
    formData.append("gender", profileData.gender);

    // Address must be stringified (backend expects JSON)
    formData.append("address", JSON.stringify(profileData.address));

    // Optional image
    if (profileData.image instanceof File) {
      formData.append("image", profileData.image);
    }

    const { data } = await api.post(
      "/user/update-profile",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (data.success) {
      toast.success("Profile updated successfully");

      // Reload fresh profile from backend
      await loadUserProfileData();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Update profile error:", error);
    toast.error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};



  /* =========================================================
     CONTEXT VALUE
     ========================================================= */

  /**
   * Everything exposed to the rest of the app
   *
   * doctors              → public doctor list
   * getDoctorsData       → refetch doctors when needed
   * userData             → logged-in user's profile
   * loadUserProfileData  → refetch profile after login/update
   * currencySymbol       → UI constant
   */
  return (
    <AppContext.Provider
      value={{
        doctors,
        getDoctorsData,
        userData,
        setUserData,
        loadUserProfileData,
        currencySymbol,
        updateUserProfileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
