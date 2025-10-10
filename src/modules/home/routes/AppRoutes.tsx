import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import { MainLayout } from "../layout/MainLayout";
import CatalogRoutes from "../../catalog/routes/CatalogRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas del módulo de catálogo */}
          <Route path="/catalog/*" element={<CatalogRoutes />} />        
          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
