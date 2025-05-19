import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>GrabFood</h3>
          <ul>
            <li>
              <Link href="#">About GrabFood</Link>
            </li>
            <li>
              <Link href="#">About Grab</Link>
            </li>
            <li>
              <Link href="#">Blog</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Be a GrabFood Merchant</h3>
          <ul>
            <li>
              <Link href="#">Drive With Grab</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Help</h3>
          <ul>
            <li>
              <Link href="#">FAQs</Link>
            </li>
          </ul>
        </div>
        <div className={styles.footerSocial}>
          <Link href="#">
            <i className="fab fa-facebook-f"></i>
          </Link>
          <Link href="#">
            <i className="fab fa-instagram"></i>
          </Link>
          <Link href="#">
            <i className="fab fa-twitter"></i>
          </Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerApps}>
          <Link href="#">
            <img src="/app-store-badge.png" alt="App Store" />
          </Link>
          <Link href="#">
            <img src="/google-play-badge.png" alt="Google Play" />
          </Link>
        </div>
        <div className={styles.footerCopyright}>
          <p>
            © 2025 Grab | <Link href="#">Terms of Service</Link> •{" "}
            <Link href="#">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}