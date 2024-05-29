import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductForm from 'src/components/ProductForm/ProductForm';
import { getAllRestaurantsByUser } from "src/services/restoCalls";
import { addNewProduct, editProduct } from 'src/services/productCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
  }));
jest.mock('src/services/restoCalls');
jest.mock('src/services/productCalls');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('ProductForm', () => {
  const mockNavigation = { navigate: jest.fn() };
  useNavigation.mockReturnValue(mockNavigation);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial state', () => {
    const { getByPlaceholderText, getByText } = render(<ProductForm />);
    expect(getByPlaceholderText('Product Name')).toBeTruthy();
    expect(getByText('Ingredients')).toBeTruthy();
    expect(getByText('Restaurants')).toBeTruthy();
    expect(getByText('Add Product')).toBeTruthy();
  });

  it('toggles ingredient suggestions modal', () => {
    const { getByText, queryByText } = render(<ProductForm />);
    fireEvent.press(getByText('Ingredients'));
    expect(queryByText('Milk')).toBeTruthy();
    fireEvent.press(getByText('Select Ingredients'));
    expect(queryByText('Milk')).toBeFalsy();
  });

  it('toggles restaurant selection modal', async () => {
    getAllRestaurantsByUser.mockResolvedValue([{ name: 'Restaurant1' }, { name: 'Restaurant2' }]);
    const { getByText, queryByText } = render(<ProductForm />);
    await waitFor(() => fireEvent.press(getByText('Restaurants')));
    expect(queryByText('Restaurant1')).toBeTruthy();
    fireEvent.press(getByText('Select Restaurants'));
    expect(queryByText('Restaurant1')).toBeFalsy();
  });

  it('selects and deselects ingredients', () => {
    const { getByText, queryByText } = render(<ProductForm />);
    fireEvent.press(getByText('Ingredients'));
    fireEvent.press(getByText('Milk'));
    fireEvent.press(getByText('Select Ingredients'));
    expect(queryByText('Milk')).toBeTruthy();
    fireEvent.press(queryByText('Milk'));
    expect(queryByText('Milk')).toBeFalsy();
  });

  it('selects and deselects restaurants', async () => {
    getAllRestaurantsByUser.mockResolvedValue([{ name: 'Restaurant1' }, { name: 'Restaurant2' }]);
    const { getByText, queryByText } = render(<ProductForm />);
    await waitFor(() => fireEvent.press(getByText('Restaurants')));
    fireEvent.press(getByText('Restaurant1'));
    fireEvent.press(getByText('Select Restaurants'));
    expect(queryByText('Restaurant1')).toBeTruthy();
    fireEvent.press(queryByText('Restaurant1'));
    expect(queryByText('Restaurant1')).toBeFalsy();
  });

  it('handles add product', async () => {
    const mockAddNewProduct = addNewProduct.mockResolvedValue({});
    getAllRestaurantsByUser.mockResolvedValue([{ name: 'Restaurant1' }]);
    const { getByText, getByPlaceholderText } = render(<ProductForm />);
    fireEvent.changeText(getByPlaceholderText('Product Name'), 'Test Product');
    fireEvent.press(getByText('Restaurants'));
    fireEvent.press(getByText('Restaurant1'));
    fireEvent.press(getByText('Select Restaurants'));
    fireEvent.press(getByText('Add Product'));
    await waitFor(() => {
      expect(mockAddNewProduct).toHaveBeenCalledWith(
        { name: 'Test Product', allergens: [], ingredients: [] },
        'Restaurant1'
      );
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProductsScreen');
  });

  it('handles edit product', async () => {
    const mockEditProduct = editProduct.mockResolvedValue({});
    getAllRestaurantsByUser.mockResolvedValue([{ name: 'Restaurant1', id: 1 }]);
    const { getByText, getByPlaceholderText } = render(
      <ProductForm
        productName="Edit Product"
        productIngredients={['Ingredient1']}
        productRestaurantNames={['Restaurant1']}
        productId={1}
        editable
      />
    );
    fireEvent.changeText(getByPlaceholderText('Product Name'), 'Updated Product');
    fireEvent.press(getByText('Edit Product'));
    await waitFor(() => {
      expect(mockEditProduct).toHaveBeenCalledWith(
        {
          name: 'Updated Product',
          id: 1,
          allergens: [],
          ingredients: ['Ingredient1'],
          restaurantId: [1],
        },
        'Edit Product'
      );
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MyProductsScreen');
  });

  it('logs error if required fields are missing', () => {
    console.error = jest.fn();
    const { getByText } = render(<ProductForm />);
    fireEvent.press(getByText('Add Product'));
    expect(console.error).toHaveBeenCalledWith('Name and Restaurant are required.');
  });
});
