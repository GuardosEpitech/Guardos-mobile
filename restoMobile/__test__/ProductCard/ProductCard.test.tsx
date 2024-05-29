import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductCard from 'src/components/ProductCard/ProductCard';
import { deleteProduct } from 'src/services/productCalls';
import { getAllResto } from 'src/services/restoCalls';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('src/services/productCalls');
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));
jest.mock('src/services/restoCalls', () => ({
  getAllResto: jest.fn(),
}));

const mockNavigation = { navigate: jest.fn() };
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
  };
});

const mockProduct = {
  id: 1,
  name: 'Test Product',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  restaurantId: [1, 2],
};

const mockRestaurants = [
  { id: 1, name: 'Restaurant 1' },
  { id: 2, name: 'Restaurant 2' },
];

describe('ProductCard', () => {
  beforeEach(() => {
    getAllResto.mockResolvedValue(mockRestaurants);
    deleteProduct.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product details correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProductCard product={mockProduct} onDelete={jest.fn()} />
      </NavigationContainer>
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('Ingredients: Ingredient 1, Ingredient 2')).toBeTruthy();
  });

  it('navigates to EditProductPage on edit button press', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProductCard product={mockProduct} onDelete={jest.fn()} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('edit-button'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProductPage', {
        productID: 1,
        productName: 'Test Product',
        productIngredients: ['Ingredient 1', 'Ingredient 2'],
        productRestoNames: ['Restaurant 1', 'Restaurant 2'],
      });
    });
  });

  it('shows modal on delete button press and deletes product on confirmation', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <ProductCard product={mockProduct} onDelete={jest.fn()} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() => {
      expect(getByText('Are you sure you want to delete this product?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('handles deletion error gracefully', async () => {
    deleteProduct.mockRejectedValue(new Error('Failed to delete'));

    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <ProductCard product={mockProduct} onDelete={jest.fn()} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() => {
      expect(getByText('Are you sure you want to delete this product?')).toBeTruthy();
    });

    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(getByText('Failed to delete')).toBeTruthy();
    });
  });

  it('displays error message if no restaurants are available', async () => {
    getAllResto.mockResolvedValue([]);

    const { getByText } = render(
      <NavigationContainer>
        <ProductCard product={mockProduct} onDelete={jest.fn()} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Error fetching restaurants')).toBeTruthy();
    });
  });
});
