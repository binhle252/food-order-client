import axios from "axios";

export async function createOrder(orderData) {
  try {
    const result = await axios.post("http://localhost:5000/api/order", orderData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
}

export async function getOrder({ customer, address, phone, status }) {
  try {
    const result = await axios.get("http://localhost:5000/api/order", {
      params: { customer, address, phone, status }
    });
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
}

export async function getOrderByAccount(account_id) {
  try {
    const result = await axios.get(`http://localhost:5000/api/order/account/${account_id}`);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo tài khoản:", error);
    throw error;
  }
}

export async function updateOrderStatus(id, statusData) {
  try {
    const result = await axios.put(`http://localhost:5000/api/order/${id}/status`, statusData);
    return result.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    throw error;
  }
}
