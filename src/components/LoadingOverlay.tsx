import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const messages = [
  "Initialisation du protocole Data Warfare...",
  "Scan du concurrent en cours...",
  "Extraction des données stratégiques...",
  "Compilation du rapport tactique...",
  "Analyse SEO approfondie...",
  "Identification des technologies clés...",
  "Évaluation des performances du site...",
  "Décodage des stratégies de contenu...",
  "Cartographie des backlinks...",
  "Analyse de la présence sociale...",
];

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
      }, 3000); // Change message every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-dw-background-deep/90 backdrop-blur-md"
    >
      <div className="relative flex flex-col items-center justify-center p-8 rounded-lg bg-dw-background-glass border border-dw-accent-secondary/30 shadow-2xl shadow-dw-accent-secondary/20">
        {/* Radar effect */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 m-auto w-48 h-48 border-2 border-dw-accent-secondary/50 rounded-full flex items-center justify-center"
        >
          <div className="absolute w-2 h-2 bg-dw-accent-secondary rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute w-full h-1/2 origin-bottom bg-gradient-to-t from-dw-accent-secondary/50 to-transparent rounded-full"></div>
        </motion.div>

        <Loader2 className="h-16 w-16 text-dw-accent-primary animate-spin relative z-10 mb-6" />
        <motion.p
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-subheading text-dw-text-primary text-center relative z-10 max-w-md"
        >
          {messages[currentMessageIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;