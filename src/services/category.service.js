import axios from "axios";

export const createCategory = async (formData) => {
  const res = await fetch("http://localhost:5000/api/categories", {
    method: "POST",
    body: formData, // gửi thẳng FormData
  });
  return res.json();
};

export async function getCategory() {
  try {
    const result = await axios.get("http://localhost:5000/api/categories");
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
    throw error;
  }
}

export const updateCategory = async (id, formData) => {
  const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
};

export async function deleteCategory(id) {
  try {
    const result = await axios.delete(
      `http://localhost:5000/api/categories/${id}`
    );
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
}
