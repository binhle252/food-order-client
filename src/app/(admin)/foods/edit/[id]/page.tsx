"use client";

import { useEffect, useState } from "react";
import { getFoodDetail, updateFood } from "@/services/food.service";
import { useParams, useRouter } from "next/navigation";

export default function EditFoodPage() {
  const router = useRouter();
  const { id } = useParams();
  const [food, setFood] = useState({ name: "", price: "", address: "", img: "", category_id: "" });

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getFoodDetail(id);
      setFood(data);
    };
    fetchDetail();
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
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Sửa món ăn</h1>
      {["name", "price", "address", "img", "category_id"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={food[field]}
          onChange={handleChange}
          className="block border mb-2 p-2 w-full"
        />
      ))}
      <button type="submit" className="bg-green-500 text-white px-4 py-2">Cập nhật</button>
    </form>
  );
}
