"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/services/account.service";

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    address: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await getUserProfile();
        setProfile(res.data);
        setFormData({
          username: res.data.username || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin người dùng");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateUserProfile(formData);
      setSuccessMsg("Cập nhật thành công!");
    } catch (err) {
      setError("Lỗi khi cập nhật");
    }
  };

  if (error) return <p className="text-red-500 text-center mt-5">{error}</p>;
  if (!profile)
    return <p className="text-center mt-5">Đang tải thông tin...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      <label className="block mb-2">Tên đăng nhập:</label>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="input"
      />

      <label className="block mt-4 mb-2">Số điện thoại:</label>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="input"
      />

      <label className="block mt-4 mb-2">Địa chỉ:</label>
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="input"
      />

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Cập nhật
      </button>

      {successMsg && <p className="text-green-500 mt-4">{successMsg}</p>}
    </div>
  );
}
