import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import MainLayout from "../layout/MainLayout";
import CustomerOrdersPage from "../../orders/pages/customerOrders_page";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mis-pedidos" element={<CustomerOrdersPage />} />
          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
