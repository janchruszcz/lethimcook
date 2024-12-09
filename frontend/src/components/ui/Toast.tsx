import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  const Icon = type === 'success' ? CheckCircle : XCircle;
  const baseClasses = "fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300";
  const typeClasses = type === 'success' 
    ? "bg-green-50 text-green-800 border border-green-200"
    : "bg-red-50 text-red-800 border border-red-200";
  const visibilityClasses = isVisible
    ? "translate-y-0 opacity-100"
    : "translate-y-2 opacity-0";

  return createPortal(
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}>
      <Icon className="w-5 h-5" />
      <p className="pr-6">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    document.body
  );
}