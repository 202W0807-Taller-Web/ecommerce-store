import AppRoutes from "./modules/home/routes/AppRoutes";
import { AtributosProvider } from "./modules/catalog/contexts";
import { AuthProvider } from "./modules/client-auth/context/AuthContext";
import { useCartAuth } from "./modules/cart-checkout/hooks/useCartAuth";

function App() {
  useCartAuth();
  return (
    <AuthProvider>
      <AtributosProvider>
        <AppRoutes />
      </AtributosProvider>
    </AuthProvider>
  );
}

export default App;
