import { type ReactNode } from 'react';
import { Header } from '../../home/components/Header';
import { Footer } from '../../home/components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ 
  children, 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-grotesk">
      {/* Header */}
       <Header />
      
      {/* Main Content */}
      <main className="flex-1">
               
        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
