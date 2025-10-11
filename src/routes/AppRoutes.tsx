import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../modules/home/page/HomePage";
import MainLayout from "../layouts/MainLayout";
import AuthRoutes from "../modules/client-auth/routes/AuthRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<AuthRoutes />} />
          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
