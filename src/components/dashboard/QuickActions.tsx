import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Trash2, RefreshCcw } from 'lucide-react';
import { showError } from '@/utils/toast';

interface QuickActionsProps {
  handleNewAnalysis: () => void;
  handleRefreshData: () => Promise<void>;
  loadingAnalyses: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  handleNewAnalysis,
  handleRefreshData,
  loadingAnalyses,
}) => {
  return (
    <div className="mb-12 bg-dw-background-glass border border-dw-accent-secondary/20 rounded-lg p-6 shadow-lg shadow-dw-accent-secondary/10 flex flex-wrap justify-center gap-4">
      <Button
        onClick={handleNewAnalysis}
        className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading px-6 py-3 flex items-center"
      >
        <PlusCircle className="h-5 w-5 mr-2" /> Nouvelle Analyse
      </Button>
      <Button
        onClick={() => showError('Fonctionnalité d\'export de toutes les analyses en PDF en cours de développement !')}
        className="bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary font-subheading px-6 py-3 flex items-center"
      >
        <Download className="h-5 w-5 mr-2" /> Exporter tout en PDF
      </Button>
      <Button
        onClick={() => showError('Fonctionnalité de suppression de toutes les analyses en cours de développement !')}
        className="bg-dw-error/20 hover:bg-dw-error/30 text-dw-error font-subheading px-6 py-3 flex items-center"
      >
        <Trash2 className="h-5 w-5 mr-2" /> Tout supprimer
      </Button>
      <Button
        onClick={handleRefreshData}
        className="bg-dw-background-glass hover:bg-dw-background-glass/50 text-dw-text-secondary font-subheading px-6 py-3 flex items-center"
      >
        <RefreshCcw className={`h-5 w-5 mr-2 ${loadingAnalyses ? 'animate-spin' : ''}`} /> Actualiser les données
      </Button>
    </div>
  );
};

export default QuickActions;