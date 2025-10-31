import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Pricing: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const plans = [
    {
      name: "Free (Essai)",
      price: "0 €",
      analyses: "1",
      features: ["Analyse simple", "Rapport basique"],
      highlight: false,
      buttonText: "Commencer gratuitement",
    },
    {
      name: "Pro Tactique",
      price: "19 €/mois",
      analyses: "30",
      features: ["Rapports détaillés", "Graphiques enrichis", "Support standard"],
      highlight: true,
      buttonText: "Passer au plan Pro",
    },
    {
      name: "Elite Stratégique",
      price: "49 €/mois",
      analyses: "104",
      features: ["Analyses illimitées", "Export PDF", "Veille concurrentielle", "Support prioritaire"],
      highlight: false,
      buttonText: "Passer au plan Elite",
    },
  ];

  return (
    <div className="container mx-auto p-8 min-h-[calc(100vh-160px)] flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-heading gradient-text mb-8 text-center"
      >
        Choisissez Votre Plan Tactique
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl text-dw-text-secondary mb-12 text-center max-w-2xl"
      >
        Débloquez la puissance de l'intelligence concurrentielle avec le plan qui correspond à vos ambitions.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-dw-background-glass border rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden flex flex-col justify-between ${plan.highlight ? 'border-dw-accent-primary shadow-dw-accent-primary/30 shadow-xl' : 'border-dw-accent-secondary/20'}`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-dw-accent-primary text-dw-text-primary text-xs font-bold px-3 py-1 rounded-bl-lg">Populaire</div>
            )}
            <div>
              <h3 className="text-3xl font-subheading text-dw-accent-secondary mb-4">{plan.name}</h3>
              <p className="text-5xl font-mono text-dw-accent-primary mb-2">{plan.price}</p>
              <p className="text-dw-text-secondary mb-6">{plan.analyses} analyses/mois</p>
              <ul className="list-none space-y-3 mb-8 text-dw-text-secondary text-left px-4">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-dw-success mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className={`w-full font-subheading text-lg ${plan.highlight ? 'bg-dw-accent-primary hover:bg-dw-accent-primary/90' : 'bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary'}`}>
              {plan.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;