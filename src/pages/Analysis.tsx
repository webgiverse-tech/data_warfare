import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { showSuccess, showError } from '@/utils/toast';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatAnalysisReport } from '@/utils/reportFormatter'; // Import the new formatter

const Analysis = () => {
  const [url, setUrl] = useState<string>('');
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session, user, profile, isLoading, refreshProfile } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [hasInitiatedAnalysisFromParams, setHasInitiatedAnalysisFromParams] = useState(false);

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAnalysis = useCallback(async (targetUrl: string) => {
    setError(null);
    setReport(null);

    if (!session || !user || !profile) {
      setIsAuthModalOpen(true);
      return;
    }

    // Vérification du quota AVANT de lancer l'analyse
    if (profile.analyses_remaining <= 0) {
      setError('Votre quota d\'analyses est atteint. Veuillez mettre à niveau votre plan.');
      showError('Quota atteint.');
      setIsUpgradeModalOpen(true); // Afficher la modale de mise à niveau ici
      setLoading(false); // S'assurer que le chargement est désactivé
      return;
    }

    if (!validateUrl(targetUrl)) {
      setError('URL invalide. Veuillez entrer une URL complète (ex: https://site-concurrent.com).');
      showError('URL invalide.');
      return;
    }

    setLoading(true);
    showSuccess('Lancement de l\'analyse...');

    try {
      // 1. Vérifier si l'analyse existe déjà dans Supabase
      const { data: existingAnalysis, error: fetchError } = await supabase
        .from('analyses')
        .select('result_json')
        .eq('user_id', user.id)
        .eq('target_url', targetUrl)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 signifie "aucune ligne trouvée"
        console.error('Error fetching existing analysis:', fetchError);
        showError('Erreur lors de la vérification de l\'historique.');
        setLoading(false);
        return;
      }

      if (existingAnalysis) {
        setReport(formatAnalysisReport(existingAnalysis.result_json)); // Format existing report
        showSuccess('Rapport récupéré de l\'historique !');
        setLoading(false);
        return;
      }

      // Si aucune analyse existante et quota disponible, procéder à la nouvelle analyse
      const res = await fetch('https://n8n-project-ivc9.onrender.com/webhook/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, target_url: targetUrl })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur serveur lors de l\'analyse.');
      }

      const data = await res.json();
      if (data && data[0] && data[0].output) {
        const formattedOutput = formatAnalysisReport(data[0].output); // Format new report
        setReport(formattedOutput); // Afficher le rapport

        // Enregistrer le nouveau résultat d'analyse dans Supabase
        const { error: insertError } = await supabase
          .from('analyses')
          .insert({ user_id: user.id, target_url: targetUrl, result_json: data[0].output }); // Save raw output

        if (insertError) {
          console.error('Error saving analysis:', insertError);
          showError('Erreur lors de la sauvegarde de l\'analyse.');
        }

        // Décrémenter analyses_remaining et incrémenter analyses_count
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            analyses_remaining: profile.analyses_remaining - 1,
            analyses_count: profile.analyses_count + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile quota:', updateError);
          showError('Erreur lors de la mise à jour du quota.');
        } else {
          await refreshProfile(); // Rafraîchir les données du profil dans le contexte
          // La modale de mise à niveau sera déclenchée lors de la prochaine tentative d'analyse si le quota est épuisé.
        }

      } else {
        throw new Error('Format de réponse inattendu du webhook.');
      }
    } catch (e: any) {
      let errorMessage = 'Une erreur inattendue est survenue.';
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        errorMessage = 'Impossible de se connecter au serveur d\'analyse. Veuillez vérifier votre connexion internet ou contacter le support si le problème persiste. (Problème de réseau ou CORS)';
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [session, user, profile, refreshProfile]); // Dependencies for useCallback

  useEffect(() => {
    const initialUrl = searchParams.get('url');
    if (initialUrl && !isLoading && session && user && profile && !hasInitiatedAnalysisFromParams) {
      setUrl(decodeURIComponent(initialUrl));
      handleAnalysis(decodeURIComponent(initialUrl)); // Appel sans le paramètre isInitialLoad
      setHasInitiatedAnalysisFromParams(true); // Marquer comme initié
    }
  }, [searchParams, session, user, profile, isLoading, handleAnalysis, hasInitiatedAnalysisFromParams]);

  const handleAnalyzeButtonClick = () => {
    if (!session || !user || !profile) {
      setIsAuthModalOpen(true);
      return;
    }
    handleAnalysis(url); // Appel sans le paramètre isInitialLoad
  };

  const isAnalysisDisabled = isLoading || loading || (profile && profile.analyses_remaining <= 0);
  const disabledMessage = !session ? "Connectez-vous pour analyser" : (profile && profile.analyses_remaining <= 0 ? "Quota atteint - Mettez à niveau" : "");

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-160px)] flex flex-col items-center justify-center">
      <LoadingOverlay isLoading={loading} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-heading gradient-text mb-8 text-center"
      >
        Interface d'Analyse Tactique
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl text-dw-text-secondary mb-10 text-center max-w-2xl"
      >
        Saisissez l'URL de votre concurrent pour générer un rapport d'intelligence détaillé.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl bg-dw-background-glass border border-dw-accent-secondary/30 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10 relative z-10"
      >
        <div className="flex space-x-4">
          <Input
            type="url"
            placeholder="https://site-concurrent.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow bg-transparent border-dw-accent-secondary/50 text-dw-text-primary placeholder:text-dw-text-secondary focus:border-dw-accent-primary focus:ring-dw-accent-primary"
            disabled={isAnalysisDisabled}
          />
          <Button
            onClick={handleAnalyzeButtonClick}
            disabled={isAnalysisDisabled}
            className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-6 py-3 relative overflow-hidden group"
          >
            {loading ? (
              <>
                <span className="relative z-10">Analyse en cours...</span>
                <span className="absolute inset-0 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </>
            ) : (
              <>
                <span className="relative z-10">🎯 Lancer l'analyse</span>
                <span className="absolute inset-0 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </>
            )}
          </Button>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center text-dw-error text-sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </motion.div>
        )}
        {isAnalysisDisabled && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center text-dw-text-secondary text-sm"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            {disabledMessage}
          </motion.div>
        )}
        {profile && (
          <p className="text-sm text-dw-text-secondary mt-4 text-right">
            Analyses restantes : {profile.analyses_remaining}
          </p>
        )}
      </motion.div>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="mt-12 w-full max-w-4xl"
        >
          <MarkdownRenderer markdown={report} />
        </motion.div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent className="bg-dw-background-deep border border-dw-accent-primary/30 text-dw-text-primary p-8 rounded-lg max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-heading gradient-text mb-4">
              Votre essai gratuit est terminé ! 💡
            </DialogTitle>
            <DialogDescription className="text-dw-text-secondary mb-6">
              Choisissez votre plan pour continuer à dominer vos concurrents.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => {
                setIsUpgradeModalOpen(false);
                navigate('/pricing');
              }}
              className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-6 py-3"
            >
              Voir les plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analysis;