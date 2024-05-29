import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MyProductsScreen from 'src/pages/MyProductsScreen/MyProductsScreen'; // Adjust the path accordingly
import * as productCalls from 'src/services/productCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useIsFocused: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('src/services/productCalls', () => ({
  getProductsByUser: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('MyProductsScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (productCalls.getProductsByUser as jest.Mock).mockResolvedValue([
      { _id: '1', name: 'Product 1', description: 'Description 1', price: 10 },
      { _id: '2', name: 'Product 2', description: 'Description 2', price: 15 },
    ]);
    (useIsFocused as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches products on mount', async () => {
    const { getByText } = render(<MyProductsScreen navigation={{ navigate: jest.fn() }} />);

    await waitFor(() => {
      expect(getByText('Product 1')).toBeTruthy();
      expect(getByText('Product 2')).toBeTruthy();
    });

    expect(productCalls.getProductsByUser).toHaveBeenCalledWith('userToken');
  });

  it('refreshes the product list when updateProductList is called', async () => {
    const { getByText, rerender } = render(<MyProductsScreen navigation={{ navigate: jest.fn() }} />);

    await waitFor(() => {
      expect(getByText('Product 1')).toBeTruthy();
    });

    (productCalls.getProductsByUser as jest.Mock).mockResolvedValue([
      { _id: '1', name: 'Product 1', description: 'Description 1', price: 10 },
      { _id: '2', name: 'Product 2', description: 'Description 2', price: 15 },
      { _id: '3', name: 'Product 3', description: 'Description 3', price: 20 },
    ]);

    act(() => {
      rerender(<MyProductsScreen navigation={{ navigate: jest.fn() }} />);
    });

    await waitFor(() => {
      expect(getByText('Product 3')).toBeTruthy();
    });
  });

  it('navigates to add product screen when add button is pressed', () => {
    const navigate = jest.fn();
    const { getByText } = render(<MyProductsScreen navigation={{ navigate }} />);

    fireEvent.press(getByText('+'));

    expect(navigate).toHaveBeenCalledWith('AddProductScreen');
  });
});
