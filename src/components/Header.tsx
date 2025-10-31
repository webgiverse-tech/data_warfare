import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="p-4 bg-dw-background-deep border-b border-dw-background-glass backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Data Warfare Logo" className="h-8" /> {/* Adjust height as needed */}
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/analysis" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Analyse
              </Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;