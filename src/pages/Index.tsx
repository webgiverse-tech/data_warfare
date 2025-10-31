import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';
import ParticlesBackground from '@/components/ParticlesBackground';
import { motion } from 'framer-motion';
import { Search, Code, Gauge, FileText, Link2, Users, Quote } from 'lucide-react'; // Importation des icônes
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Importation des composants Card

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const testimonials = [
    {
      name: "Sophie Dubois",
      title: "Directrice Marketing, TechSolutions",
      quote: "Data Warfare a transformé notre approche concurrentielle. Les rapports sont incroyablement détaillés et nous ont permis d'identifier des opportunités inexploitées. Un outil indispensable !",
      avatar: "https://api.dicebear.com/8.x/initials/svg?seed=SD",
    },
    {
      name: "Marc Lefevre",
      title: "CEO, InnovateWeb",
      quote: "Grâce à Data Warfare, nous avons pu ajuster notre stratégie SEO et dépasser nos concurrents en quelques mois. L'analyse de la stack technologique est un vrai plus.",
      avatar: "https://api.dicebear.com/8.x/initials/svg?seed=ML",
    },
    {
      name: "Émilie Bernard",
      title: "Consultante SEO Indépendante",
      quote: "Je recommande Data Warfare à tous mes clients. La profondeur des analyses et la clarté des rapports sont inégalées. C'est un gain de temps considérable pour mes audits.",
      avatar: "https://api.dicebear.com/8.x/initials/svg?seed=EB",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-dw-background-deep to-black">
      <ParticlesBackground />

      <div className="relative z-10 text-center p-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-heading text-dw-text-primary mb-6 leading-tight"
        >
          DOMINEZ VOTRE MARCHÉ AVEC L'INTELLIGENCE CONCURRENTIELLE
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-dw-text-secondary mb-10 max-w-3xl mx-auto"
        >
          Analysez n'importe quel site concurrent et découvrez ses stratégies cachées pour prendre l'avantage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-lg mx-auto relative group"
        >
          <Input
            type="url"
            placeholder="https://competitor.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow bg-dw-background-glass border border-dw-accent-primary/50 text-dw-text-primary placeholder:text-dw-text-secondary focus:border-dw-accent-secondary focus:ring-dw-accent-secondary transition-all duration-300"
          />
          <Button
            onClick={handleAnalyzeClick}
            className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-8 py-3 text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">🎯 Lancer l'analyse</span>
            <span className="absolute inset-0 bg-gradient-to-r from-dw-accent-primary to-dw-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </motion.div>
      </div>

      <div className="relative z-10 mt-20 w-full max-w-6xl px-4">
        <motion.h2
          id="features" // Added ID for navigation
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-subheading text-center text-dw-accent-secondary mb-12"
        >
          Fonctionnalités Clés
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: "Analyse SEO", description: "Découvrez les mots-clés et la stratégie de contenu." },
            { icon: Code, title: "Tech Stack", description: "Identifiez les technologies utilisées par vos concurrents." },
            { icon: Gauge, title: "Performance", description: "Évaluez la vitesse et l'expérience utilisateur." },
            { icon: FileText, title: "Contenu Stratégique", description: "Analysez les thèmes et la qualité du contenu." },
            { icon: Link2, title: "Backlinks", description: "Comprenez leur profil de liens entrants." },
            { icon: Users, title: "Présence Sociale", description: "Mesurez leur impact sur les réseaux sociaux." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 text-center backdrop-blur-sm hover:shadow-dw-accent-secondary/30 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dw-accent-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <feature.icon className="h-10 w-10 text-dw-accent-primary mx-auto mb-4 relative z-10" />
              <h3 className="text-2xl font-subheading text-dw-accent-primary mb-3 relative z-10">{feature.title}</h3>
              <p className="text-dw-text-secondary relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-20 w-full max-w-6xl px-4">
        <motion.h2
          id="pricing" // Added ID for navigation
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-subheading text-center text-dw-accent-secondary mb-12"
        >
          Nos Plans Tactiques
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Scout", price: "Gratuit", features: ["1 analyse/jour", "Rapport basique"], highlight: false },
            { name: "Tactique", price: "49€/mois", features: ["10 analyses/jour", "Rapport complet", "Export PDF"], highlight: true },
            { name: "Général", price: "199€/mois", features: ["Analyses illimitées", "Rapport avancé", "Support prioritaire"], highlight: false },
          ].map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-dw-background-glass border rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden ${plan.highlight ? 'border-dw-accent-primary shadow-dw-accent-primary/30 shadow-xl' : 'border-dw-accent-secondary/20'}`}
            >
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nouvelle section Témoignages */}
      <div className="relative z-10 mt-20 w-full max-w-6xl px-4 pb-20">
        <motion.h2
          id="testimonials"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-subheading text-center text-dw-accent-secondary mb-12"
        >
          Ce que disent nos clients
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-dw-background-glass border border-dw-accent-primary/20 rounded-lg p-6 text-center backdrop-blur-sm h-full flex flex-col justify-between">
                <CardContent className="p-0">
                  <Quote className="h-8 w-8 text-dw-accent-secondary mx-auto mb-4 opacity-70" />
                  <p className="text-lg italic text-dw-text-secondary mb-6">"{testimonial.quote}"</p>
                </CardContent>
                <CardHeader className="p-0 pt-4 border-t border-dw-background-glass/50">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mx-auto mb-2 border-2 border-dw-accent-primary"
                  />
                  <CardTitle className="text-xl font-subheading text-dw-accent-primary">{testimonial.name}</CardTitle>
                  <p className="text-sm text-dw-text-secondary">{testimonial.title}</p>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;