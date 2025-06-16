"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/services/account.service";
import styles from "../../../styles/UserProfilePage.module.css";

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", phone: "", address: "" });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Đảm bảo không gọi API quá nhiều lần nếu component re-render
        if (!profile) { // Chỉ fetch nếu profile chưa có
            const res = await getUserProfile();
            setProfile(res.data);
            setFormData({
                username: res.data.username || "",
                phone: res.data.phone || "",
                address: res.data.address || "",
            });
        }
      } catch (err: any) {
        console.error("Lỗi khi tải thông tin người dùng:", err);
        setError(err.message || "Không thể tải thông tin người dùng.");
      }
    };

    fetchProfile();
  }, [profile, router]); // Thêm profile và router vào dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa thông báo thành công hoặc lỗi khi người dùng bắt đầu chỉnh sửa lại
    if (successMsg) setSuccessMsg("");
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError(""); // Reset lỗi
    setSuccessMsg(""); // Reset thông báo thành công

    // Basic validation
    if (!formData.username.trim()) {
      setError("Tên đăng nhập không được để trống.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Số điện thoại không được để trống.");
      return;
    }
    if (!formData.address.trim()) {
      setError("Địa chỉ không được để trống.");
      return;
    }
    
    // Optional: phone number format validation
    const phoneRegex = /^[0-9]{10,11}$/; // Ví dụ: 10 hoặc 11 chữ số
    if (!phoneRegex.test(formData.phone.trim())) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 hoặc 11 chữ số.");
      return;
    }


    try {
      await updateUserProfile(formData);
      setSuccessMsg("Cập nhật thông tin thành công!");
      // Có thể refresh profile sau khi cập nhật nếu cần (ít cần thiết nếu dữ liệu hiển thị là formData)
      // fetchProfile(); 
    } catch (err: any) {
      console.error("Lỗi khi cập nhật profile:", err);
      setError(err.response?.data?.message || "Lỗi khi cập nhật thông tin.");
    }
  };

  if (error && !profile) return <p className={styles.errorMessage}>{error}</p>; // Hiển thị lỗi ban đầu
  if (!profile) return <p className={styles.loadingMessage}>Đang tải thông tin...</p>; // Hiển thị loading

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>✨ Thông tin cá nhân</h1> {/* Đổi icon nếu muốn */}

      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMsg && <p className={styles.successMessage}>{successMsg}</p>}

      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>Tên đăng nhập:</label>
        <input 
          type="text"
          id="username"
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.label}>Số điện thoại:</label>
        <input 
          type="text" // Đôi khi dùng "tel" cho ngữ nghĩa, nhưng "text" cũng được
          id="phone"
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>Địa chỉ:</label>
        <input 
          type="text"
          id="address"
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          className={styles.input} 
        />
      </div>

      <button
        onClick={handleSubmit}
        className={styles.submitButton}
      >
        Cập nhật thông tin
      </button>
    </div>
  );
}