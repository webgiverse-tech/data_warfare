import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

const Index = () => {
  const [url, setUrl] = useState<string>('');
  const navigate = useNavigate();

  const handleAnalyzeClick = () => {
    if (!url || !url.startsWith('http')) {
      showError('Veuillez entrer une URL valide pour l\'analyse.');
      return;
    }
    navigate(`/analysis?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-dw-background-deep to-black">
      {/* Background particles placeholder - will be replaced by tsparticles */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dw-accent-secondary/10 via-transparent to-transparent animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[size:20px_20px] bg-[radial-gradient(circle,_#00d9ff_1px,_rgba(0,0,0,0)_1px)] opacity-10"></div>
      </div>

      <div className="relative z-10 text-center p-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-heading gradient-text mb-6 leading-tight">
          DOMINEZ VOTRE MARCHÉ AVEC L'INTELLIGENCE CONCURRENTIELLE
        </h1>
        <p className="text-xl md:text-2xl text-dw-text-secondary mb-10 max-w-3xl mx-auto">
          Analysez n'importe quel site concurrent et découvrez ses stratégies cachées pour prendre l'avantage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-lg mx-auto">
          <Input
            type="url"
            placeholder="https://competitor.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow bg-dw-background-glass border border-dw-accent-primary/50 text-dw-text-primary placeholder:text-dw-text-secondary focus:border-dw-accent-secondary focus:ring-dw-accent-secondary"
          />
          <Button
            onClick={handleAnalyzeClick}
            className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-8 py-3 text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">🎯 Lancer l'analyse</span>
            <span className="absolute inset-0 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="relative z-10 mt-20 w-full max-w-6xl px-4">
        <h2 className="text-4xl font-subheading text-center text-dw-accent-secondary mb-12">Fonctionnalités Clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Analyse SEO", description: "Découvrez les mots-clés et la stratégie de contenu." },
            { title: "Tech Stack", description: "Identifiez les technologies utilisées par vos concurrents." },
            { title: "Performance", description: "Évaluez la vitesse et l'expérience utilisateur." },
            { title: "Contenu Stratégique", description: "Analysez les thèmes et la qualité du contenu." },
            { title: "Backlinks", description: "Comprenez leur profil de liens entrants." },
            { title: "Présence Sociale", description: "Mesurez leur impact sur les réseaux sociaux." },
          ].map((feature, index) => (
            <div key={index} className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm hover:shadow-dw-accent-secondary/30 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-dw-accent-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-2xl font-subheading text-dw-accent-primary mb-3 relative z-10">{feature.title}</h3>
              <p className="text-dw-text-secondary relative z-10">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-20 w-full max-w-6xl px-4">
        <h2 className="text-4xl font-subheading text-center text-dw-accent-secondary mb-12">Nos Plans Tactiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Scout", price: "Gratuit", features: ["1 analyse/jour", "Rapport basique"], highlight: false },
            { name: "Tactique", price: "49€/mois", features: ["10 analyses/jour", "Rapport complet", "Export PDF"], highlight: true },
            { name: "Général", price: "199€/mois", features: ["Analyses illimitées", "Rapport avancé", "Support prioritaire"], highlight: false },
          ].map((plan, index) => (
            <div key={index} className={`bg-dw-background-glass border rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden ${plan.highlight ? 'border-dw-accent-primary shadow-dw-accent-primary/30 shadow-xl' : 'border-dw-accent-secondary/20'}`}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-dw-accent-primary text-dw-text-primary text-xs font-bold px-3 py-1 rounded-bl-lg">Populaire</div>
              )}
              <h3 className="text-3xl font-subheading text-dw-accent-secondary mb-4">{plan.name}</h3>
              <p className="text-5xl font-mono text-dw-accent-primary mb-6">{plan.price}</p>
              <ul className="list-none space-y-2 mb-8 text-dw-text-secondary">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
              <Button className={`w-full font-subheading text-lg ${plan.highlight ? 'bg-dw-accent-primary hover:bg-dw-accent-primary/90' : 'bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary'}`}>
                Choisir le plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;