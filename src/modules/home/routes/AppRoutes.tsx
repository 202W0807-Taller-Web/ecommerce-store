import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import AuthLayout from "../layout/AuthLayout";
import CatalogRoutes from "../../catalog/routes/CatalogRoutes";
import CartCheckoutRoutes from "../../cart-checkout/routes/CartCheckoutRoutes";;
import CustomerOrdersPage from "../../orders/pages/customerOrders_page";
import OrderDetailPage from "../../orders/pages/OrderDetailPage";
import PublicRoute from "../../client-auth/components/helpers/PublicRoutes";
import PrivateRoute from "../../client-auth/components/helpers/PrivateRoutes";
import Login from "../../client-auth/pages/Login";
import Register from "../../client-auth/pages/Register";
import Profile from "../../client-auth/pages/Profile";
import ForgotPassword from "../../client-auth/pages/ForgotPassword";
import ResetPassword from "../../client-auth/pages/ResetPassword";
import PrivacySettings from "../../client-auth/pages/PrivacySettings";
import PrivacyPolicy from "../../client-auth/pages/PrivacyPolicy";

import MainRoutesLayout from "../layout/MainRoutesLayout";
import { HomeLayout } from "../layout/HomeLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes with AuthLayout (full-screen) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
        </Route>

        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        {/* All other routes use MainLayout */}
        <Route element={<MainRoutesLayout />}>
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/privacy-settings"
            element={
              <PrivateRoute>
                <PrivacySettings />
              </PrivateRoute>
            }
          />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/catalog/*" element={<CatalogRoutes />} />
          <Route path="/*" element={<CartCheckoutRoutes />} />
          <Route path="/mis-pedidos" element={<CustomerOrdersPage />} />
          <Route path="/mis-pedidos/:orderId" element={<OrderDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
