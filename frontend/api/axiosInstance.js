// For making API requests with automatic token handling (REFRESH TOKEN FLOW)
import axios from "axios";

/*By this
baseURL is prepended to all requests  ---------------> 
eg: api.get("/doctors")  -----------------> http://localhost:4000/api/doctors
*/
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

/* REQUEST INTERCEPTOR ----------------->

 Axios says:
“Before I send ANY request made with api,
call this function and give it the request config.”

Config contains: [URL, method, headers, body, params, baseURL, metadata, data(POST) etc.]
*/

/* =========================
    REQUEST INTERCEPTOR (Before request leaves browser)
    Attaches access token to Authorization header (if exists) 
    
    So you never do this manually:
    api.get("/doctors", {
    headers: { Authorization: "Bearer ..." } ❌
    });
========================= */
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR (After response returns)
   Auto refresh on 401
========================= */
api.interceptors.response.use(
  (response) => response,

  //  If response is error, this function is called
  async (error) => {
    const originalRequest = error.config; // store the original request for later use
    //error.config = same as request config in request interceptor

    // 1️⃣ If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) 
    {
      originalRequest._retry = true; // flag to avoid infinite loop

      // 2️⃣ Try to get new access token using refresh token

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post("http://localhost:4000/api/auth/refresh", {
          refreshToken,
        });

        // 2️⃣ Store new access token
        localStorage.setItem("accessToken", res.data.accessToken);

        // 3️⃣ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 4️⃣ Refresh failed → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

//If an API request fails because the access token expired, fix it automatically and retry.
