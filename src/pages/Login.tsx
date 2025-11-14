import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dw-background-deep">
        <p className="text-dw-text-secondary">Chargement de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dw-background-deep p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-dw-background-glass border border-dw-accent-secondary/30 rounded-lg p-8 shadow-lg shadow-dw-accent-secondary/10"
      >
        <h1 className="text-3xl font-heading  text-center mb-8 ">
          Accès au Terminal
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Only email/password for now, Google can be added later
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ff6b35', // dw-accent-primary
                  brandAccent: '#00d9ff', // dw-accent-secondary
                  brandButtonText: '#ffffff',
                  defaultButtonBackground: 'rgba(255,255,255,0.08)',
                  defaultButtonBorder: 'rgba(255,255,255,0.1)',
                  defaultButtonText: '#cbd5e1',
                  inputBackground: 'rgba(255,255,255,0.05)',
                  inputBorder: 'rgba(255,255,255,0.15)',
                  inputLabelText: '#cbd5e1',
                  inputText: '#ffffff',
                },
              },
            },
          }}
          theme="dark" // Using dark theme for consistency with Data Warfare design
          redirectTo={window.location.origin + '/'} // Redirect to home after auth
        />
      </motion.div>
    </div>
  );
};

export default Login;