"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/services/account.service";
import styles from "../../../styles/UserProfilePage.module.css";

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
  const [phoneError, setPhoneError] = useState("");

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

  const isValidPhoneNumber = (phone: string): boolean => {
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return regex.test(phone);
  };

  const handleSubmit = async () => {
    if (!isValidPhoneNumber(formData.phone)) {
  setPhoneError("Số điện thoại không hợp lệ");
  return;
} else {
  setPhoneError("");
}
    try {
      await updateUserProfile(formData);
      setSuccessMsg("Cập nhật thành công!");
      setError("");
    } catch (err) {
      setError("Lỗi khi cập nhật");
      setSuccessMsg("");
    }
  };

  if (error) return <p className={styles.errorMessage}>{error}</p>;

  if (!profile)
    return <p className={styles.loadingMessage}>Đang tải thông tin...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thông tin cá nhân</h1>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tên đăng nhập:</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Số điện thoại:</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa chỉ:</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <button onClick={handleSubmit} className={styles.button}>
        Cập nhật
      </button>
      {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}

      {successMsg && <p className={styles.successMessage}>{successMsg}</p>}
    </div>
  );
}
