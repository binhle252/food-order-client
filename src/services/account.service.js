import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      alert("Vui lòng đăng nhập lại");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      alert("Bạn không có quyền truy cập");
    }
    return Promise.reject(error);
  }
);

export async function register(accountData) {
  try {
    const result = await api.post("/accounts/register", accountData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function login(loginData) {
  try {
    const result = await api.post("/accounts/login", loginData);
    const { token } = result.data.data;
    localStorage.setItem("token", token);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function getAccounts() {
  try {
    const result = await api.get("/accounts");
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function getUserProfile() {
  try {
    const result = await api.get("/accounts/profile");
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}