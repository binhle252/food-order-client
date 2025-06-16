"use client";

import { useEffect, useState } from "react";
import { getOrder } from "@/services/order.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Order {
  total_money: number;
  createdAt: string;
}

type ViewMode = "daily" | "weekly" | "monthly";

export default function AdminRevenueStatsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState<
    { label: string; revenue: number }[]
  >([]);
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrder({});
        setOrders(data);

        const total = data.reduce((sum, o) => sum + o.total_money, 0);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const now = new Date();
    const revenueMap: Record<string, number> = {};

    // Tạo key mốc thời gian mặc định
    let labels: string[] = [];

    if (viewMode === "daily") {
      // 7 ngày gần nhất
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString("vi-VN")); // dd/mm/yyyy
      }
    } else if (viewMode === "weekly") {
      // 8 tuần gần nhất
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 7);
        const week = getWeekNumber(d);
        labels.push(`Tuần ${week} - ${d.getFullYear()}`);
      }
    } else if (viewMode === "monthly") {
      // 6 tháng gần nhất
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        labels.push(`${d.getMonth() + 1}/${d.getFullYear()}`); // mm/yyyy
      }
    }

    // Đếm doanh thu thực tế
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      let key = "";

      if (viewMode === "daily") {
        key = date.toLocaleDateString("vi-VN");
      } else if (viewMode === "weekly") {
        const week = getWeekNumber(date);
        key = `Tuần ${week} - ${date.getFullYear()}`;
      } else if (viewMode === "monthly") {
        key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      }

      revenueMap[key] = (revenueMap[key] || 0) + order.total_money;
    });

    // Gộp với các label mặc định
    const revenueArr = labels.map((label) => ({
      label,
      revenue: revenueMap[label] || 0,
    }));

    setRevenueData(revenueArr);
  }, [orders, viewMode]);

  function getWeekNumber(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">📊 Thống kê doanh thu</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-green-100 p-4 rounded text-center shadow">
          <p className="text-gray-600">Tổng đơn hàng</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded text-center shadow">
          <p className="text-gray-600">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-green-600">
            {totalRevenue.toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Xem theo:</label>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
          className="border px-3 py-1 rounded"
        >
          <option value="daily">Ngày</option>
          <option value="weekly">Tuần</option>
          <option value="monthly">Tháng</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(v: any) => `${v.toLocaleString()}đ`} />
          <Bar
            dataKey="revenue"
            fill="url(#colorRevenue)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
