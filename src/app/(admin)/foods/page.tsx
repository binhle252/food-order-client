"use client";

import { useEffect, useState } from "react";
import { getFood, deleteFood } from "@/services/food.service";
import { getCategory, deleteCategory } from "@/services/category.service";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  // Lấy món ăn
  const fetchFoods = async () => {
    const data = await getFood("");
    setFoods(data);
  };

  // Lấy danh mục
  const fetchCategories = async () => {
    const data = await getCategory();
    setCategories(data);
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const handleDeleteFood = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
      await deleteFood(id);
      fetchFoods();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  return (
    <div className="p-4 space-y-12">

      {/* Danh sách món ăn */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Danh sách món ăn</h1>
        <Link href="/foods/create" className="text-blue-500">+ Thêm món ăn</Link>
        <table className="w-full mt-4 border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-2">Tên</th>
              <th className="text-left p-2">Giá</th>
              <th className="text-left p-2">Địa chỉ</th>
              <th className="text-left p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id} className="border-b">
                <td className="p-2">{food.name}</td>
                <td className="p-2">{food.price.toLocaleString()}đ</td>
                <td className="p-2">{food.address}</td>
                <td className="p-2">
                  <Link href={`/foods/edit/${food._id}`} className="text-blue-500 mr-2">Sửa</Link>
                  <button onClick={() => handleDeleteFood(food._id)} className="text-red-500">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Danh sách danh mục */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Danh sách danh mục</h1>
        <Link href="/categories/create" className="text-blue-500">+ Thêm danh mục</Link>
        <table className="w-full mt-4 border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-2">Tên</th>
              <th className="text-left p-2">Hình ảnh</th>
              <th className="text-left p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b">
                <td className="p-2">{category.name}</td>
                <td className="p-2">
                  <img src={category.img} alt={category.name} className="h-12 w-12 object-cover rounded" />
                </td>
                <td className="p-2">
                  <Link href={`/categories/edit/${category._id}`} className="text-blue-500 mr-2">Sửa</Link>
                  <button onClick={() => handleDeleteCategory(category._id)} className="text-red-500">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
