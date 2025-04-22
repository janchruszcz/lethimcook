import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeForm } from './RecipeForm';
import { useQuery } from 'react-query';
import { searchIngredients } from '../../api/ingredients';

// Mock dependencies
jest.mock('react-query');
jest.mock('../../api/ingredients');
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: jest.fn(value => value) // Pass through for simplicity
}));
jest.mock('../../hooks/useOnClickOutside', () => ({
  useOnClickOutside: jest.fn()
}));

// Mock the FormInput component for easier testing
jest.mock('../ui/FormInput', () => ({
  FormInput: ({ label, value, onChange, type, placeholder }) => (
    <div data-testid={`form-input-${label.toLowerCase()}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-${label.toLowerCase()}`}
      />
    </div>
  )
}));

describe('RecipeForm', () => {
  // Common test variables
  const mockSubmit = jest.fn().mockResolvedValue(undefined);
  const mockSearchResults = [
    { id: 1, name: 'tomato', category: 'vegetable' },
    { id: 2, name: 'garlic', category: 'vegetable' },
    { id: 3, name: 'chicken', category: 'protein' }
  ];
  
  // Mock the useQuery hook
  const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation for useQuery
    mockedUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
  });
  
  test('renders empty form when no initialData provided', () => {
    render(
      <RecipeForm 
        onSubmit={mockSubmit} 
        isSubmitting={false}
        submitButtonText="Create Recipe" 
      />
    );
    
    // Check that form elements are rendered
    expect(screen.getByTestId('form-input-title')).toBeInTheDocument();
    expect(screen.getByTestId('input-title')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter recipe description')).toHaveValue('');
    expect(screen.getByPlaceholderText('Add an ingredient')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('Create Recipe')).toBeInTheDocument();
  });
  
  test('renders form with initialData', () => {
    const initialData = {
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish',
      prep_time: 15,
      cook_time: 20,
      ingredient_entries: ['pasta', 'eggs', 'cheese'],
      instructions: ['Boil pasta', 'Mix eggs and cheese', 'Combine all ingredients']
    };
    
    render(
      <RecipeForm 
        initialData={initialData}
        onSubmit={mockSubmit} 
        isSubmitting={false}
        submitButtonText="Update Recipe"
      />
    );
    
    // Verify form fields have initial values
    expect(screen.getByTestId('input-title')).toHaveValue('Spaghetti Carbonara');
    expect(screen.getByPlaceholderText('Enter recipe description')).toHaveValue('Classic Italian pasta dish');
    expect(screen.getByTestId('input-prep-time')).toHaveValue('15');
    expect(screen.getByTestId('input-cook-time')).toHaveValue('20');
    
    // Verify ingredients are displayed
    expect(screen.getByText('pasta')).toBeInTheDocument();
    expect(screen.getByText('eggs')).toBeInTheDocument();
    expect(screen.getByText('cheese')).toBeInTheDocument();
    
    // Verify instructions are displayed
    const instructionInputs = screen.getAllByPlaceholderText(/Step \d+/);
    expect(instructionInputs[0]).toHaveValue('Boil pasta');
    expect(instructionInputs[1]).toHaveValue('Mix eggs and cheese');
    expect(instructionInputs[2]).toHaveValue('Combine all ingredients');
    
    // Verify submit button text
    expect(screen.getByText('Update Recipe')).toBeInTheDocument();
  });
  
  test('shows ingredient suggestions when typing in search field', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    mockedUseQuery.mockReturnValue({
      data: mockSearchResults,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
    
    render(<RecipeForm onSubmit={mockSubmit} isSubmitting={false} submitButtonText="Create Recipe" />);
    
    // Type in the ingredient search field
    const searchInput = screen.getByPlaceholderText('Add an ingredient');
    await user.type(searchInput, 'tom');
    
    // Verify suggestions appear
    await waitFor(() => {
      expect(screen.getByText('tomato')).toBeInTheDocument();
      expect(screen.getByText('vegetable')).toBeInTheDocument();
    });
  });
  
  test('adds ingredient when suggestion is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock search results
    mockedUseQuery.mockReturnValue({
      data: mockSearchResults,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isSuccess: true
    } as any);
    
    render(<RecipeForm onSubmit={mockSubmit} isSubmitting={false} submitButtonText="Create Recipe" />);
    
    // Type in the ingredient search field
    const searchInput = screen.getByPlaceholderText('Add an ingredient');
    await user.type(searchInput, 'tom');
    
    // Click on suggestion
    await waitFor(() => {
      const suggestion = screen.getByText('tomato');
      user.click(suggestion);
    });
    
    // Verify ingredient is added and search is cleared
    expect(screen.getByText('tomato')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });
  
  test('adds instruction when "Add Step" button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={mockSubmit} isSubmitting={false} submitButtonText="Create Recipe" />);
    
    // Verify there's one instruction field initially
    let instructionInputs = screen.getAllByPlaceholderText(/Step \d+/);
    expect(instructionInputs).toHaveLength(1);
    
    // Click "Add Step" button
    const addStepButton = screen.getByText('Add Step');
    await user.click(addStepButton);
    
    // Verify a new instruction field is added
    instructionInputs = screen.getAllByPlaceholderText(/Step \d+/);
    expect(instructionInputs).toHaveLength(2);
  });
  
  test('removes instruction when remove button is clicked', async () => {
    const user = userEvent.setup();
    const initialData = {
      instructions: ['First step', 'Second step']
    };
    
    render(
      <RecipeForm 
        initialData={initialData} 
        onSubmit={mockSubmit} 
        isSubmitting={false} 
        submitButtonText="Create Recipe" 
      />
    );
    
    // Verify there are two instruction fields initially
    let instructionInputs = screen.getAllByPlaceholderText(/Step \d+/);
    expect(instructionInputs).toHaveLength(2);
    
    // Click the remove button on the first instruction
    const removeButtons = screen.getAllByRole('button', { name: '' }); // Minus icon has empty name
    // Find the one next to "First step"
    const firstStepRemoveButton = removeButtons.find(button => 
      button.parentElement?.previousSibling?.textContent?.includes('First step')
    );
    await user.click(firstStepRemoveButton!);
    
    // Verify the instruction is removed
    instructionInputs = screen.getAllByPlaceholderText(/Step \d+/);
    expect(instructionInputs).toHaveLength(1);
    expect(instructionInputs[0]).toHaveValue('Second step');
  });
  
  test('submits form with correct data', async () => {
    const user = userEvent.setup();
    
    render(<RecipeForm onSubmit={mockSubmit} isSubmitting={false} submitButtonText="Create Recipe" />);
    
    // Fill out the form
    await user.type(screen.getByTestId('input-title'), 'Test Recipe');
    await user.type(screen.getByPlaceholderText('Enter recipe description'), 'Test Description');
    await user.type(screen.getByTestId('input-prep-time'), '10');
    await user.type(screen.getByTestId('input-cook-time'), '20');
    
    // Add ingredients
    const searchInput = screen.getByPlaceholderText('Add an ingredient');
    await user.type(searchInput, 'tomato{Enter}');
    await user.clear(searchInput);
    await user.type(searchInput, 'cheese{Enter}');
    
    // Add instruction
    await user.type(screen.getByPlaceholderText('Step 1'), 'Mix ingredients');
    
    // Submit the form
    await user.click(screen.getByText('Create Recipe'));
    
    // Verify form was submitted
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    
    // Verify FormData was created correctly
    const formDataArg = mockSubmit.mock.calls[0][0];
    expect(formDataArg).toBeInstanceOf(FormData);
    expect(formDataArg.get('recipe[title]')).toBe('Test Recipe');
    expect(formDataArg.get('recipe[description]')).toBe('Test Description');
    expect(formDataArg.get('recipe[prep_time]')).toBe('10');
    expect(formDataArg.get('recipe[cook_time]')).toBe('20');
    expect(formDataArg.getAll('recipe[ingredient_entries][]')).toEqual(['tomato', 'cheese']);
    expect(formDataArg.getAll('recipe[instructions][]')).toEqual(['Mix ingredients']);
  });
  
  test('handles file upload correctly', async () => {
    const user = userEvent.setup();
    
    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    render(<RecipeForm onSubmit={mockSubmit} isSubmitting={false} submitButtonText="Create Recipe" />);
    
    // Click the "Choose File" button
    await user.click(screen.getByText('Choose File'));
    
    // Mock the file input change event
    const fileInput = screen.getByAccept('image/*');
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    await user.upload(fileInput, file);
    
    // Verify file name is displayed
    expect(screen.getByText('test.png')).toBeInTheDocument();
    
    // Fill other required fields
    await user.type(screen.getByTestId('input-title'), 'Recipe with Image');
    await user.type(screen.getByPlaceholderText('Step 1'), 'Test instruction');
    
    // Submit the form
    await user.click(screen.getByText('Create Recipe'));
    
    // Verify FormData includes the file
    const formDataArg = mockSubmit.mock.calls[0][0];
    expect(formDataArg.get('recipe[main_image]')).toEqual(file);
  });
  
  test('disables submit button when isSubmitting is true', () => {
    render(
      <RecipeForm 
        onSubmit={mockSubmit} 
        isSubmitting={true}
        submitButtonText="Saving..." 
      />
    );
    
    // Verify submit button is disabled
    const submitButton = screen.getByText('Saving...');
    expect(submitButton).toBeDisabled();
  });
});