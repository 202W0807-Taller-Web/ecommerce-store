import { Routes, Route } from "react-router-dom";
import CatalogPage from "../pages/CatalogPage";
import ProductDetailPage from "../pages/ProductDetailPage";

export default function CatalogRoutes() {
  return (
    <Routes>
      {/* Ruta del catálogo con paginación, búsqueda y filtros */}
      <Route path="/" element={<CatalogPage />} />
      
      {/* Ruta de detalles del producto */}
      <Route path="/product/:id" element={<ProductDetailPage />} />
      
    </Routes>
  );
}
