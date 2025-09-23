import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // include cookies with requests
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("jwt") || "null");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple refresh requests at once
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response ? error.response.status : null;
    const message = error.response && error.response.data ? error.response.data.message : null;

    if (status === 401 && message == "Expired refresh token") {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    } else if (status === 401 && !originalRequest._retry) {
      // if (status === 401 && !originalRequest._retry && message == "Expired token")
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh-token API
        const res = await apiClient.post("/auth/refresh-token"); // if this is 401 the code below is not read
        const newToken = res.data.accessToken;

        // Save new token
        localStorage.setItem("jwt", JSON.stringify(newToken));

        // Update failed requests with new token
        onRefreshed(newToken);
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
