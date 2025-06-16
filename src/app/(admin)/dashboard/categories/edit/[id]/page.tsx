"use client";

import { useEffect, useState } from "react";
import { updateCategory, getCategory } from "@/services/category.service";
import { useRouter, useParams } from "next/navigation";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [imgPreview, setImgPreview] = useState(""); // Dùng để preview ảnh (cũ hoặc mới)
  const [imgFile, setImgFile] = useState<File | null>(null);

  // Lấy thông tin danh mục ban đầu
  useEffect(() => {
    async function fetchCategory() {
      const data = await getCategory();
      const current = data.find((c) => c._id === params.id);
      if (current) {
        setName(current.name);
        setImgPreview(current.img ? `http://localhost:5000${current.img}` : "");
      }
    }
    fetchCategory();
  }, [params.id]);

  // Khi chọn file mới thì tạo preview ảnh
  useEffect(() => {
    if (imgFile) {
      const previewUrl = URL.createObjectURL(imgFile);
      setImgPreview(previewUrl);

      // Cleanup để tránh memory leak
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [imgFile]);

  // Submit cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (imgFile) formData.append("img", imgFile);

    await updateCategory(params.id, formData);
    router.push("/dashboard/categories");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sửa danh mục</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImgFile(e.target.files?.[0] || null)}
          className="border p-2 w-full"
        />
        {imgPreview && (
          <img
            src={imgPreview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Cập nhật
        </button>
      </form>
    </div>
  );
}
