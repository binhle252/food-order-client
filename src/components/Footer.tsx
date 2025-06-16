import Link from "next/link";
import styles from "../styles/Footer.module.css";

import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Phần thông tin chính - N7 FOOD */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>ĂN VẶT N7</h3>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/menu">Thực đơn</Link>
            </li>
            <li>
              <Link href="/about">Về chúng tôi</Link>
            </li>
          </ul>
        </div>

        {/* Phần chính sách */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>CHÍNH SÁCH</h3>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/privacy-policy">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link href="/shipping-policy">Chính sách giao hàng</Link>
            </li>
            <li>
              <Link href="/return-policy">Chính sách đổi trả</Link>
            </li>
          </ul>
        </div>

        {/* Phần liên hệ */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>LIÊN HỆ</h3>
          <ul className={styles.contactInfo}>
            <li>📍 Số 1001 Lê Văn Việt, TP.Thủ Đức</li>
            <li>📞 0123.456.789</li>
            <li>✉️ anvatn7@gmail.com</li>
          </ul>
        </div>

        {/* Phần mạng xã hội */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>KẾT NỐI VỚI CHÚNG TÔI</h3>
          <div className={styles.socialIcons}>
            <Link
              href="https://facebook.com/anvatn7"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://instagram.com/anvatn7"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://youtube.com/anvatn7"
              target="_blank"
              aria-label="YouTube"
            >
              <FaYoutube />
            </Link>
            <Link
              href="https://tiktok.com/@anvatn7"
              target="_blank"
              aria-label="TikTok"
            >
              <FaTiktok />
            </Link>
          </div>
        </div>
      </div>

      {/* Phần copyright */}
      <div className={styles.footerBottom}>
        <div className={styles.footerCopyright}>
          <p>© 2024 Ăn vặt N7. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
