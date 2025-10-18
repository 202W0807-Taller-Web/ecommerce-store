import AppRoutes from "./modules/home/routes/AppRoutes";
import { AtributosProvider } from "./modules/catalog/contexts";

function App() {
  return (
    <AtributosProvider>
      <AppRoutes />
    </AtributosProvider>
  );
}

export default App;

