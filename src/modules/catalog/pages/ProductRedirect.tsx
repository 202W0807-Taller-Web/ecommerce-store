import { Navigate } from 'react-router-dom';

export const ProductRedirect = () => {
  return <Navigate to="/catalog" replace />;
};
