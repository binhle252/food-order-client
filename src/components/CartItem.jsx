"use client";
import { useState } from "react";

export default function CartItem({ item, onUpdate, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleUpdate = (newQuantity) => {
    setQuantity(newQuantity);
    onUpdate(item._id, newQuantity);
  };

  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div>
        <h3 className="font-semibold">{item.food.name}</h3>
        <p className="text-sm text-gray-600">{item.food.description}</p>
        <p className="text-sm text-gray-700">Giá: {item.food.price}đ</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdate(Math.max(1, quantity - 1))}
          className="px-2 py-1 bg-gray-300 rounded"
        >-</button>
        <span>{quantity}</span>
        <button
          onClick={() => handleUpdate(quantity + 1)}
          className="px-2 py-1 bg-gray-300 rounded"
        >+</button>
        <button
          onClick={() => onDelete(item._id)}
          className="text-red-500 ml-3"
        >X</button>
      </div>
    </div>
  );
}
