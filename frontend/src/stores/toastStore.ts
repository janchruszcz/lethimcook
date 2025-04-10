import { create } from 'zustand';

interface Toast {
  message: string;
  type: 'success' | 'error';
  id: number;
}

interface ToastState {
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (message, type = 'success') => {
    const id = Date.now();
    set({ toast: { message, type, id } });
    setTimeout(() => set({ toast: null }), 3000);
  },
}));
