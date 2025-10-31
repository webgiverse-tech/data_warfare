import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { showSuccess, showError } from '@/utils/toast';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Analysis = () => {
  const [url, setUrl] = useState<string>('');
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const initialUrl = searchParams.get('url');
    if (initialUrl) {
      setUrl(decodeURIComponent(initialUrl));
      analyzeCompetitor(decodeURIComponent(initialUrl));
    }
  }, [searchParams]);

  const validateUrl = (inputUrl: string) => {
    try {
      new URL(inputUrl);
      return true;
    } catch (e) {
      return false;
    }
  };

  const analyzeCompetitor = async (targetUrl: string) => {
    setError(null);
    setReport(null);

    if (!validateUrl(targetUrl)) {
      setError('URL invalide. Veuillez entrer une URL complète (ex: https://site-concurrent.com).');
      showError('URL invalide.');
      return;
    }

    setLoading(true);
    showSuccess('Lancement de l\'analyse...');

    try {
      const res = await fetch('https://n8n-project-ivc9.onrender.com/webhook/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur serveur lors de l\'analyse.');
      }

      const data = await res.json();
      if (data && data[0] && data[0].output) {
        setReport(data[0].output);
        showSuccess('Rapport d\'analyse généré avec succès !');
      } else {
        throw new Error('Format de réponse inattendu du webhook.');
      }
    } catch (e: any) {
      setError(e.message || 'Une erreur inattendue est survenue.');
      showError(e.message || 'Échec de l\'analyse.');
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
          />
          <Button
            onClick={() => analyzeCompetitor(url)}
            disabled={loading}
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
    </div>
  );
};

export default Analysis;