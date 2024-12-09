import React from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';
import { useModal } from '../../contexts/ModalContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const { setModalOpen } = useModal();

  // Handle modal opening
  React.useEffect(() => {
    if (isOpen) {
      // Set z-index to 0 immediately before showing modal
      setModalOpen(true);
    } else {
      // Add a small delay when closing to ensure the modal fade-out animation completes
      const timeout = setTimeout(() => {
        setModalOpen(false);
      }, 300); // Adjust this timing based on your animation duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen, setModalOpen]);

  if (!isOpen) return null;

  // Handle the close action
  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose} 
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <Card className="relative w-full max-w-2xl">
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-primary">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className="relative">{children}</div>
        </Card>
      </div>
    </div>
  );
}