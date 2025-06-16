"use client";

import { useEffect, useState } from "react";
import { getCart, deleteItem, updateItem } from "@/services/cart.service";
import jwt from "jsonwebtoken";
import Image from "next/image";
import styles from "../../../styles/CartPage.module.css";

interface CartItem {
  _id: string;
  quantity: number;
  food: {
    _id: string;
    name: string;
    price: number;
    img: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("On delivery");
  const baseUrl = "http://localhost:5000";

  const getAccountIdFromToken = () => {
    // Đảm bảo mã này chỉ chạy trên client-side (trong trình duyệt)
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token || typeof token !== "string") return null;
    try {
      const decoded: any = jwt.decode(token);
      return decoded?.id || decoded?.account_id;
    } catch (err) {
      console.error("Lỗi giải mã token:", err);
      return null;
    }
  };

  const encodeImageUrl = (img: string) => {
    if (img?.startsWith("http")) return img;
    if (!img) return "/default-image.jpg"; // Hoặc một ảnh placeholder khác
    const encodedPath = img.replace(/ /g, "%20").replace(/^\/Uploads\//, "/uploads/");
    return `${baseUrl}${encodedPath}`;
  };

  const fetchCart = async () => {
    const accId = getAccountIdFromToken();
    if (!accId) {
      setMessage("Vui lòng đăng nhập để xem giỏ hàng.");
      return;
    }
    setAccountId(accId);
    try {
      const cart = await getCart(accId);
      // Lọc các item có food là null (có thể do món ăn đã bị xóa khỏi DB)
      const validItems = (cart.items || []).filter((item: any) => item.food !== null);
      setCartItems(validItems);
      setCartId(cart._id);
      setMessage(""); // Xóa thông báo lỗi cũ nếu fetch thành công
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
      setMessage("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
      setCartItems([]); // Đảm bảo giỏ hàng trống nếu có lỗi
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleDelete = async (itemId: string) => {
    if (!accountId) {
        setMessage("Vui lòng đăng nhập để xóa món.");
        return;
    }
    try {
      await deleteItem(accountId, itemId);
      fetchCart();
      setMessage("Món ăn đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      console.error("Lỗi khi xóa món:", error);
      setMessage("Lỗi khi xóa món. Vui lòng thử lại.");
    }
  };

  const handleUpdate = async (itemId: string, quantity: number) => {
    if (!accountId) {
        setMessage("Vui lòng đăng nhập để cập nhật số lượng.");
        return;
    }
    if (quantity < 1) { // Không cho phép số lượng nhỏ hơn 1
        setMessage("Số lượng không thể nhỏ hơn 1.");
        return;
    }
    try {
      await updateItem(accountId, itemId, quantity);
      fetchCart();
      setMessage(""); // Xóa thông báo nếu cập nhật thành công
    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
      setMessage("Lỗi khi cập nhật số lượng. Vui lòng thử lại.");
    }
  };

  const handleCheckout = async () => {
    if (!accountId) {
        setMessage("Vui lòng đăng nhập để thanh toán.");
        return;
    }
    if (!cartItems.length) {
        setMessage("Giỏ hàng trống. Vui lòng thêm món ăn vào giỏ.");
        return;
    }
    if (!cartId) {
        setMessage("Không tìm thấy giỏ hàng. Vui lòng thử tải lại trang.");
        return;
    }
    if (!customer.trim() || !phone.trim() || !address.trim()) {
      setMessage("Vui lòng điền đầy đủ thông tin giao hàng: Tên, Số điện thoại và Địa chỉ.");
      return;
    }

    // Basic phone number validation (optional)
    const phoneRegex = /^[0-9]{10,11}$/; // Ví dụ: 10 hoặc 11 chữ số
    if (!phoneRegex.test(phone.trim())) {
      setMessage("Số điện thoại không hợp lệ. Vui lòng nhập 10 hoặc 11 chữ số.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          phone,
          address,
          payment_method: paymentMethod,
          total_money: totalPrice,
          cart_id: cartId,
          // Có thể thêm account_id vào đây nếu backend cần, tùy thuộc vào API của bạn
          account_id: accountId, 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
        setCartItems([]);
        setCustomer("");
        setPhone("");
        setAddress("");
        setPaymentMethod("On delivery");
      } else {
        setMessage(data.message || "Lỗi khi đặt hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      setMessage("Đã xảy ra lỗi khi đặt hàng. Vui lòng kiểm tra kết nối mạng.");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>🛒 Giỏ hàng của bạn</h1>
      {message && <p className={styles.message}>{message}</p>} {}

      {!cartItems.length ? (
        <p className={styles.emptyCart}>Giỏ hàng trống.</p>
      ) : (
        <> {}
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li
                key={item._id}
                className={styles.cartItem}
              >
                <div className={styles.itemInfo}>
                  <Image
                    src={encodeImageUrl(item.food.img)}
                    alt={item.food.name}
                    width={80} // Đã thay đổi width/height để phù hợp với CSS
                    height={80}
                    className={styles.itemImage}
                  />
                  <div>
                    <h2 className={styles.itemName}>{item.food.name}</h2>
                    <p className={styles.itemPrice}>
                      {item.food.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleUpdate(item._id, item.quantity - 1)}
                    className={styles.quantityButton}
                    disabled={item.quantity <= 1} // Vô hiệu hóa nút nếu số lượng là 1
                  >
                    -
                  </button>
                  <span className={styles.itemQuantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item._id, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          {/* Phần thông tin giao hàng */}
          <div className={styles.checkoutFormSection}>
            <h3>Thông tin giao hàng</h3>
            <input
              type="text"
              placeholder="Tên khách hàng"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className={styles.formInput}
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.formInput}
              required
            />
            <input
              type="text"
              placeholder="Địa chỉ giao hàng"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.formInput}
              required
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.formSelect}
            >
              <option value="On delivery">Thanh toán khi nhận hàng</option>
              <option value="Online">Thanh toán online (Chưa hỗ trợ)</option>
            </select>
          </div>

          <div className={styles.totalPriceSection}>
            Tổng tiền: {totalPrice.toLocaleString()}đ
          </div>
          <button
            onClick={handleCheckout}
            className={styles.checkoutButton}
          >
            Thanh toán
          </button>
        </>
      )}
    </div>
  );
}