import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../page/HomePage";
import AuthLayout from "../layout/AuthLayout";
import CatalogRoutes from "../../catalog/routes/CatalogRoutes";
import CartCheckoutRoutes from "../../cart-checkout/routes/CartCheckoutRoutes"
import PublicRoute from "../../client-auth/components/helpers/PublicRoutes";
import PrivateRoute from "../../client-auth/components/helpers/PrivateRoutes";
import Login from "../../client-auth/pages/Login";
import Register from "../../client-auth/pages/Register";
import Profile from "../../client-auth/pages/Profile";

import MainRoutesLayout from '../layout/MainRoutesLayout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes with AuthLayout (full-screen) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        </Route>

        {/* All other routes use MainLayout */}
        <Route element={<MainRoutesLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/catalog/*" element={<CatalogRoutes />} />
          <Route path="/*" element={<CartCheckoutRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
