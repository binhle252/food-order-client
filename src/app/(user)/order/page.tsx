"use client";

import { useEffect, useState } from "react";
import { getOrderByAccount } from "@/services/order.service";
import jwt from "jsonwebtoken";
import Image from "next/image";
import styles from "../../../styles/OrdersPage.module.css"; 

interface Order {
  _id: string;
  customer: string;
  phone: string;
  address: string;
  total_money: number;
  payment_method: string;
  status: string; // Trạng thái sẽ là "pending", "confirm", "shipping", "received"
  createdAt: string;
  cart: {
    items: {
      quantity: number;
      food: {
        name: string;
        img: string;
        price: number;
      };
    }[];
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  const baseUrl = "http://localhost:5000";

  const encodeImageUrl = (img: string) => {
    if (img?.startsWith("http")) return img;
    if (!img) return "/default-image.jpg";
    const encodedPath = img.replace(/ /g, "%20").replace(/^\/Uploads\//, "/uploads/");
    return `${baseUrl}${encodedPath}`;
  };

  const getAccountIdFromToken = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token || typeof token !== "string") return null;
    try {
      const decoded: any = jwt.decode(token);
      return decoded?.id || decoded?.account_id;
    } catch (err) {
      console.error("Lỗi giải mã token:", err);
      return null;
    }
  };

  const fetchOrders = async () => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      setMessage("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
      return;
    }
    try {
      const data = await getOrderByAccount(accountId);
      // Sắp xếp đơn hàng theo ngày tạo mới nhất (createdAt)
      const sortedOrders = data.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
      setMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setMessage("Lỗi kết nối đến máy chủ hoặc không thể tải đơn hàng.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm để trả về class CSS tương ứng với trạng thái đơn hàng
  const getStatusClassName = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return styles.statusPending;
      case "confirm": // Đã cập nhật từ "confirmed"
        return styles.statusConfirmed;
      case "shipping": // Đã cập nhật từ "delivering"
        return styles.statusDelivering;
      case "received": // Đã cập nhật từ "completed"
        return styles.statusCompleted;
      case "cancelled": // Giữ nguyên nếu bạn có trạng thái "cancelled"
        return styles.statusCancelled;
      default:
        return ""; // Mặc định không có style nếu không khớp
    }
  };

  // Hàm để chuyển đổi trạng thái tiếng Anh sang tiếng Việt kèm icon
  const getVietnameseStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "🕒 Đang chờ xử lý";
      case "confirm":
        return "✔️ Đã xác nhận";
      case "shipping":
        return "🚚 Đang giao hàng";
      case "received":
        return "🏆 Đã nhận hàng";
      case "cancelled":
        return "❌ Đã hủy";
      default:
        return status;
    }
  };

  const getDisplayOrderId = (orderId: string) => {
    // Lấy 8 ký tự cuối của chuỗi ID và thêm prefix "DH"
    return `DH${orderId.slice(-8).toUpperCase()}`; 
  };

  return (
    <div className={styles.ordersContainer}>
      <h1 className={styles.ordersTitle}>📋 Lịch sử đơn hàng</h1> {/* Đã thay đổi icon */}
      {message && <p className={styles.message}>{message}</p>}

      {orders.length === 0 ? (
        <p className={styles.noOrders}>Chưa có đơn hàng nào.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderItem}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <p className={styles.orderId}>
                    🆔 Mã đơn: <span>{getDisplayOrderId(order._id)}</span>
                  </p>
                  <p>🕒 Ngày đặt: <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span></p>
                  <p>💳 Phương thức thanh toán: <span>{order.payment_method}</span></p>
                  <p>📦 Trạng thái: 
                    <span className={`${styles.orderStatus} ${getStatusClassName(order.status)}`}>
                      {getVietnameseStatus(order.status)} {/* Sử dụng hàm mới ở đây */}
                    </span>
                  </p>
                </div>
                <div className={styles.orderTotal}>
                  Tổng tiền: {order.total_money.toLocaleString("vi-VN")}đ
                </div>
              </div>

              <div className={styles.deliveryInfo}>
                <p>📍 Giao đến: <span>{order.customer}</span></p>
                <p>📞 Điện thoại: <span>{order.phone}</span></p>
                <p>🏠 Địa chỉ: <span>{order.address}</span></p>
              </div>

              <ul className={styles.itemsList}>
                {order.cart?.items?.map((item, index) => (
                  <li key={index} className={styles.itemDetail}>
                    <Image
                      src={encodeImageUrl(item.food.img)}
                      alt={item.food.name}
                      width={60}
                      height={60}
                      className={styles.itemImage}
                    />
                    <div>
                      <p className={styles.itemName}>{item.food.name}</p>
                      <p className={styles.itemQuantityPrice}>
                        {item.quantity} x {item.food.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}