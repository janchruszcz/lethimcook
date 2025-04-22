import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeCard } from './RecipeCard';
import { toggleRecipeFavorite } from '../../api/favorites';
import { useToastStore } from '../../stores/toastStore';

// Mock dependencies
jest.mock('../../api/favorites');
jest.mock('../../stores/toastStore');
jest.mock('./RecipeModal', () => ({
  RecipeModal: jest.fn(() => <div data-testid="recipe-modal" />)
}));
jest.mock('./EditRecipeModal', () => ({
  EditRecipeModal: jest.fn(() => <div data-testid="edit-recipe-modal" />)
}));
jest.mock('../FavoriteButton', () => ({
  FavoriteButton: jest.fn(({ isFavorited, onToggle }) => (
    <button 
      data-testid="favorite-button" 
      onClick={onToggle}
    >
      {isFavorited ? 'Favorited' : 'Not Favorited'}
    </button>
  ))
}));
jest.mock('../ui/Card', () => ({
  Card: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div data-testid="card-content" className={className}>{children}</div>
}));
jest.mock('../ui/Badge', () => ({
  Badge: ({ children, className }) => <span data-testid="badge" className={className}>{children}</span>
}));
jest.mock('../ui/Button', () => ({
  Button: ({ children, onClick }) => <button onClick={onClick} data-testid="button">{children}</button>
}));
jest.mock('lucide-react', () => ({
  Clock: () => <span data-testid="clock-icon" />,
  Eye: () => <span data-testid="eye-icon" />,
  Trash: () => <span data-testid="trash-icon" />,
  Edit: () => <span data-testid="edit-icon" />
}));

describe('RecipeCard', () => {
  // Common test variables
  const mockOnDeleteRecipe = jest.fn().mockResolvedValue(undefined);
  const mockShowToast = jest.fn();
  const mockToggleRecipeFavorite = toggleRecipeFavorite as jest.MockedFunction<typeof toggleRecipeFavorite>;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useToastStore as jest.Mock).mockReturnValue({
      showToast: mockShowToast
    });
  });
  
  const mockRecipe = {
    id: 1,
    title: 'Test Recipe',
    main_image: 'test-image.jpg',
    is_favorite: false,
    ingredient_entries: ['chicken', 'tomato', 'garlic', 'onion'],
    total_time: 30
  };
  
  test('renders recipe card with correct information', () => {
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Check basic recipe info is displayed
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByAltText('Test Recipe')).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByText('30m')).toBeInTheDocument();
    
    // Check ingredients are displayed (first 3)
    expect(screen.getByText('chicken')).toBeInTheDocument();
    expect(screen.getByText('tomato')).toBeInTheDocument();
    expect(screen.getByText('garlic')).toBeInTheDocument();
    
    // Check "more" badge is displayed for remaining ingredients
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    
    // Verify action buttons are present
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });
  
  test('renders fallback image when no image is provided', () => {
    const recipeWithoutImage = { ...mockRecipe, main_image: null };
    render(<RecipeCard recipe={recipeWithoutImage} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    expect(screen.getByAltText('Test Recipe')).toHaveAttribute('src', 'https://chilitonka.com/wp-content/uploads/2013/09/curry-ct2867.jpg');
  });
  
  test('shows view modal when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Initially modal should not be shown
    expect(screen.queryByTestId('recipe-modal')).not.toBeInTheDocument();
    
    // Click the view button
    const viewButtons = screen.getAllByTestId('button');
    const viewButton = viewButtons.find(btn => btn.contains(screen.getByTestId('eye-icon')));
    await user.click(viewButton!);
    
    // Modal should now be shown
    expect(screen.getByTestId('recipe-modal')).toBeInTheDocument();
  });
  
  test('shows edit modal when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Initially modal should not be shown
    expect(screen.queryByTestId('edit-recipe-modal')).not.toBeInTheDocument();
    
    // Click the edit button
    const editButtons = screen.getAllByTestId('button');
    const editButton = editButtons.find(btn => btn.contains(screen.getByTestId('edit-icon')));
    await user.click(editButton!);
    
    // Modal should now be shown
    expect(screen.getByTestId('edit-recipe-modal')).toBeInTheDocument();
  });
  
  test('calls onDeleteRecipe when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Click the delete button
    const deleteButtons = screen.getAllByTestId('button');
    const deleteButton = deleteButtons.find(btn => btn.contains(screen.getByTestId('trash-icon')));
    await user.click(deleteButton!);
    
    // Should call onDeleteRecipe with recipe id
    expect(mockOnDeleteRecipe).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteRecipe).toHaveBeenCalledWith(1);
    
    // Should show success toast
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Recipe deleted', 'error');
    });
  });
  
  test('toggles favorite status when favorite button is clicked', async () => {
    const user = userEvent.setup();
    mockToggleRecipeFavorite.mockResolvedValue(undefined);
    
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Initially should not be favorited
    expect(screen.getByTestId('favorite-button')).toHaveTextContent('Not Favorited');
    
    // Click the favorite button
    await user.click(screen.getByTestId('favorite-button'));
    
    // Should call API
    expect(mockToggleRecipeFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleRecipeFavorite).toHaveBeenCalledWith(1, false);
    
    // Should update UI
    await waitFor(() => {
      expect(screen.getByTestId('favorite-button')).toHaveTextContent('Favorited');
    });
    
    // Should show toast
    expect(mockShowToast).toHaveBeenCalledWith('My favorite!', 'success');
  });
  
  test('handles API errors during favorite toggle', async () => {
    const user = userEvent.setup();
    // Make the API call fail
    mockToggleRecipeFavorite.mockRejectedValue(new Error('API error'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Click the favorite button
    await user.click(screen.getByTestId('favorite-button'));
    
    // Should log error
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to toggle favorite:', expect.any(Error));
    });
    
    // Should not change favorite status
    expect(screen.getByTestId('favorite-button')).toHaveTextContent('Not Favorited');
  });
  
  test('handles API errors during delete', async () => {
    const user = userEvent.setup();
    // Make the delete call fail
    mockOnDeleteRecipe.mockRejectedValueOnce(new Error('Delete error'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<RecipeCard recipe={mockRecipe} onDeleteRecipe={mockOnDeleteRecipe} />);
    
    // Click the delete button
    const deleteButtons = screen.getAllByTestId('button');
    const deleteButton = deleteButtons.find(btn => btn.contains(screen.getByTestId('trash-icon')));
    await user.click(deleteButton!);
    
    // Should log error
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to remove recipe:', expect.any(Error));
    });
  });
});
