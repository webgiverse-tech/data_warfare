import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { showSuccess } from '@/utils/toast';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        showSuccess('Connexion réussie ! Redirection vers le tableau de bord.');
        navigate('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dw-background-deep p-4">
      <div className="w-full max-w-md bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-8 shadow-lg shadow-dw-accent-secondary/10">
        <h1 className="text-4xl font-heading gradient-text mb-8 text-center">Connexion</h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--dw-accent-primary))',
                  brandAccent: 'hsl(var(--dw-accent-secondary))',
                  inputBackground: 'hsl(var(--dw-background-deep))',
                  inputBorder: 'hsl(var(--dw-accent-secondary) / 0.3)',
                  inputLabel: 'hsl(var(--dw-text-secondary))',
                  inputText: 'hsl(var(--dw-text-primary))',
                  messageText: 'hsl(var(--dw-text-primary))',
                  messageBackground: 'hsl(var(--dw-background-glass))',
                  anchorTextColor: 'hsl(var(--dw-accent-secondary))',
                },
              },
            },
          }}
          theme="dark" // Using dark theme for consistency with dw-background-deep
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse e-mail',
                password_label: 'Mot de passe',
                email_input_placeholder: 'Votre adresse e-mail',
                password_input_placeholder: 'Votre mot de passe',
                button_label: 'Se connecter',
                social_auth_typography: 'Ou continuez avec',
                link_text: 'Vous avez déjà un compte ? Connectez-vous',
              },
              sign_up: {
                email_label: 'Adresse e-mail',
                password_label: 'Mot de passe',
                email_input_placeholder: 'Votre adresse e-mail',
                password_input_placeholder: 'Votre mot de passe',
                button_label: 'S\'inscrire',
                social_auth_typography: 'Ou inscrivez-vous avec',
                link_text: 'Pas encore de compte ? Inscrivez-vous',
              },
              forgotten_password: {
                email_label: 'Adresse e-mail',
                email_input_placeholder: 'Votre adresse e-mail',
                button_label: 'Envoyer les instructions de réinitialisation',
                link_text: 'Mot de passe oublié ?',
              },
              update_password: {
                password_label: 'Nouveau mot de passe',
                password_input_placeholder: 'Votre nouveau mot de passe',
                button_label: 'Mettre à jour le mot de passe',
              },
              magic_link: {
                email_input_placeholder: 'Votre adresse e-mail',
                button_label: 'Envoyer le lien magique',
                link_text: 'Envoyer un lien magique par e-mail',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;