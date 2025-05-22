import axios from "axios";

export async function createCategory(categoryData) {
  try {
    const result = await axios.post("http://localhost:5000/api/categories", categoryData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    throw error;
  }
}

export async function getCategory() {
  try {
    const result = await axios.get("http://localhost:5000/api/categories");
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw error;
  }
}

export async function updateCategory(id, categoryData) {
  try {
    const result = await axios.put(`http://localhost:5000/api/categories/${id}`, categoryData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    const result = await axios.delete(`http://localhost:5000/api/categories/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
}