import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import RegisterPage from "../page/RegisterPage";
import UserPanel from "../page/UserPanel";
import PrivacyPolicyPage from "../page/PrivacyPolicyPage";
import Temporal from "../components/user-panel/temporal"; // Asegúrate del path correcto
import ForgotPasswordPage from "../page/ForgotPasswordPage";
import ResetPasswordPage from "../page/ResetPasswordPage";

export default function AuthRoutes() {
  return (
    <Routes>
      {/* Rutas cortas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />
      <Route path="/reset" element={<ResetPasswordPage />} />

      {/* Alias con prefijo /auth para compatibilidad */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset" element={<ResetPasswordPage />} />

      <Route path="/user-panel" element={<UserPanel />} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
      <Route path="/test-login" element={<Temporal />} />
    </Routes>
  );
}
