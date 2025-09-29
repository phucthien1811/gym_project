// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // BẬT cái này chỉ khi bạn thực sự dùng cookie từ server
});

// Gắn Bearer từ localStorage (đọc accessToken, không phải token)
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("rf_auth_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      const accessToken = parsed?.accessToken ?? parsed?.token ?? null; // migrate nếu từng lưu token
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch {}
  return config;
});

// 401 -> xử lý cẩn thận, tránh redirect vòng lặp /auth/*
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    if (status === 401) {
      // Đừng redirect nếu đang gọi /auth/login hoặc /auth/refresh
      if (/\/auth\/(login|refresh)/.test(url)) {
        return Promise.reject(err);
      }
      // Nếu bạn có refreshToken thì thử refresh ở đây (tùy bạn đã làm backend chưa)
      try {
        const raw = localStorage.getItem("rf_auth_v1");
        const parsed = raw ? JSON.parse(raw) : null;
        const rToken = parsed?.refreshToken;
        if (rToken) {
          const r = await api.post("/auth/refresh", { refreshToken: rToken });
          const next = {
            user: parsed?.user ?? r.data.user ?? null,
            accessToken: r.data.accessToken,
            refreshToken: r.data.refreshToken ?? rToken,
          };
          localStorage.setItem("rf_auth_v1", JSON.stringify(next));
          // gắn token mới và replay request
          err.config.headers.Authorization = `Bearer ${next.accessToken}`;
          err.config._retry = true;
          return api(err.config);
        }
      } catch (e) {
        // refresh fail => rơi xuống logout
      }

      // Không có refresh hoặc refresh fail -> logout
      localStorage.removeItem("rf_auth_v1");
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// API
export const authAPI = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  refresh: (payload) => api.post("/auth/refresh", payload),
  me: () => api.get("/users/me")
};

export const memberAPI = {
  list: () => api.get("/members"),
  stats: () => api.get("/members/stats"),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getById: (id) => api.get(`/members/${id}`)
};

export default api;
