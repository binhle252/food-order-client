"use client";

import styles from './Header.module.css';
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { useSearch } from "./SearchContext";
import { useAuth } from "@/contexts/AuthContext"; // dùng context

const pacifico = Pacifico({
  subsets: ['vietnamese'],
  weight: '400',
});

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { isLoggedIn, role, logout } = useAuth(); // lấy từ context

  const handleLogout = () => {
    logout(); // gọi logout context
    window.location.href = "/"; // redirect sau khi logout
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
          ) : role === "admin" ? (
            <>
              <Link href="/dashboard" className={styles.navButton}>
                🛠 Quản trị
              </Link>
              <button onClick={handleLogout} className={styles.navButton}>
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/cart" className={styles.navButton}>
                🛒 Giỏ hàng
              </Link>
              <Link href="/profile" className={styles.navButton}>
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
