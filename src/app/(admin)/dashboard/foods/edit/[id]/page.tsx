"use client";

import { useState, useEffect } from "react";
import { updateFood, getFoodDetail } from "@/services/food.service";
import { getCategory } from "@/services/category.service";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface Category {
  _id: string;
  name: string;
}

export default function EditFoodPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentImg, setCurrentImg] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();
  const params = useParams();
  const baseUrl = "http://localhost:5000";

  const encodeImageUrl = (img: string) => {
    if (img?.startsWith("http")) return img;
    if (!img) return "/default-image.jpg";
    const encodedPath = img
      .replace(/ /g, "%20")
      .replace(/^\/Uploads\//, "/uploads/");
    return `${baseUrl}${encodedPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy chi tiết món ăn
        const food = await getFoodDetail(params.id as string);
        setName(food.name);
        setPrice(food.price.toString());
        setAddress(food.address);
        setCurrentImg(food.img || "");
        setSelectedCategory(food.category_id?._id || food.category_id || "");

        // Lấy danh sách danh mục
        const cats = await getCategory();
        setCategories(cats);
        if (!food.category_id && cats.length > 0) {
          setSelectedCategory(cats[0]._id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [params.id]);

  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("address", address);
      formData.append("category_id", selectedCategory);
      if (imgFile) {
        formData.append("img", imgFile);
      }

      await updateFood(params.id as string, formData);
      router.push("/dashboard/foods");
    } catch (err) {
      console.error("Error updating food:", err); // Dòng 74
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Sửa món ăn</h1>
      <form onSubmit={handleFoodSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Tên món ăn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Giá</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Địa chỉ</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Hình ảnh hiện tại</label>
          {currentImg && (
            <div className="mt-2">
              <Image
                src={encodeImageUrl(currentImg)}
                alt="Current food"
                width={160}
                height={160}
                className="object-cover rounded border"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium">Hình ảnh mới (tùy chọn)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImgFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            className="w-full p-2 border rounded"
          />
          {previewUrl && (
            <div className="mt-2">
              <Image
                src={previewUrl}
                alt="Preview"
                width={160}
                height={160}
                className="object-cover rounded border"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium">Danh mục</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
          Cập nhật món ăn
        </button>
      </form>
    </div>
  );
}
