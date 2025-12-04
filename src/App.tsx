import AppRoutes from "./modules/home/routes/AppRoutes";
import { AtributosProvider } from "./modules/catalog/contexts";
import { AuthProvider } from "./modules/client-auth/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AtributosProvider>
        <AppRoutes />
      </AtributosProvider>
    </AuthProvider>
  );
}

export default App;

