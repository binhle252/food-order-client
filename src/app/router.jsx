import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/main-layout";
import { Main } from "next/document";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <h1>Home</h1>
      </MainLayout>
    )
  },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <h1>Cart</h1>
      </MainLayout>
    )
  },
  {
    path: "/order",
    element: (
      <MainLayout>
        <h1>Order</h1>
      </MainLayout>
    )
  },
  {
    path: "/profile",
    element: (
      <MainLayout>
        <h1>Profile</h1>
      </MainLayout>
    )
  }
]);

export default router;