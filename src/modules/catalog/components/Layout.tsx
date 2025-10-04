import { type ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export const Layout = ({ 
  children, 
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
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
      <footer className="bg-white border-t border-gray-200 mt-16">
        
      </footer>
    </div>
  );
};
