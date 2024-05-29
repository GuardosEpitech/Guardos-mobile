import 'react-native';
import React from 'react';
import { render } from '@testing-library/react-native';
import EditProductPage, { RootStackParamList } from '../../src/pages/EditProductPage/EditProductPage'; // Adjust import path

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the RouteProp
const mockRoute: RootStackParamList['EditProductPage'] = {
  productID: 123,
  productName: 'Test Product',
  productIngredients: ['Ingredient 1', 'Ingredient 2'],
  productRestoNames: ['Restaurant 1', 'Restaurant 2'],
};
const mockRouteProp = {
  params: mockRoute,
};

describe('<EditProductPage />', () => {
  it('renders correctly', () => {
    const { getByText } = render(<EditProductPage route={mockRouteProp} />);
    
    // Check if title and product form are rendered
    const titleText = getByText('Edit Product');
    const productNameText = getByText('Test Product');
    const ingredientText = getByText('Ingredient 1, Ingredient 2');
    const restaurantText = getByText('Restaurant 1, Restaurant 2');

    expect(titleText).toBeDefined();
    expect(productNameText).toBeDefined();
    expect(ingredientText).toBeDefined();
    expect(restaurantText).toBeDefined();
  });
});
