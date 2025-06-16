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
      localStorage.removeItem("role");
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
    console.log("Login API result:", result.data);

    // Lấy token và role đúng
    const { token, role } = result.data.data;

    // Lưu token & role vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return result.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function getAccounts() {
  try {
    const result = await api.get("/accounts");
    return result.data.data; // 👈 Trả về mảng thực sự
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function getAccountDetail(id) {
  try {
    const result = await api.get(`/accounts/${id}`);
    return result.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function createAccount(accountData) {
  try {
    const result = await api.post("/accounts", accountData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function updateAccount(id, accountData) {
  try {
    const result = await api.put(`/accounts/${id}`, accountData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}

export async function deleteAccount(id) {
  try {
    const result = await api.delete(`/accounts/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error.response?.data?.message || error.message);
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

export async function updateUserProfile(data) {
  try {
    const result = await api.put("/accounts/profile", data);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin cá nhân:", error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
}