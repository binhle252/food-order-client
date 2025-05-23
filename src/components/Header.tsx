"use client";

import styles from './Header.module.css';
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { useSearch } from "./SearchContext";
import { useEffect, useState } from "react";

const pacifico = Pacifico({
  subsets: ['vietnamese'],
  weight: '400',
});

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập - thay đổi theo cách bạn lưu token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // hoặc session info
    setIsLoggedIn(false);
    window.location.href = '/'; // điều hướng lại nếu cần
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navHome}>
          <Link href="/" className={`${styles.navLink} ${pacifico.className}`}>
            Ăn vặt N7
          </Link>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm món ăn..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.navLinks}>
          {!isLoggedIn ? (
            <>
              <Link href="/register" className={styles.navButton}>
                <span className={styles.icon}>✍️</span>
                <span className={styles.buttonText}>Đăng ký</span>
              </Link>
              <Link href="/login" className={styles.navButton}>
                <span className={styles.icon}>🔑</span>
                <span className={styles.buttonText}>Đăng nhập</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/(user)/cart" className={styles.navButton}>
                🛒 Giỏ hàng
              </Link>
              <Link href="/(user)/profile" className={styles.navButton}>
                👤 Hồ sơ
              </Link>
              <button onClick={handleLogout} className={styles.navButton}>
                🚪 Đăng xuất
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
