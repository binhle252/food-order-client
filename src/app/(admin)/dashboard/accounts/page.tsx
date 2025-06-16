"use client";

import { useEffect, useState } from "react";
import {
  getAccounts,
  getAccountDetail,
  deleteAccount,
} from "@/services/account.service";

export default function AdminAccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
      try {
        await deleteAccount(id);
        fetchAccounts();
        setSelectedAccount(null);
      } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
      }
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const detail = await getAccountDetail(id);
      setSelectedAccount(detail);
    } catch (error) {
      console.error("Lỗi khi xem chi tiết:", error);
    }
  };

  return (
    <div className="p-4 space-y-10">
      <div className="mb-4">
        <label className="mr-2 font-medium">Lọc theo vai trò:</label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          placeholder="Tìm theo username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <section>
        <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-2">Tên đăng nhập</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts
              .filter(
                (acc) =>
                  (filterRole === "all" || acc.role === filterRole) &&
                  acc.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((acc) => (
                <tr key={acc._id} className="border-b">
                  <td className="p-2">{acc.username}</td>
                  <td className="p-2">{acc.role}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleViewDetail(acc._id)}
                      className="text-blue-500"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleDelete(acc._id)}
                      className="text-red-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {selectedAccount && (
        <section className="border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Chi tiết tài khoản</h2>
          <p>
            <strong>Username:</strong> {selectedAccount.username}
          </p>
          <p>
            <strong>Role:</strong> {selectedAccount.role}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {selectedAccount.address}
          </p>
          <p>
            <strong>SĐT:</strong> {selectedAccount.phone}
          </p>
        </section>
      )}
    </div>
  );
}
