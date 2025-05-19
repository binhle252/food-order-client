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

