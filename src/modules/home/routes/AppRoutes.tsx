import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import { MainLayout } from "../layout/MainLayout";
import CatalogRoutes from "../../catalog/routes/CatalogRoutes";
import CartCheckoutRoutes from "../../cart-checkout/routes/CartCheckoutRoutes"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Rutas del módulo de catálogo */}
          <Route path="/catalog/*" element={<CatalogRoutes />} />        
          <Route path="/*" element={<CartCheckoutRoutes />} />

          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
