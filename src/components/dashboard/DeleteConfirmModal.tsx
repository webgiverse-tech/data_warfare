import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dw-background-deep border border-dw-error/30 text-dw-text-primary p-8 rounded-lg max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-heading text-dw-error mb-4">Confirmer la suppression</DialogTitle>
          <DialogDescription className="text-dw-text-secondary mb-6">
            Êtes-vous sûr de vouloir supprimer cette analyse ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center space-x-4">
          <Button
            onClick={onClose}
            className="bg-dw-background-glass hover:bg-dw-background-glass/50 text-dw-text-secondary font-subheading px-6 py-3"
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-dw-error hover:bg-dw-error/90 text-dw-text-primary font-subheading px-6 py-3"
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;