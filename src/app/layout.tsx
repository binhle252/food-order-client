import Link from "next/link";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Food Order App",
  description: "A delicious food ordering experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
 <html lang="en">
      <body>
        <main className="pt-[var(--header-height)]"> {/* Sử dụng CSS variable */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}