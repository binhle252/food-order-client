import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cập nhật nếu cần
});

// Thêm token vào headers nếu có (dùng cho mọi request cần xác thực)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================================
 * 📌 1. Tạo bình luận (user)
 * ================================ */
export async function createComment({ foodId, content }) {
  try {
    const res = await api.post("/comments", { foodId, content });
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo bình luận:", error.response?.data?.message || error.message);
    throw error;
  }
}

/* ==========================================
 * 📌 2. Lấy tất cả bình luận theo món ăn (user)
 * ========================================== */
export async function getCommentsByFood(foodId) {
  try {
    const res = await api.get(`/comments/${foodId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy bình luận theo món ăn:", error.response?.data?.message || error.message);
    throw error;
  }
}

/* ==========================================
 * 📌 3. Lấy tất cả bình luận (admin)
 * ========================================== */
export async function getComments() {
  try {
    const res = await api.get("/comments");
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả bình luận:", error.response?.data?.message || error.message);
    throw error;
  }
}

/* ==========================================
 * 📌 4. Xóa bình luận theo ID (admin)
 * ========================================== */
export async function deleteComment(commentId) {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi khi xóa bình luận:", error.response?.data?.message || error.message);
    throw error;
  }
}
