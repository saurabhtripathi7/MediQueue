/**
 * ======================================================
 * AXIOS INSTANCE (api)
 * ======================================================
 *
 * PURPOSE:
 * --------
 * Centralized HTTP client for the frontend.
 *
 * This file is responsible for:
 * - Setting the backend base URL (via environment variables)
 * - Automatically attaching JWT access tokens to requests
 * - Handling token expiration using refresh tokens
 * - Retrying failed requests after token refresh
 * - Logging the user out safely when authentication fails
 *
 * DESIGN GOALS:
 * -------------
 * ✔ No hardcoded URLs
 * ✔ No infinite refresh loops
 * ✔ Does NOT touch theme / UI state
 * ✔ Only auth-related localStorage keys are managed here
 * ✔ Works transparently for all API calls
 */

import axios from "axios";

/* ======================================================
   AUTH STORAGE KEYS (Single Source of Truth)
   ======================================================
   Keeping key names in one place avoids typos and
   makes refactoring safer.
*/
const AUTH_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
};

/* ======================================================
   AXIOS INSTANCE CONFIGURATION
   ======================================================
   - baseURL comes from Vite environment variables
   - `/api` prefix keeps routes consistent
   - withCredentials allows cookies if backend uses them
*/
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

/* ======================================================
   AUTH CLEANUP HELPER
   ======================================================
   Used when:
   - Refresh token is missing
   - Refresh token is invalid/expired
   - Backend explicitly rejects authentication
*/
const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_KEYS.ACCESS);
  localStorage.removeItem(AUTH_KEYS.REFRESH);
};

/* ======================================================
   REQUEST INTERCEPTOR
   ======================================================
   Runs BEFORE every outgoing request.
   Automatically attaches the access token (if present).
*/
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(AUTH_KEYS.ACCESS);

    // Attach Authorization header only if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   RESPONSE INTERCEPTOR
   ======================================================
   Handles:
   - Expired access tokens
   - Token refresh & request retry
   - Safe logout on auth failure
*/
api.interceptors.response.use(
  /* ================= SUCCESS ================= */
  // If the response is successful, simply return it
  (response) => response,

  /* ================= ERROR ================= */
  async (error) => {
    const originalRequest = error.config;

    /* ------------------------------------------
       NETWORK / SERVER DOWN / CORS ERRORS
       ------------------------------------------
       If there is no response object, the request
       never reached the backend.
    */
    if (!error.response) {
      return Promise.reject(error);
    }

    /* ==================================================
       ACCESS TOKEN EXPIRED (401 UNAUTHORIZED)
       ==================================================
       Conditions:
       - Status is 401
       - Request has not already been retried
    */
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH);

      /* ------------------------------------------
         NO REFRESH TOKEN → FORCE LOGOUT
         ------------------------------------------ */
      if (!refreshToken) {
        clearAuthStorage();
        window.location.replace("/login");
        return Promise.reject(error);
      }

      try {
        /* ==========================================
           REQUEST NEW ACCESS TOKEN
           ========================================== */
        const res = await api.post("/user/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned");
        }

        /* ==========================================
           STORE TOKEN & RETRY ORIGINAL REQUEST
           ========================================== */
        localStorage.setItem(AUTH_KEYS.ACCESS, newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        /* ==========================================
           REFRESH FAILED → LOGOUT
           ========================================== */
        clearAuthStorage();
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    /* ==================================================
       ALL OTHER ERRORS
       ==================================================
       Let calling code handle them (UI messages, etc.)
    */
    return Promise.reject(error);
  }
);

export default api;
