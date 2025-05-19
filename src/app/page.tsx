"use client";

import styles from './page.module.css';
import { useEffect, useState } from "react";
import { getCategory } from "./services/category.service";
import { getFood } from "./services/food.service";
import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [currentCategoryID, setCurrentCategoryID] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        const filteredFoods = foodList.filter(food =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFoods(filteredFoods);
      }
    }
    fetchDataFood();
  }, [currentCategoryID, searchTerm]);

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles.bannerContainer}>
        <img 
          src="https://www.gopalnamkeen.com/storage/product_gallary_images/1719033292-2024-06-22%2010-44-54.jpg" 
          alt="Banner ẩm thực" 
          className={styles.bannerImage}
        />
      </div>

      <div className={styles.container}>
        {/* Phần danh mục */}
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
                  alt={category.name || "Ảnh món ăn"}
                  className={styles.categoryImage}
                />
                <h2 className={styles.categoryName}>{category.name}</h2>
              </li>
            ))}
          </ul>
        </section>

        {/* Phần món ăn */}
        <section className={styles.foodSection}>
          <h2 className={styles.foodTitle}><i className="fas fa-utensils"></i> Món ăn</h2>
          <ul className={styles.foodList}>
            {foods.map((food) => (
              <li key={food._id} className={styles.foodItem}>
                <Link href={`/foods/${food._id}`} passHref>
                  <div className={styles.foodLinkWrapper}>
                    <img 
                      src={food.img} 
                      alt={food.name} 
                      className={styles.foodImage}
                    />
                    <h3 className={styles.foodName}>{food.name}</h3>
                  </div>
                </Link>
                <p className={styles.foodPrice}>💰 {food.price.toLocaleString()}đ</p>
                <p className={styles.foodAddress}>📍 {food.address}</p>
                <button className={styles.addToCartButton}>🛒 Thêm vào giỏ</button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}