"use client";

import { useEffect, useState } from "react";
import { updateCategory, getCategory } from "@/services/category.service";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState({ name: "", img: "" });

  useEffect(() => {
    async function fetchCategory() {
      const data = await getCategory(); // lấy toàn bộ, bạn có thể tối ưu hơn bằng API get 1 item
      const current = data.find((c) => c._id === params.id);
      if (current) setCategory(current);
    }
    fetchCategory();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCategory(params.id, category);
    router.push("/categories");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sửa danh mục</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className="border p-2 w-full" required />
        <input value={category.img} onChange={(e) => setCategory({ ...category, img: e.target.value })} className="border p-2 w-full" required />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Cập nhật</button>
      </form>
    </div>
  );
}
