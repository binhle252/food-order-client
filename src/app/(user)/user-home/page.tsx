"use client";

import styles from "../../page.module.css";
import { useEffect, useState } from "react";
import { getCategory } from "../../../services/category.service";
import { getFood } from "../../../services/food.service";
import Link from "next/link";
import { useSearch } from "@/components/SearchContext";
import { addToCart } from "../../../services/cart.service";
import jwt from "jsonwebtoken";

export default function Home() {
  const { searchTerm } = useSearch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [currentCategoryID, setCurrentCategoryID] = useState<string | undefined>(undefined);
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [message, setMessage] = useState<string>("");

  // Lấy account_id từ token (không verify)
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

  useEffect(() => {
    async function fetchDataCategories() {
      const cate = await getCategory();
      setCategories(cate);
      if (cate.length > 0) {
        setCurrentCategoryID(cate[0]._id);
      }
    }
    fetchDataCategories();
  }, []);

  useEffect(() => {
    async function fetchDataFood() {
      if (currentCategoryID) {
        const foodList = await getFood(currentCategoryID);
        setAllFoods(foodList);
      }
    }
    fetchDataFood();
  }, [currentCategoryID]);

  useEffect(() => {
    if (allFoods.length > 0) {
      const filteredFoods = allFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFoods(filteredFoods);
    }
  }, [searchTerm, allFoods]);

  // Thêm vào giỏ hàng
  const handleAddToCart = async (foodId: string) => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      setMessage("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const cartData = { account_id: accountId, food_id: foodId, quantity: 1 };
      await addToCart(cartData);
      setMessage("🛒 Đã thêm vào giỏ hàng!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Add to cart error:", error);
      setMessage("❌ Lỗi khi thêm vào giỏ hàng.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <div className={styles.bannerContainer}>
        <img
          src="https://www.gopalnamkeen.com/storage/product_gallary_images/1719033292-2024-06-22%2010-44-54.jpg"
          alt="Banner ẩm thực"
          className={styles.bannerImage}
        />
      </div>

      <div className={styles.container}>
        {/* Danh mục */}
        <section className={styles.categorySection}>
          <h1 className={styles.categoryTitle}><i className="fas fa-bars"></i> Danh mục món ăn</h1>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li
                key={category._id}
                onClick={() => setCurrentCategoryID(category._id)}
                className={`${styles.categoryItem} ${
                  category._id === currentCategoryID
                    ? styles.activeCategory
                    : styles.inactiveCategory
                }`}
              >
                <img
                  src={category.img}
                  alt={category.name || "Ảnh danh mục"}
                  className={styles.categoryImage}
                />
                <h2 className={styles.categoryName}>{category.name}</h2>
              </li>
            ))}
          </ul>
        </section>

        {/* Món ăn */}
        <section className={styles.foodSection}>
          <h2 className={styles.foodTitle}><i className="fas fa-utensils"></i> Món ăn</h2>
          <ul className={styles.foodList}>
            {foods.map((food) => (
              <li key={food._id} className={styles.foodItem}>
                <Link href={`/food/${food._id}`} passHref>
                  <div className={styles.foodLinkWrapper}>
                    <img
                      src={food.img}
                      alt={food.name}
                      className={styles.foodImage}
                    />
                    <h3 className={styles.foodName}>{food.name}</h3>
                  </div>
                </Link>
                <p className={styles.foodPrice}>💰 {food.price ? food.price.toLocaleString() + "đ" : "N/A"}</p>
                <p className={styles.foodAddress}>📍 {food.address}</p>
                <button
                  onClick={() => handleAddToCart(food._id)}
                  className={styles.addToCartButton}
                >
                  🛒 Thêm vào giỏ
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Thông báo */}
      {message && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {message}
        </div>
      )}
    </>
  );
}
