import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuth, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
