import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { useQuery } from 'react-query';
import { searchIngredients } from '../../api/ingredients';

// Mock dependencies
jest.mock('react-query');
jest.mock('../../api/ingredients');
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: jest.fn(value => value) // Pass through for simplicity in tests
}));

// Mock the useOnClickOutside hook
jest.mock('../../hooks/useOnClickOutside', () => ({
  useOnClickOutside: jest.fn()
}));

describe('SearchBar', () => {
  // Setup common test variables
  const mockOnIngredientsChange = jest.fn();
  const mockSearchResults = [
    { id: 1, name: 'tomato', category: 'vegetable' },
    { id: 2, name: 'garlic', category: 'vegetable' },
    { id: 3, name: 'chicken', category: 'protein' }
  ];
  
  // Mock the useQuery hook
  const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
  const mockedSearchIngredients = searchIngredients as jest.MockedFunction<typeof searchIngredients>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    mockedUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
  });
  
  test('renders with initial empty state', () => {
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Should have an input field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    expect(inputElement).toBeInTheDocument();
    
    // No ingredients should be displayed
    const ingredientsTags = screen.queryByRole('button', { name: /x/i });
    expect(ingredientsTags).not.toBeInTheDocument();
  });
  
  test('displays selected ingredients as tags', () => {
    const selectedIngredients = ['tomato', 'garlic'];
    render(
      <SearchBar 
        onIngredientsChange={mockOnIngredientsChange} 
        selectedIngredients={selectedIngredients} 
      />
    );
    
    // Should display each ingredient
    expect(screen.getByText('tomato')).toBeInTheDocument();
    expect(screen.getByText('garlic')).toBeInTheDocument();
  });
  
  test('calls onIngredientsChange when removing an ingredient', async () => {
    const user = userEvent.setup();
    const selectedIngredients = ['tomato', 'garlic'];
    
    render(
      <SearchBar 
        onIngredientsChange={mockOnIngredientsChange} 
        selectedIngredients={selectedIngredients} 
      />
    );
    
    // Find the X button next to the first ingredient and click it
    const removeButtons = screen.getAllByRole('button', { name: '' }); // X icon has empty name
    await user.click(removeButtons[0]); // Remove first ingredient
    
    // Should call onIngredientsChange with updated array
    expect(mockOnIngredientsChange).toHaveBeenCalledWith(['garlic']);
  });
  
  test('shows suggestions when typing in search field', async () => {
    const user = userEvent.setup();
    
    // Mock the search results
    mockedUseQuery.mockReturnValue({
      data: mockSearchResults,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'tom');
    
    // Should show suggestions
    await waitFor(() => {
      expect(screen.getByText('tomato')).toBeInTheDocument();
      expect(screen.getByText('vegetable')).toBeInTheDocument();
    });
  });
  
  test('adds an ingredient when suggestion is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock the search results
    mockedUseQuery.mockReturnValue({
      data: mockSearchResults,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'tom');
    
    // Click on the suggestion
    await waitFor(() => {
      const suggestion = screen.getByText('tomato');
      user.click(suggestion);
    });
    
    // Should call onIngredientsChange with the new ingredient
    expect(mockOnIngredientsChange).toHaveBeenCalledWith(['tomato']);
    
    // Search field should be cleared
    expect(inputElement).toHaveValue('');
  });
  
  test('adds custom ingredient when pressing Enter', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field and press Enter
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'custom ingredient{Enter}');
    
    // Should call onIngredientsChange with the new ingredient
    expect(mockOnIngredientsChange).toHaveBeenCalledWith(['custom ingredient']);
    
    // Search field should be cleared
    expect(inputElement).toHaveValue('');
  });
  
  test('shows loading state when fetching suggestions', async () => {
    const user = userEvent.setup();
    
    // Mock loading state
    mockedUseQuery.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: false
    } as any);
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'loading');
    
    // Should show loading message
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
  
  test('shows no ingredients found message when search returns empty', async () => {
    const user = userEvent.setup();
    
    // Mock empty search results
    mockedUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'nonexistent');
    
    // Should show no ingredients found message
    await waitFor(() => {
      expect(screen.getByText('No ingredients found')).toBeInTheDocument();
    });
  });
  
  test('adds ingredient when clicking the Plus button', async () => {
    const user = userEvent.setup();
    
    render(<SearchBar onIngredientsChange={mockOnIngredientsChange} selectedIngredients={[]} />);
    
    // Type in the search field
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'new ingredient');
    
    // Click the Plus button
    const plusButton = screen.getByRole('button', { name: '' }); // Plus icon has empty name
    await user.click(plusButton);
    
    // Should call onIngredientsChange with the new ingredient
    expect(mockOnIngredientsChange).toHaveBeenCalledWith(['new ingredient']);
    
    // Search field should be cleared
    expect(inputElement).toHaveValue('');
  });
  
  test('does not add duplicate ingredients', async () => {
    const user = userEvent.setup();
    const selectedIngredients = ['tomato'];
    
    render(
      <SearchBar 
        onIngredientsChange={mockOnIngredientsChange} 
        selectedIngredients={selectedIngredients} 
      />
    );
    
    // Try to add the same ingredient again
    const inputElement = screen.getByPlaceholderText('Add an ingredient');
    await user.type(inputElement, 'tomato{Enter}');
    
    // Should not call onIngredientsChange since it's a duplicate
    expect(mockOnIngredientsChange).not.toHaveBeenCalled();
  });
});
