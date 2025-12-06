import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background font-grotesk">
      {/* Header */}
      <Header />
      
      {/* Main Content - Sin restricciones de ancho */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};