import { Routes, Route } from "react-router-dom";
import CatalogPage from "../pages/CatalogPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import { ProductRedirect } from "../pages/ProductRedirect";

export default function CatalogRoutes() {
  return (
    <Routes>
      {/* Ruta del catálogo con paginación, búsqueda y filtros */}
      <Route path="/" element={<CatalogPage />} />
      
      {/* Ruta de detalles del producto específico */}
      <Route path="/product/:id" element={<ProductDetailPage />} />
      
      {/* Redirección de /catalog/product a /catalog */}
      <Route path="/product" element={<ProductRedirect />} />
      
      
    </Routes>
  );
}
