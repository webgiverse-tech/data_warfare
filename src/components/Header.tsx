import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const Header = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Erreur lors de la déconnexion.');
      console.error('Logout error:', error);
    } else {
      showSuccess('Déconnexion réussie.');
      navigate('/');
    }
  };

  return (
    <header className="p-4 bg-dw-background-deep border-b border-dw-background-glass backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Data Warfare Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-6">
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
              <Link to="/pricing" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Tarifs
              </Link>
            </li>
            <li>
              <Link to="/analysis" className="text-dw-text-secondary hover:text-dw-accent-secondary transition-colors font-subheading">
                Analyse
              </Link>
            </li>
          </ul>
          {isLoading ? (
            <Button disabled className="bg-dw-accent-primary/50 text-dw-text-primary font-subheading px-4 py-2">
              Chargement...
            </Button>
          ) : session ? (
            <Button
              onClick={handleLogout}
              className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-4 py-2"
            >
              Déconnexion
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-4 py-2"
            >
              Se connecter
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;