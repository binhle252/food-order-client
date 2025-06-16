// app/layout.tsx

import Link from "next/link";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchProvider } from "@/components/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Food Order App",
  description: "A delicious food ordering experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {}
          <SearchProvider>
            <Header />
            <main className="pt-[var(--header-height)]">{children}</main>
            <Footer />
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
