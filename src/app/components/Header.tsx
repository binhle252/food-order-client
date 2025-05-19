"use client";

import styles from './Header.module.css';
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { Dispatch, SetStateAction } from 'react';

const pacifico = Pacifico({
  subsets: ['vietnamese'],
  weight: '400',
});

// 👉 THÊM props interface
interface HeaderProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

// 👉 NHẬN props
export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
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
            value={searchTerm} // 👉 giá trị hiện tại
            onChange={(e) => setSearchTerm(e.target.value)} // 👉 cập nhật khi gõ
          />
        </div>
        <div className={styles.navLinks}>
          <Link href="/cart" className={styles.navLink}>
            Cart
          </Link>
          <Link href="/order" className={styles.navLink}>
            Order
          </Link>
          <Link href="/profile" className={styles.navLink}>
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}
