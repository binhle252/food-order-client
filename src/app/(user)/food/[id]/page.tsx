"use client";

import { useEffect, useState } from "react";
import { getFoodDetail } from "@/services/food.service";
import { addToCart } from "@/services/cart.service";
import Image from "next/image";
import CommentsSection from "@/components/CommentsSection";
import jwt from "jsonwebtoken";
import { useParams } from "next/navigation";

interface Food {
  _id: string;
  name: string;
  price: number;
  img: string;
  description: string;
  address: string;
}

export default function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState<Food | null>(null);
  const [message, setMessage] = useState<string>("");
  const baseUrl = "http://localhost:5000";

  const encodeImageUrl = (img: string) => {
    if (img?.startsWith("http")) return img;
    if (!img) return "/default-image.jpg";
    const encodedPath = img.replace(/ /g, "%20").replace(/^\/Uploads\//, "/uploads/");
    return `${baseUrl}${encodedPath}`;
  };

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await getFoodDetail(id as string);
        setFood(data);
      } catch (err) {
        setMessage("Không thể tải chi tiết món ăn.");
      }
    }
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token || typeof token !== "string") return null;
    try {
      const decoded: any = jwt.decode(token);
      if (typeof decoded !== "object" || decoded === null) return null;
      return decoded.account_id || decoded.id || null;
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
      await addToCart({
        account_id: accountId,
        food_id: food!._id,
        quantity: 1,
      });
      setMessage("🛒 Đã thêm vào giỏ hàng!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage("❌ Lỗi khi thêm vào giỏ hàng.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!food) {
    return <div className="p-4">Đang tải chi tiết món ăn...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={encodeImageUrl(food.img)}
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
      <div className="mt-10">
        <CommentsSection foodId={food._id} />
      </div>
      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
}