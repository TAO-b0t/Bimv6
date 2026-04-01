import axiosInstance from './axiosInstance';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}
let refreshTimer = null;

export function startTokenMonitor() {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token || !refreshToken) {
    console.warn("❌ No token or refreshToken found");
    return;
  }

  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    console.warn("❌ Invalid token payload");
    return;
  }

  const currentTime = Math.floor(Date.now() / 1000); // ปัจจุบัน (วินาที)
  const expireTime = payload.exp;                    // เวลาหมดอายุ
  const timeLeft = expireTime - currentTime;

  // 🔁 ล็อกเวลาดู
  // console.log(" Token created at:", new Date(payload.iat * 1000).toLocaleTimeString());
  // console.log(" Token expires at:", new Date(payload.exp * 1000).toLocaleTimeString());
  // console.log(" Seconds left before expiration:", timeLeft);

// 👉 ตั้งเวลาให้เรียก refresh ก่อนหมดอายุ 5 นาที (300 วินาที)
const refreshBefore = 300;
const refreshIn = Math.max(0, (timeLeft - refreshBefore) * 1000);

  if (refreshTimer) clearTimeout(refreshTimer);

  refreshTimer = setTimeout(async () => {
    // console.log(" Refreshing token now...");
    try {
      const token = localStorage.getItem("token"); // ⬅️ token เก่าที่ใช้แทน refresh token

      if (!token) {
        console.warn("❌ No token found in localStorage");
        return;
      }
  
      const res = await axiosInstance.post("/refresh-token", {
        refreshToken: token
      });

      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      // console.log(" Token refreshed:", new Date().toLocaleTimeString());

      // 🔁 เรียกตัวเองใหม่เพื่อตั้ง timer ใหม่
      startTokenMonitor();
    } catch (error) {
      console.error("🔁 Refresh token failed:", error);
      // Redirect to login หรือแจ้งเตือน
    }
  }, refreshIn);
}

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(`/login`, { email, password });
      const { token } = response.data;

localStorage.setItem("token", token);
startTokenMonitor(); // ✅ เริ่มจับเวลา

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");
      // console.log("Token:", token);
      const response = await axiosInstance.get(`/getUserProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dbId");
    },
  // Register
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(`/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

// Forgot Password
forgotPassword: async (email) => {
    try {
      const frontendBaseUrl = window.location.origin; 
      const response = await axiosInstance.post(`/forgot-password`, { email, frontendBaseUrl });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post(`/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
   getAutodeskToken : async (req, res) => {
    try {
      const { email } = req.body;
  
      // ตรวจสอบ token/สิทธิ์ของ user จาก email (ถ้าจำเป็น)
  
      const token = await getToken(); // ฟังก์ชันนี้คุณมีแล้ว
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: "Failed to get Autodesk token" });
    }
  },  
  //  Check Email Availability
  checkEmail: async (email) => {
    try {
      const response = await axiosInstance.post(`/check-email`, { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  registerTechnician: async (technicianData) => {
    try {
      const emailCheck = await authService.checkEmail(technicianData.email);
  
      const isAvailable =
        emailCheck?.available === true ||
        emailCheck?.exists === false ||
        emailCheck?.message === "Email is available";
  
      if (!isAvailable) {
        throw {
          message: emailCheck?.message || "อีเมลนี้ถูกใช้งานแล้ว"
        };
      }
  
      const currentUserProfile = await authService.getUserProfile();
  
      const payload = {
        ...technicianData,
        lastname: technicianData.lastname || technicianData.surname || "",
        institution: currentUserProfile?.institution || "อื่นๆ",
        company_name:
          currentUserProfile?.company_name ||
          currentUserProfile?.companyName ||
          "",
        product_key: "a3f31c03c6f614ad",
        role: 3,
      };
  
      const response = await authService.register(payload);
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  getTechniciansByCompany: async (company_name) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) throw new Error("No token found");
  
      const response = await axiosInstance.post(
        `/get-Technician`,
        { company_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

};

export default authService;
