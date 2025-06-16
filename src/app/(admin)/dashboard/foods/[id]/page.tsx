"use client";

import { useEffect, useState } from "react";
import { getFoodDetail } from "@/services/food.service";
import { addToCart } from "@/services/cart.service";
import jwt from "jsonwebtoken";
import Image from "next/image";

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  const [food, setFood] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Lấy account_id từ token
  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token || typeof token !== "string") return null;

    try {
      const decoded: any = jwt.decode(token);
      return decoded?.account_id || decoded?.id || null;
    } catch (err) {
      console.error("Decode token error:", err);
      return null;
    }
  };

  const handleAddToCart = async () => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      setMessage("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const cartData = {
        account_id: accountId,
        food_id: food._id,
        quantity: 1,
      };
      await addToCart(cartData);
      setMessage("🛒 Đã thêm vào giỏ hàng!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage("❌ Lỗi khi thêm vào giỏ hàng.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    async function fetchFood() {
      const res = await getFoodDetail(params.id);
      setFood(res);
    }
    fetchFood();
  }, [params.id]);

  if (!food) return <p>Đang tải món ăn...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={food.img}
            alt={food.name}
            width={500}
            height={500}
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
          <p className="text-2xl text-red-500 mb-4">
            {food.price.toLocaleString()}đ
          </p>
          <p className="text-gray-600 mb-4">{food.description}</p>
          <p className="text-gray-500 mb-2">📍 {food.address}</p>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
}
