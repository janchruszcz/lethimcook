import React from 'react';
import { useToastStore } from '../../stores/toastStore';
import { Toast } from '../ui/Toast';

export function ToastContainer() {
  const { toast } = useToastStore();

  return (
    <div className="toast-container fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}