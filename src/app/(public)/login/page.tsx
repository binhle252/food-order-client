"use client";

import React, { useState } from "react";
import { login } from "@/services/account.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form);
      alert(res.message);

      // Chuyển hướng sau khi đăng nhập
      if (res.data.role === "admin") {
        router.push("/(admin)/dashboard");
      } else {
        router.push("/(user)/cart");
      }
    } catch (err: any) {
      alert(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="border p-2 rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Đăng nhập
      </button>
    </form>
  );
}
