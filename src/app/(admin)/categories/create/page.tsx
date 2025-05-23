"use client";

import { useState } from "react";
import { createCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCategory({ name, img });
    router.push("/categories");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm danh mục</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="border p-2 w-full" required />
        <input value={img} onChange={(e) => setImg(e.target.value)} placeholder="Link hình ảnh" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </form>
    </div>
  );
}
