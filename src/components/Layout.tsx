import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dw-background-deep text-dw-text-primary">
      <Header />
      <main className="flex-grow pt-20"> {/* pt-20 to account for fixed header height */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;