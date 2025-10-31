import React from 'react';
import { MadeWithDyad } from './made-with-dyad';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-8 bg-dw-background-deep border-t border-dw-background-glass backdrop-blur-sm mt-12">
      <div className="container mx-auto text-center text-dw-text-secondary">
        <div className="mb-4">
          <Link to="/" className="text-2xl font-heading gradient-text">
            Data Warfare
          </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/" className="hover:text-dw-accent-secondary transition-colors">Fonctionnalités</Link>
          <Link to="/" className="hover:text-dw-accent-secondary transition-colors">Tarifs</Link>
          <Link to="/" className="hover:text-dw-accent-secondary transition-colors">Contact</Link>
          <Link to="/" className="hover:text-dw-accent-secondary transition-colors">CGU</Link>
        </div>
        <p className="text-sm mb-4">&copy; {new Date().getFullYear()} Data Warfare. Tous droits réservés.</p>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;