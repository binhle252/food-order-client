"use client";
import { useEffect, useState } from "react";
import { createComment, getCommentsByFood } from "@/services/comment.service";

export default function CommentsSection({ foodId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    const data = await getCommentsByFood(foodId);
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createComment({ foodId, content });
    setContent("");
    fetchComments(); // refresh
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg">💬 Bình luận</h3>
      <form onSubmit={handleSubmit} className="my-3 flex gap-2">
        <input
          type="text"
          className="border rounded px-3 py-1 w-full"
          placeholder="Nhập bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Gửi
        </button>
      </form>

      {comments.length === 0 ? (
        <p>Chưa có bình luận nào.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment._id} className="border p-2 rounded">
              <strong>{comment.user?.username || "Ẩn danh"}</strong>: {comment.content}
              <div className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleString("vi-VN")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
