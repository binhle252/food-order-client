"use client";

import { useEffect, useState } from "react";
import { getCart, deleteItem, updateItem } from "@/services/cart.service";
import jwt from "jsonwebtoken";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

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

  const fetchCart = async () => {
    const accId = getAccountIdFromToken();
    if (!accId) {
      setMessage("Vui lòng đăng nhập.");
      return;
    }
    setAccountId(accId);
    try {
      const cart = await getCart(accId);
      const validItems = (cart.items || []).filter((item: any) => item.food !== null);
      setCartItems(validItems);
    } catch (err) {
      setMessage("Không thể tải giỏ hàng.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (itemId: string) => {
    if (!accountId) return;
    try {
      await deleteItem(accountId, itemId);
      fetchCart();
    } catch {
      setMessage("Lỗi khi xóa món.");
    }
  };

  const handleUpdate = async (itemId: string, quantity: number) => {
    if (!accountId || quantity < 1) return;
    try {
      await updateItem(accountId, itemId, quantity);
      fetchCart();
    } catch {
      setMessage("Lỗi khi cập nhật số lượng.");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {!cartItems.length ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item: any) => (
              <li
                key={item._id}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.food.img} alt={item.food.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h2 className="font-semibold">{item.food.name}</h2>
                    <p className="text-gray-600">{item.food.price.toLocaleString()}đ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdate(item._id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >+</button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-4 text-red-500"
                  >Xóa</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Tổng tiền */}
          <div className="mt-6 text-right text-lg font-semibold">
            Tổng tiền: {totalPrice.toLocaleString()}đ
          </div>
        </div>
      )}
    </div>
  );
}
