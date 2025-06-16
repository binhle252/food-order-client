"use client";

import { useState } from "react";
import { createCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [img, setImg] = useState<File | null>(null); // ⚠️ ảnh là file
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (img) formData.append("img", img); // append ảnh nếu có

    await createCategory(formData); // gọi API với FormData
    router.push("/dashboard/categories");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm danh mục</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="border p-2 w-full" required />
        <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files?.[0] || null)} className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm</button>
      </form>
    </div>
  );
}
