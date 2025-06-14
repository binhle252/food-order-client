"use client";

import { useEffect, useState } from "react";
import { getOrderByAccount } from "@/services/order.service";
import jwt from "jsonwebtoken";

interface Order {
  _id: string;
  customer: string;
  phone: string;
  address: string;
  total_money: number;
  payment_method: string;
  status: string;
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

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token || typeof token !== "string") return null;
    try {
      const decoded: any = jwt.decode(token);
      return decoded?.id || decoded?.account_id;
    } catch (err) {
      return null;
    }
  };

  const fetchOrders = async () => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      setMessage("Vui lòng đăng nhập.");
      return;
    }

    try {
  const data = await getOrderByAccount(accountId);
  setOrders(data); // thành công, gán luôn
} catch (error) {
  console.error("Lỗi khi lấy đơn hàng:", error);
  setMessage("Lỗi kết nối đến máy chủ.");
}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">📦 Lịch sử đơn hàng</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">🆔 Mã đơn: {order._id}</p>
                  <p>🕒 Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
                  <p>💳 Thanh toán: {order.payment_method}</p>
                  <p>📦 Trạng thái: <span className="font-semibold">{order.status}</span></p>
                </div>
                <div className="text-right font-semibold">
                  Tổng tiền: {order.total_money.toLocaleString()}đ
                </div>
              </div>
              <div>
                <p className="mb-2">📍 Giao đến: {order.customer}, {order.phone}, {order.address}</p>
                <ul className="space-y-2">
  {order.cart?.items?.map((item, index) => (
    <li key={index} className="flex items-center space-x-4">
      <img
        src={item.food.img}
        alt={item.food.name}
        className="w-14 h-14 object-cover rounded"
      />
      <div>
        <p className="font-semibold">{item.food.name}</p>
        <p>
          {item.quantity} x {item.food.price.toLocaleString()}đ
        </p>
      </div>
    </li>
  ))}
</ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
