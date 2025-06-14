"use client";

import { useEffect, useState } from "react";
import { getOrder } from "@/services/order.service";

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

const ORDERS_PER_PAGE = 5;

export default function AdminRecentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");

  const fetchRecentOrders = async () => {
    try {
      const data = await getOrder({});
      const sorted = data
        .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      setMessage("Không thể kết nối đến máy chủ.");
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const currentOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">🧾 Danh sách đơn hàng gần đây</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentOrders.map((order) => (
              <li key={order._id} className="border rounded p-4 shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">🆔 {order._id}</p>
                    <p>👤 {order.customer}</p>
                    <p>📦 Trạng thái: <span className="font-semibold">{order.status}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {order.total_money.toLocaleString()}đ
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                {order.cart?.items?.length > 0 && (
                  <ul className="pl-4 list-disc text-sm text-gray-700">
                    {order.cart.items.map((item, index) => (
                      <li key={index}>
                        {item.food.name} - {item.quantity} x {item.food.price.toLocaleString()}đ
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ⬅ Trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Tiếp ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
