import { Routes, Route } from "react-router-dom";
import CatalogPage from "../pages/CatalogPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import { ProductRedirect } from "../pages/ProductRedirect";

export default function CatalogRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      
      <Route path="/product/:id" element={<ProductDetailPage />} />
      
      <Route path="/product" element={<ProductRedirect />} />
      
    </Routes>
  );
}
