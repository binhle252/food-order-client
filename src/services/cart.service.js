import axios from "axios";

export async function addToCart(cartData) {
  try {
    const result = await axios.post("http://localhost:5000/api/cart", cartData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw error;
  }
}

export async function getCart(account_id) {
  try {
    const result = await axios.get(
      `http://localhost:5000/api/cart/account/${account_id}`
    );
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
}

export async function deleteItem(account_id, item_id) {
  try {
    const result = await axios.delete(
      `http://localhost:5000/api/cart/account/${account_id}/item/${item_id}`
    );
    return result.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn khỏi giỏ hàng:", error);
    throw error;
  }
}

export async function updateItem(account_id, item_id, quantity) {
  const url = `http://localhost:5000/api/cart/account/${account_id}/item/${item_id}`;
  console.log("🛠 Gọi API update:", url, "với quantity:", quantity);
  try {
    const result = await axios.patch(url, { quantity });
    return result.data;
  } catch (error) {
    console.error("❌ Lỗi updateItem:", error.response?.data || error.message);
    throw error;
  }
}
