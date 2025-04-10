import { create } from 'zustand';

interface ModalState {
  showAuthModal: boolean;
  showCreateRecipeModal: boolean;
  showProfileModal: boolean;
  showAiChefModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openCreateRecipeModal: () => void;
  closeCreateRecipeModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openAiChefModal: () => void;
  closeAiChefModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showAuthModal: false,
  showCreateRecipeModal: false,
  showProfileModal: false,
  showAiChefModal: false,
  openAuthModal: () => set({ showAuthModal: true }),
  closeAuthModal: () => set({ showAuthModal: false }),
  openCreateRecipeModal: () => set({ showCreateRecipeModal: true }),
  closeCreateRecipeModal: () => set({ showCreateRecipeModal: false }),
  openProfileModal: () => set({ showProfileModal: true }),
  closeProfileModal: () => set({ showProfileModal: false }),
  openAiChefModal: () => set({ showAiChefModal: true }),
  closeAiChefModal: () => set({ showAiChefModal: false }),
}));
