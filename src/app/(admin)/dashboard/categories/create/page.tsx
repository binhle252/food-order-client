"use client";

import { useState, useEffect } from "react";
import { createCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState(""); // 👉 Thêm preview ảnh
  const router = useRouter();

  // Khi chọn file mới thì tạo preview ảnh
  useEffect(() => {
    if (img) {
      const previewUrl = URL.createObjectURL(img);
      setImgPreview(previewUrl);

      // Cleanup để tránh memory leak
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [img]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (img) formData.append("img", img);

    await createCategory(formData);
    router.push("/dashboard/categories");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm danh mục</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên danh mục"
          className="border p-2 w-full"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files?.[0] || null)}
          className="border p-2 w-full"
          required
        />

        {/* 👉 Hiển thị ảnh preview nếu có */}
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm
        </button>
      </form>
    </div>
  );
}
