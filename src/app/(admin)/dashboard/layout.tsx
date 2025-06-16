"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  useEffect(() => {
    const role = localStorage.getItem("role"); // hoặc lấy từ context
    if (role !== "admin") {
      router.push("/403"); // Trang báo lỗi hoặc redirect về trang thường
    }
  }, []);


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard/foods"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Quản lý món ăn
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/categories"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Quản lý danh mục
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/order"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Quản lý đơn hàng
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/revenue"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Thống kê doanh thu
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/accounts"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Quản lý tài khoản
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/comments"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Quản lý bình luận
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}