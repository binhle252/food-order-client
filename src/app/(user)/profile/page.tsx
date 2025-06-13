"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/services/account.service";

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

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
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin người dùng");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-5">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center mt-5">Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
      <p><strong>Tên đăng nhập:</strong> {profile.username}</p>
      <p><strong>Số điện thoại:</strong> {profile.phone || "Chưa có"}</p>
      <p><strong>Địa chỉ:</strong> {profile.address || "Chưa có"}</p>
      <p><strong>Vai trò:</strong> {profile.role}</p>
    </div>
  );
}
