import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Download } from 'lucide-react';

interface ReportModalProps {
  isReportModalOpen: boolean;
  setIsReportModalOpen: (isOpen: boolean) => void;
  selectedAnalysisReport: string | null;
  reportModalRef: React.RefObject<HTMLDivElement>;
  handleExportPdf: () => Promise<void>;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isReportModalOpen,
  setIsReportModalOpen,
  selectedAnalysisReport,
  reportModalRef,
  handleExportPdf,
}) => {
  return (
    <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
      <DialogContent className="max-w-4xl bg-dw-background-deep border border-dw-accent-primary/30 text-dw-text-primary p-8 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-heading gradient-text mb-4">Rapport d'Analyse</DialogTitle>
          <DialogDescription className="text-dw-text-secondary">
            Voici le rapport détaillé de votre analyse.
          </DialogDescription>
        </DialogHeader>
        <div ref={reportModalRef} className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
          {selectedAnalysisReport && <MarkdownRenderer markdown={selectedAnalysisReport} />}
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button onClick={handleExportPdf} className="bg-dw-accent-secondary/20 hover:bg-dw-accent-secondary/30 text-dw-accent-secondary font-subheading">
            <Download className="h-4 w-4 mr-2" /> Exporter en PDF
          </Button>
          <Button onClick={() => setIsReportModalOpen(false)} className="bg-dw-accent-primary hover:bg-dw-accent-primary/90 text-dw-text-primary font-subheading">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;