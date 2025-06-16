import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function getFood(category_id) {
  try {
    const result = await axios.get(`${API_URL}/foods`, {
      params: { category_id },
    });
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    throw error;
  }
}

export async function getFoodDetail(id) {
  try {
    const result = await axios.get(`${API_URL}/foods/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết món ăn:", error);
    throw error;
  }
}

export async function createFood(formData) {
  try {
    const response = await axios.post(`${API_URL}/foods`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi thêm món ăn:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Lỗi khi thêm món ăn");
  }
}

export async function updateFood(id, formData) {
  try {
    const response = await axios.put(`${API_URL}/foods/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.error(
      "Lỗi khi cập nhật món ăn:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Lỗi khi cập nhật món ăn");
  }
}

export async function deleteFood(id) {
  try {
    const result = await axios.delete(`${API_URL}/foods/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    throw error;
  }
}
