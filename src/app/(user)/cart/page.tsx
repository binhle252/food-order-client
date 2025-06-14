"use client";

import { useEffect, useState } from "react";
import { getCart, deleteItem, updateItem } from "@/services/cart.service";
import jwt from "jsonwebtoken";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("On delivery");

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
      setCartId(cart._id); // Lưu lại cart_id để gửi khi thanh toán
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

  const handleCheckout = async () => {
    if (!accountId || !cartItems.length || !cartId) return;

    if (!customer || !phone || !address) {
      setMessage("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          phone,
          address,
          payment_method: paymentMethod,
          total_money: totalPrice,
          cart_id: cartId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Đặt hàng thành công!");
        setCartItems([]);
        setCustomer("");
        setPhone("");
        setAddress("");
      } else {
        setMessage(data.message || "Lỗi khi đặt hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      setMessage("Đã xảy ra lỗi khi đặt hàng.");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

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
                  <img
                    src={item.food.img}
                    alt={item.food.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">{item.food.name}</h2>
                    <p className="text-gray-600">
                      {item.food.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdate(item._id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdate(item._id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-4 text-red-500"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Thông tin giao hàng */}
          <div className="my-6 space-y-3">
            <input
              type="text"
              placeholder="Tên khách hàng"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Địa chỉ giao hàng"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="On delivery">Thanh toán khi nhận hàng</option>
              <option value="Online">Thanh toán online</option>
            </select>
          </div>

          {/* Tổng tiền + Nút thanh toán */}
          <div className="mt-6 text-right text-lg font-semibold">
            Tổng tiền: {totalPrice.toLocaleString()}đ
          </div>
          <button
            onClick={handleCheckout}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
}
