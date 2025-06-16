import axios from "axios";

export async function createComment({ foodId, content }) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:5000/api/comments",
    { foodId, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getCommentsByFood(foodId) {
  const res = await axios.get(`http://localhost:5000/api/comments/${foodId}`);
  return res.data;
}
