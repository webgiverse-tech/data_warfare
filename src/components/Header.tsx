import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Erreur lors de la déconnexion.');
      console.error('Logout error:', error);
    } else {
      showSuccess('Déconnexion réussie.');
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/", label: "Accueil" },
    { to: "/#features", label: "Fonctionnalités" },
    { to: "/pricing", label: "Tarifs" },
    { to: "/analysis", label: "Analyse" },
    ...(session ? [{ to: "/dashboard", label: "Dashboard" }] : [])
  ];

  return (
    <>
      <header className="p-4 bg-dw-background-deep/80 border-b border-dw-background-glass backdrop-blur-xl fixed w-full z-50 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="container mx-auto flex justify-between items-center relative">
          {/* Logo avec effet 3D */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group relative z-10"
          >
            <div className="relative transform transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-dw-accent-primary/20 blur-xl rounded-full group-hover:bg-dw-accent-primary/40 transition-all duration-300"></div>
              <img 
                src="/logo.png" 
                alt="Data Warfare Logo" 
                className="h-8 md:h-10 relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-8 items-center">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="relative text-dw-text-secondary hover:text-dw-accent-secondary transition-all duration-300 font-subheading group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Effet de soulignement 3D */}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary group-hover:w-full transition-all duration-300 shadow-[0_0_10px_currentColor]"></span>
                    {/* Glow effect */}
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-dw-accent-primary/20 to-dw-accent-secondary/20 -z-10"></span>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Bouton de connexion/déconnexion avec effet 3D */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              {isLoading ? (
                <Button 
                  disabled 
                  className="relative bg-dw-accent-primary/50 text-dw-text-primary font-subheading px-6 py-2.5 rounded-lg transform transition-all duration-300"
                >
                  Chargement...
                </Button>
              ) : session ? (
                <Button
                  onClick={handleLogout}
                  className="relative bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-dw-text-primary font-subheading px-6 py-2.5 rounded-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                >
                  Déconnexion
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="relative bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-dw-text-primary font-subheading px-6 py-2.5 rounded-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                >
                  Se connecter
                </Button>
              )}
            </div>
          </nav>

          {/* Bouton Menu Mobile avec effet 3D */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-10 p-2 text-dw-text-secondary hover:text-dw-accent-primary transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-dw-accent-primary/20 blur-lg rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 relative z-10" />
            ) : (
              <Menu className="h-6 w-6 relative z-10" />
            )}
          </button>
        </div>
      </header>

      {/* Menu Mobile avec animation 3D */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop avec blur */}
        <div
          className="absolute inset-0 bg-dw-background-deep/95 backdrop-blur-2xl"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Menu Content */}
        <nav
          className={`absolute top-20 left-0 right-0 bg-gradient-to-b from-dw-background-deep/95 to-dw-background-deep/80 backdrop-blur-xl border-b border-dw-background-glass shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transform transition-all duration-500 ${
            mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-4 px-6 text-dw-text-secondary hover:text-dw-accent-primary font-subheading transition-all duration-300 rounded-lg hover:bg-dw-background-glass/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transform hover:translate-x-2 hover:scale-105 ${
                  mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <div className="relative">
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-dw-accent-primary/0 to-dw-accent-secondary/20 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg -z-10"></div>
                </div>
              </Link>
            ))}

            {/* Bouton Mobile avec effet 3D */}
            <div 
              className={`pt-4 transform transition-all duration-500 ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${navItems.length * 50}ms` }}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                {isLoading ? (
                  <Button
                    disabled
                    className="relative w-full bg-dw-accent-primary/50 text-dw-text-primary font-subheading py-4 rounded-lg"
                  >
                    Chargement...
                  </Button>
                ) : session ? (
                  <Button
                    onClick={handleLogout}
                    className="relative w-full bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-dw-text-primary font-subheading py-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Déconnexion
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="relative w-full bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] text-dw-text-primary font-subheading py-4 rounded-lg transform transition-all duration-300 hover:scale-105"
                  >
                    Se connecter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;