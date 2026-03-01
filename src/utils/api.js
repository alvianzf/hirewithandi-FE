import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem("hwa_auth");
    if (session) {
      try {
        const { token } = JSON.parse(session);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Failed to parse auth session token", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Don't intercept auth routes to prevent loops
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/")
    ) {
      originalRequest._retry = true;
      try {
        const sessionStr = localStorage.getItem("hwa_auth");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session.refreshToken) {
            const refreshRes = await axios.post(
              (api.defaults.baseURL || "http://localhost:3000/api") +
                "/auth/refresh",
              {
                refreshToken: session.refreshToken,
              },
            );
            const {
              token,
              refreshToken: newRefreshToken,
              user,
            } = refreshRes.data.data;
            const newSession = {
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
              token,
              refreshToken: newRefreshToken || session.refreshToken,
            };
            localStorage.setItem("hwa_auth", JSON.stringify(newSession));

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Dispatch event or clear storage
        localStorage.removeItem("hwa_auth");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
