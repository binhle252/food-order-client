"use client";
import { useEffect, useState } from "react";
import styles from "../styles/CommentsSection.module.css";
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
    console.log("Gửi bình luận cho món:", foodId, content);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    // Sử dụng class CSS từ module cho container chính
    <div className={styles.commentSectionContainer}>
      {/* Sử dụng class CSS cho tiêu đề */}
      <h2>💬 Bình luận</h2>

      {/* Form gửi bình luận */}
      {/* Thay thế các class Tailwind mặc định bằng class từ module */}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <textarea // Đổi từ input type="text" sang textarea để nhập được nhiều dòng hơn
          className={styles.commentForm + " " + styles.commentForm + " " + styles.textarea} // Sử dụng class của textarea trong module
          placeholder="Viết bình luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required // Đảm bảo người dùng phải nhập nội dung
        />
        {/* Sử dụng class CSS cho nút gửi, và thay đổi màu thành xanh lá cây */}
        <button type="submit" className={styles.commentForm + " " + styles.button}>
          Gửi Bình Luận
        </button>
      </form>

      {comments.length === 0 ? (
        <p>Chưa có bình luận nào.</p>
      ) : (
        // Sử dụng class CSS cho danh sách bình luận
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            // Sử dụng class CSS cho từng bình luận
            <div key={comment._id} className={styles.commentItem}>
              <p className={styles.commentAuthor}>
                {comment.user?.username || "Ẩn danh"}
                <span className={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleString("vi-VN")}
                </span>
              </p>
              <p className={styles.commentText}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
