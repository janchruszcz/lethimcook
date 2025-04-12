import React from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/search/SearchSection';
import { useRecipeData } from './hooks/useRecipeData';
import { ModalContainer } from './components/modals/ModalContainer';
import { RecipeContainer } from './components/recipe/RecipeContainer';
import { ToastContainer } from './components/toasts/ToastContainer';

export default function App() {
  useRecipeData(); // Handle data fetching and state updates

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark/5 via-white to-teal/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />
        <SearchSection />
        <RecipeContainer />
        <ModalContainer />
        <ToastContainer />
      </div>
    </div>
  );
}