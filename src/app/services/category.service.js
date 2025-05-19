import axios from "axios";

export async function getCategory() {
    const result = await axios.get("http://localhost:5000/api/categories");
    return result.data;
}