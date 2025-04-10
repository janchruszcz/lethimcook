import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Header } from './components/Header';
import { SearchSection } from './components/search/SearchSection';
import { useRecipeData } from './hooks/useRecipeData';
import { ModalContainer } from './components/Modals/ModalContainer';
import { RecipeContainer } from './components/recipe/RecipeContainer';

export default function App() {
  useRecipeData(); // Handle data fetching and state updates

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark/5 via-white to-teal/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />
        <SearchSection />
        <RecipeContainer />
        <ModalContainer />
      </div>
    </div>
  );
}