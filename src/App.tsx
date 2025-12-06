import AppRoutes from "./modules/home/routes/AppRoutes";
import { AtributosProvider } from "./modules/catalog/contexts";
import { AuthProvider } from "./modules/client-auth/context/AuthContext";
import { useCartAuth } from "./modules/cart-checkout/hooks/useCartAuth";

function App() {
  return (
    <AuthProvider>
      <CartAuthWrapper>
        <AtributosProvider>
          <AppRoutes />
        </AtributosProvider>
      </CartAuthWrapper>
    </AuthProvider>
  );
}

function CartAuthWrapper({ children }: { children: React.ReactNode }) {
  useCartAuth();
  return <>{children}</>;
}

export default App;
