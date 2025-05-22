import axios from "axios";

export async function getFood(category_id) {
    const result = await axios.get("http://localhost:5000/api/foods", {
      params: {
        category_id
      }
    });
    return result.data;
}

export async function getFoodDetail(id) {
  try {
    const result = await axios.get(`http://localhost:5000/api/foods/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết món ăn:", error);
    throw error;
  }
}

export async function createFood(foodData) {
  try {
    const result = await axios.post("http://localhost:5000/api/foods", foodData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi tạo món ăn:", error);
    throw error;
  }
}

export async function updateFood(id, foodData) {
  try {
    const result = await axios.put(`http://localhost:5000/api/foods/${id}`, foodData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error);
    throw error;
  }
}

export async function deleteFood(id) {
  try {
    const result = await axios.delete(`http://localhost:5000/api/foods/${id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    throw error;
  }
}