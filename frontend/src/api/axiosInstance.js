/**
 * ======================================================
 * AXIOS INSTANCE (api)
 * ======================================================
 *
 * PURPOSE
 * ------------------------------------------------------
 * This file centralizes ALL HTTP communication
 * between frontend and backend.
 *
 * It provides:
 * 1. Automatic attachment of access tokens
 * 2. Automatic refresh of expired access tokens
 * 3. Seamless retry of failed requests
 *
 * Result:
 * - Components never deal with tokens directly
 * - Auth logic lives in ONE place
 * - Cleaner, safer frontend code
 */

import axios from "axios";

/* ======================================================
   AXIOS INSTANCE CONFIGURATION
   ======================================================
   - baseURL is prepended to all requests
   - withCredentials allows cookies (if used)
*/
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

/* ======================================================
   REQUEST INTERCEPTOR
   ======================================================
   Runs BEFORE every request leaves the browser.

   Responsibility:
   - Read accessToken from storage
   - Attach it to Authorization header
   - Make all API calls auth-aware automatically

   This eliminates the need to do this manually:
   api.get("/doctors", {
     headers: { Authorization: "Bearer ..." } ❌
   });
*/
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  // Attach token ONLY if it exists
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config; // request continues
});

/* ======================================================
   RESPONSE INTERCEPTOR
   ======================================================
   Runs AFTER a response is received.

   Handles ONE special case:
   - Access token has expired (HTTP 401)

   Strategy:
   - Try to refresh access token using refresh token
   - Retry the original request transparently
   - Logout user if refresh fails
*/
api.interceptors.response.use(
  /* ==================================================
     1️⃣ SUCCESS PATH
     ==================================================
     If response is successful (2xx),
     just return it as-is.
  */
  (response) => response,

  /* ==================================================
     2️⃣ ERROR PATH
     ==================================================
     This function runs when a response error occurs
  */
  async (error) => {
    /*
      error.config contains the ORIGINAL request config:
      - URL
      - method
      - headers
      - body
      - baseURL
    */
    const originalRequest = error.config;

    /* ==================================================
       3️⃣ CHECK: ACCESS TOKEN EXPIRED?
       ==================================================
       Conditions:
       - HTTP status is 401 (Unauthorized)
       - Request has NOT been retried yet

       `_retry` flag prevents infinite refresh loops
    */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        /* ==============================================
           4️⃣ ATTEMPT TOKEN REFRESH
           ==============================================
           - Refresh token is long-lived
           - Stored securely (here: localStorage)
        */
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token → force logout
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        /* ==============================================
           5️⃣ CALL REFRESH TOKEN ENDPOINT
           ============================================== */
        const res = await api.post("/user/refresh", {
          refreshToken,
        });

        /*
          Backend returns:
          {
            accessToken: "<new_access_token>"
          }
        */

        /* ==============================================
           6️⃣ STORE NEW ACCESS TOKEN
           ============================================== */
        localStorage.setItem("accessToken", res.data.accessToken);

        /* ==============================================
           7️⃣ RETRY ORIGINAL REQUEST
           ==============================================
           - Update Authorization header
           - Replay original API call
        */
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        /* ==============================================
           8️⃣ REFRESH FAILED → FORCE LOGOUT
           ============================================== */
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    /* ==================================================
       9️⃣ NON-AUTH ERRORS
       ==================================================
       Any other error (400, 403, 500, etc.)
       is passed back to the caller.
    */
    return Promise.reject(error);
  }
);

export default api;
