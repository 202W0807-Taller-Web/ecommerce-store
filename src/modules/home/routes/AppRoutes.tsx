import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import MainLayout from "../layout/MainLayout";
import CustomerOrdersPage from "../../orders/pages/customerOrders_page";

// --- 1. Importa la nueva página de detalle ---
import OrderDetailPage from "../../orders/pages/OrderDetailPage"; // Asegúrate que la ruta sea correcta

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mis-pedidos" element={<CustomerOrdersPage />} />
          
          {/* --- 2. Agrega la nueva ruta para el detalle del pedido --- */}
          <Route path="/mis-pedidos/:orderId" element={<OrderDetailPage />} />

          {/* Aquí agregas las rutas de otros módulos */}
          {/* <Route path="/products" element={<ProductsPage />} /> */}
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
