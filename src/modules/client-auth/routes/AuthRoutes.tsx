import { Routes, Route } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import RegisterPage from "../page/RegisterPage";
import UserPanel from "../page/UserPanel";
import PrivacyPolicyPage from "../page/PrivacyPolicyPage";
import Temporal from "../components/user-panel/temporal"; // Asegúrate del path correcto

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-panel" element={<UserPanel />} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />

      <Route path="/test-login" element={<Temporal />} />

    </Routes>
  );
}
