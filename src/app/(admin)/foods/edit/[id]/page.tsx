"use client";

import { useEffect, useState } from "react";
import { getFoodDetail, updateFood } from "@/services/food.service";
import { getCategory } from "@/services/category.service"; // Import getCategory
import { useParams, useRouter } from "next/navigation";

export default function EditFoodPage() {
  const router = useRouter();
  const { id } = useParams();
  const [food, setFood] = useState({ name: "", price: "", address: "", img: "", category_id: "" });
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getFoodDetail(id);
      setFood(data);
    };

    const fetchCategories = async () => {
      const data = await getCategory();
      setCategories(data);
    };

    fetchDetail();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateFood(id, food);
    router.push("/foods");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Sửa món ăn</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên món ăn</label>
          <input
            name="name"
            placeholder="Tên món ăn"
            value={food.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Giá</label>
          <input
            name="price"
            type="number"
            placeholder="Giá"
            value={food.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Địa chỉ</label>
          <input
            name="address"
            placeholder="Địa chỉ"
            value={food.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Hình ảnh</label>
          <input
            name="img"
            placeholder="URL hình ảnh"
            value={food.img}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Danh mục</label>
          <select
            name="category_id"
            value={food.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}