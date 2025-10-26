import axios from "axios";

const api = axios.create({
  baseURL: "https://fz-backoffice.linooxel.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 اضافه کردن accessToken به هر درخواست
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug("[API] Authorization header set", config.headers.Authorization);
    } else {
      console.warn("[API] No accessToken found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (اختیاری) مدیریت رفرش توکن در صورت 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("[API] Unauthorized 401. Access token may be invalid/expired.");
    }
    return Promise.reject(error);
  }
);

export default api;
