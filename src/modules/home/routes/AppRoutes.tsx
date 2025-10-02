import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import MainLayout from "../layout/MainLayout";
import CartCheckoutRoutes from "../../cart-checkout/routes/CartCheckoutRoutes"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<CartCheckoutRoutes />} />
          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
