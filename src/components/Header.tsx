import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Import Button component

const Header = () => {
  return (
    <header className="p-4 bg-dw-background-deep border-b border-dw-background-glass backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Data Warfare Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-6"> {/* Added flex and space-x for alignment */}
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/#features" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Fonctionnalités
              </Link>
            </li>
            <li>
              <Link to="/#pricing" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Tarifs
              </Link>
            </li>
            <li>
              <Link to="/analysis" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Analyse
              </Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
          <Button className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-4 py-2">
            Se connecter
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;