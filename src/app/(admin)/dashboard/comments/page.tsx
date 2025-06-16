    "use client";

    import { useEffect, useState } from "react";
    import { getComments, deleteComment } from "@/services/comment.service";
    import { useRouter } from "next/navigation";

    export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterUser, setFilterUser] = useState("all");


    // Kiểm tra vai trò
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
        alert("Bạn không có quyền truy cập trang này");
        router.push("/login");
        }
    }, [router]);

    // Lấy danh sách bình luận
    const fetchComments = async () => {
        try {
        const data = await getComments();
        setComments(data.data);
        } catch (error) {
        console.error("Lỗi khi lấy danh sách bình luận:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // Xóa bình luận
    const handleDeleteComment = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
        try {
            await deleteComment(id);
            fetchComments(); // Làm mới danh sách
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
        }
        }
    };

    return (
        <div className="p-4 space-y-12">
        <section>
            <div className="flex items-center gap-4 mb-4">
  <div>
    <label className="mr-2 font-medium">Lọc theo người dùng:</label>
    <select
      value={filterUser}
      onChange={(e) => setFilterUser(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      <option value="all">Tất cả</option>
      {Array.from(new Set(comments.map(c => c.user?.username)))
        .filter(Boolean)
        .map((username) => (
          <option key={username} value={username}>{username}</option>
      ))}
    </select>
  </div>

  <div>
    <input
      type="text"
      placeholder="Tìm theo nội dung bình luận..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border px-2 py-1 rounded"
    />
  </div>
</div>

            <h1 className="text-2xl font-bold mb-4">Danh sách bình luận</h1>
            <table className="w-full mt-4 border">
            <thead>
                <tr className="border-b bg-gray-100">
                <th className="text-left p-2">Nội dung</th>
                <th className="text-left p-2">Người dùng</th>
                <th className="text-left p-2">Món ăn</th>
                <th className="text-left p-2">Ngày tạo</th>
                <th className="text-left p-2">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {comments
  .filter(comment => {
    const matchUser = filterUser === "all" || comment.user?.username === filterUser;
    const matchContent = comment.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchUser && matchContent;
  })
  .map((comment) => (
    <tr key={comment._id} className="border-b">
      <td className="p-2">{comment.content}</td>
      <td className="p-2">{comment.user?.username || "N/A"}</td>
      <td className="p-2">{comment.food?.name || "N/A"}</td>
      <td className="p-2">
        {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
      </td>
      <td className="p-2">
        <button
          onClick={() => handleDeleteComment(comment._id)}
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
        </div>
    );
    }