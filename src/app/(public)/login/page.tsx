"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginAPI } from "@/services/account.service"; // ✅ đổi tên login để tránh trùng
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth(); // ✅ login của context
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginAPI(formData);
      console.log("Login result in component:", result);
      const token = result?.data?.token;
      const role = result?.data?.role;


      console.log("Role:", role);

      if (!token || !role) {
        throw new Error("Token hoặc role không hợp lệ từ phản hồi API");
      }

      // Cập nhật vào context
      login(token, role);

      // Điều hướng
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/user-home");
      }

    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
