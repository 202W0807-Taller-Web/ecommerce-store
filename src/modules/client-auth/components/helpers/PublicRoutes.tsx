import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuth, loading } = useAuth();

  if (loading) return <div>Cargando sesión...</div>;

  return !isAuth ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
