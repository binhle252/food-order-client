"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Đang xử lý...");

  useEffect(() => {
    const code = params.get("vnp_ResponseCode");
    if (code === "00") {
      setMessage("✅ Thanh toán thành công!");
    } else {
      setMessage("❌ Thanh toán thất bại hoặc bị hủy.");
    }
  }, [params]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
    </div>
  );
}
