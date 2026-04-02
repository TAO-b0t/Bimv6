// axiosInstance.js
import axios from "axios";

// const API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL = "https://bimv6-api.ngrok.dev/api"; // ปรับตามจริง

const instance = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let refreshSubscribers = [];

// ฟังก์ชันรอ refresh เสร็จแล้วค่อยยิงใหม่
function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}
instance.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

// ✅ Interceptor: ใส่ token อัตโนมัติใน request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor: ถ้า token หมดอายุ → ไปขอ refresh แล้วทำ request ต่อ
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const ignoredPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/refresh-token",
    ];

    // ❌ ถ้าเป็น request ที่ไม่ควร refresh ก็โยน error เลย
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !ignoredPaths.some((path) => originalRequest.url.includes(path))
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");

        try {
          const res = await axios.post(`${API_BASE_URL}/refresh-token`, {
            refreshToken,
          });

          const newToken = res.data.token;
          localStorage.setItem("token", newToken);
          isRefreshing = false;

          onRefreshed(newToken);

          return instance(originalRequest);
        } catch (err) {
          isRefreshing = false;
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    // 🎯 กรณีอื่น ปล่อยผ่านไปเลย
    return Promise.reject(error);
  }
);

export default instance;
