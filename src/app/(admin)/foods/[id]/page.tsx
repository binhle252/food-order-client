import { getFoodDetail } from "@/services/food.service";
import Image from "next/image";

export default async function FoodDetailPage({ params }: { params: { id: string } }) {
  const food = await getFoodDetail(params.id);
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={food.img}
            alt={food.name}
            width={500}
            height={500}
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
          <p className="text-2xl text-red-500 mb-4">{food.price.toLocaleString()}đ</p>
          <p className="text-gray-600 mb-4">{food.description}</p>
          <p className="text-gray-500 mb-2">📍 {food.address}</p>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}