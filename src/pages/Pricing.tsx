import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const Pricing: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const navigate = useNavigate();
  const { session } = useSession();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleSubscribe = async (planId: string) => {
    console.log(`Attempting to subscribe to plan: ${planId}`); // Log 1
    if (!session) {
      showError("Veuillez vous connecter pour vous abonner.");
      navigate('/login');
      return;
    }

    if (planId === "free") {
      showSuccess("Vous êtes déjà sur le plan gratuit ou vous pouvez simplement utiliser l'application.");
      navigate('/');
      return;
    }

    setLoadingCheckout(true);
    try {
      console.log('Calling Supabase Edge Function: create-moneroo-checkout'); // Log 2
      const { data, error } = await supabase.functions.invoke('create-moneroo-checkout', {
        body: { planId: planId },
      });

      if (error) {
        console.error('Error from Supabase Edge Function invocation:', error); // Log 3
        throw new Error(error.message);
      }

      if (data && data.checkout_url) {
        console.log('Received checkout URL:', data.checkout_url); // Log 4
        window.location.href = data.checkout_url; // Redirect to Moneroo checkout
      } else {
        console.error('Checkout URL not received from Edge Function.'); // Log 5
        throw new Error("URL de paiement non reçue.");
      }
    } catch (error: any) {
      console.error("Caught error during checkout process:", error); // Log 6
      showError(`Erreur lors de la création de la session de paiement: ${error.message}`);
    } finally {
      setLoadingCheckout(false);
      console.log('Checkout process finished.'); // Log 7
    }
  };

  const plans = [
    {
      name: "Free (Essai)",
      price: "0 €",
      analyses: "1",
      features: ["Analyse simple", "Rapport basique"],
      highlight: false,
      buttonText: "Commencer gratuitement",
      id: "free",
    },
    {
      name: "Pro Tactique",
      price: "19 €/mois",
      analyses: "30",
      features: ["Rapports détaillés", "Graphiques enrichis", "Support standard"],
      highlight: true,
      buttonText: "Passer au plan Pro",
      id: "pro",
    },
    {
      name: "Elite Stratégique",
      price: "49 €/mois",
      analyses: "104",
      features: ["Analyses illimitées", "Export PDF", "Veille concurrentielle", "Support prioritaire"],
      highlight: false,
      buttonText: "Passer au plan Elite",
      id: "elite",
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
            <Button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full font-subheading text-lg ${plan.highlight ? 'bg-dw-accent-primary hover:bg-dw-accent-primary/90' : 'bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary'}`}
              disabled={loadingCheckout || plan.id === "free"}
            >
              {loadingCheckout ? 'Chargement...' : plan.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;