"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFoodDetail } from "@/services/food.service";
import { addToCart } from "@/services/cart.service";
import Image from "next/image";
import CommentsSection from "../../../../components/CommentsSection.module";
import jwt from "jsonwebtoken";
import styles from "../../../../styles/FoodDetailPage.module.css";

interface Food {
  _id: string;
  name: string;
  price: number;
  img: string;
  description: string;
  address: string;
}

export default function FoodDetailPage() {
  const { id } = useParams(); // Lấy id từ URL params
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
        setMessage("");
      } catch (err) {
        console.error("Error fetching food detail:", err);
        setMessage("Không thể tải chi tiết món ăn.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
    if (id) {
      fetchDetail();
    }
  }, [id]); // id is a dependency

  const getAccountIdFromToken = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
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
    if (!food) {
        setMessage("Lỗi: Thông tin món ăn chưa được tải.");
        setTimeout(() => setMessage(""), 3000);
        return;
    }

    try {
      await addToCart({
        account_id: accountId,
        food_id: food._id,
        quantity: 1,
      });
      setMessage("🛒 Đã thêm vào giỏ hàng!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      console.error("Add to cart error:", err);
      setMessage(`❌ Lỗi khi thêm vào giỏ hàng: ${err.response?.data?.message || 'Vui lòng thử lại.'}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!food) {
    return <div className={styles.loadingMessage}>Đang tải chi tiết món ăn...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentGrid}>
        <div className={styles.imageWrapper}>
          <Image
            src={encodeImageUrl(food.img)}
            alt={food.name}
            width={500}
            height={500}
            className={styles.foodImage}
            priority
          />
        </div>
        <div className={styles.detailsSection}>
          <h1 className={styles.foodName}>{food.name}</h1>
          <p className={styles.foodPrice}>
            {food.price.toLocaleString("vi-VN")}đ
          </p>
          <p className={styles.foodDescription}>{food.description}</p>
          <p className={styles.foodAddress}>📍 {food.address}</p>
          <button
            onClick={handleAddToCart}
            className={styles.addToCartButton}
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      <div className={styles.commentsSection}>
        {/* Đảm bảo CommentsSection.module là một React Component hợp lệ */}
        <CommentsSection foodId={food._id} /> 
      </div>
      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}
    </div>
  );
}