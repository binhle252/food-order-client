"use client";

import { useEffect, useState } from "react";
import { getFood, deleteFood } from "@/services/food.service";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [foods, setFoods] = useState([]);

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

  return (
    <div className="p-4 space-y-12">

      {/* Danh sách món ăn */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Danh sách món ăn</h1>
        <Link href="/dashboard/foods/create" className="text-blue-500">+ Thêm món ăn</Link>
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
  {foods.map((food) => (
    <tr key={food._id} className="border-b">
      <td className="p-2">{food.name}</td>

      {/* Giá món ăn */}
      <td className="p-2">
        {typeof food.price === "number"
          ? food.price.toLocaleString("vi-VN") + "₫"
          : "Chưa có giá"}
      </td>

      <td className="p-2">{food.address}</td>

      {/* Danh mục: kiểm tra tồn tại category_id */}
      <td className="p-2">
        {food.category_id?.name ?? "Không có danh mục"}
      </td>

      <td className="p-2">
        <Link href={`/dashboard/foods/edit/${food._id}`} className="text-blue-500 mr-2">
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
