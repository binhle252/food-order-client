import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Lưu token vào localStorage
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/account/login`, { username, password });
    setAuthToken(response.data.token);
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || 'Đăng nhập thất bại';
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/account/register`, userData);
    setAuthToken(response.data.token);
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || 'Đăng ký thất bại';
  }
};

// Lấy thông tin user từ token
export const getCurrentUser = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/account/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }
};


export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};