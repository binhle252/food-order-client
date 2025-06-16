"use client";

import { useEffect, useState } from "react";
import { getFood, deleteFood } from "@/services/food.service";
import { getCategory } from "@/services/category.service";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Lấy món ăn
  const fetchFoods = async () => {
    const data = await getFood("");
    setFoods(data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDeleteFood = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
      await deleteFood(id);
      fetchFoods();
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategory();
    setCategories(data);
  };

  return (
    <div className="p-4 space-y-12">
      {/* Danh sách món ăn */}
      <section>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm món ăn theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/2"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded w-full sm:w-1/2"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <h1 className="text-2xl font-bold mb-4">Danh sách món ăn</h1>
        <Link href="/dashboard/foods/create" className="text-blue-500">
          + Thêm món ăn
        </Link>
        <table className="w-full mt-4 border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-2">Tên</th>
              <th className="text-left p-2">Giá</th>
              <th className="text-left p-2">Địa chỉ</th>
              <th className="text-left p-2">Danh mục</th>
              <th className="text-left p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods
              .filter((food) =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .filter(
                (food) =>
                  selectedCategory === "all" ||
                  food.category_id?._id === selectedCategory
              )
              .map((food) => (
                <tr key={food._id} className="border-b">
                  <td className="p-2">{food.name}</td>
                  <td className="p-2">
                    {typeof food.price === "number"
                      ? food.price.toLocaleString("vi-VN") + "₫"
                      : "Chưa có giá"}
                  </td>
                  <td className="p-2">{food.address}</td>
                  <td className="p-2">
                    {food.category_id?.name ?? "Không có danh mục"}
                  </td>
                  <td className="p-2">
                    <Link
                      href={`/dashboard/foods/edit/${food._id}`}
                      className="text-blue-500 mr-2"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDeleteFood(food._id)}
                      className="text-red-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
