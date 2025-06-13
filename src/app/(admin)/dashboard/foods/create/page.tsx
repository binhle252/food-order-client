"use client";
import { useState, useEffect } from "react";
import { createFood } from "@/services/food.service";
import { getCategory } from "@/services/category.service";
import { useRouter } from "next/navigation";

export default function CreateFoodPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [img, setImg] = useState(""); // Thêm state cho URL hình ảnh
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategory();
            setCategories(data);
            if (data.length > 0) setSelectedCategory(data[0]._id); // Mặc định chọn danh mục đầu tiên
        };
        fetchCategories();
    }, []);

    const handleFoodSubmit = async (e) => {
        e.preventDefault();
        try {
            await createFood({
                name,
                price: Number(price),
                address,
                img, // Thêm img vào dữ liệu gửi đi
                category_id: selectedCategory,
            });
            router.push("/foods"); // Hoặc đường dẫn sau khi tạo
        } catch (err) {
            console.error("Lỗi khi thêm món ăn:", err);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Thêm món ăn</h1>
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
                    <label className="block font-medium">Hình ảnh</label>
                    <input
                        type="text"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        placeholder="URL hình ảnh"
                        className="w-full p-2 border rounded"
                    />
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
                    Thêm món ăn
                </button>
            </form>
        </div>
    );
}