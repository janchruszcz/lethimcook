import React from 'react';
import { Card } from './Card';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl'
};

export function Modal({ children, onClose, size = 'md' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <Card className={`relative w-full ${sizes[size]} overflow-hidden`}>
          {children}
        </Card>
      </div>
    </div>
  );
}