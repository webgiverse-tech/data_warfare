import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js'; // Import Session type

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Define the correct type for onAuthStateChange
  const handleAuthChange: React.ComponentProps<typeof Auth>['onAuthStateChange'] = async (event: string, session: Session | null) => {
    if (event === 'SIGNED_IN') {
      onClose();
      navigate('/'); // Redirect to home after successful sign-in
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dw-background-deep border border-dw-accent-secondary/30 text-dw-text-primary p-8 rounded-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-heading gradient-text text-center mb-4">
            Accès au Terminal
          </DialogTitle>
          <DialogDescription className="text-dw-text-secondary text-center mb-6">
            Connectez-vous ou inscrivez-vous pour lancer votre analyse.
          </DialogDescription>
        </DialogHeader>
        <Auth
          supabaseClient={supabase}
          providers={[]}
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
          theme="dark"
          onAuthStateChange={handleAuthChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;