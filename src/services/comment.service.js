import axios from "axios";

export async function createComment({ foodId, content }) {
  const res = await axios.post("/comments", { foodId, content });
  return res.data;
}

export async function getCommentsByFood(foodId) {
  const res = await axios.get(`/comments/${foodId}`);
  return res.data;
}
