import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddPage from 'src/pages/AddPage/AddPage';
import axios from 'axios';
import * as SplashScreen from 'expo-splash-screen';

jest.mock('axios');
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('react-native-vector-icons/Entypo', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Trash');
jest.mock('react-native-vector-icons/AntDesign', () => 'IconBack');
jest.mock('react-native-vector-icons/FontAwesome', () => 'IconUser');

describe('AddPage', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    SplashScreen.preventAutoHideAsync.mockResolvedValue();
    SplashScreen.hideAsync.mockResolvedValue();
  });

  it('renders correctly and hides splash screen', async () => {
    const { getByText } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });

    expect(getByText('Ingredients')).toBeTruthy();
    expect(getByText('My Ingredients')).toBeTruthy();
    expect(getByText('Add Ingredients')).toBeTruthy();
  });

  it('fetches and displays ingredients', async () => {
    const mockIngredients = [{ name: 'Sugar' }, { name: 'Salt' }];
    axios.get.mockResolvedValue({ data: mockIngredients });

    const { getByText } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Sugar')).toBeTruthy();
      expect(getByText('Salt')).toBeTruthy();
    });
  });

  it('handles ingredient fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    const { queryByText } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(queryByText('Sugar')).toBeNull();
      expect(queryByText('Salt')).toBeNull();
    });
  });

  it('deletes an ingredient', async () => {
    const mockIngredients = [{ name: 'Sugar' }, { name: 'Salt' }];
    axios.get.mockResolvedValue({ data: mockIngredients });
    axios.delete.mockResolvedValue({ status: 200 });

    const { getByText, queryByText, getAllByRole } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Sugar')).toBeTruthy();
      expect(getByText('Salt')).toBeTruthy();
    });

    const deleteButtons = getAllByRole('button', { name: /trash/i });
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(queryByText('Sugar')).toBeNull();
    });

    expect(axios.delete).toHaveBeenCalledWith('https://example.com/api/delete', { data: { name: 'Sugar' } });
  });

  it('handles ingredient delete error', async () => {
    const mockIngredients = [{ name: 'Sugar' }, { name: 'Salt' }];
    axios.get.mockResolvedValue({ data: mockIngredients });
    axios.delete.mockRejectedValue(new Error('Failed to delete'));

    const { getByText, getAllByRole } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(getByText('Sugar')).toBeTruthy();
      expect(getByText('Salt')).toBeTruthy();
    });

    const deleteButtons = getAllByRole('button', { name: /trash/i });
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(getByText('Sugar')).toBeTruthy();
    });

    expect(axios.delete).toHaveBeenCalledWith('https://example.com/api/delete', { data: { name: 'Sugar' } });
  });

  it('navigates to QRCodeEngin screen', () => {
    const { getByText } = render(<AddPage navigation={mockNavigation} />);

    fireEvent.press(getByText('Add Ingredients'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('QRCodeEngin');
  });

  it('handles SplashScreen error', async () => {
    SplashScreen.preventAutoHideAsync.mockRejectedValue(new Error('Failed to prevent auto hide'));

    const { getByText } = render(<AddPage navigation={mockNavigation} />);

    await waitFor(() => {
      expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });

    expect(getByText('Ingredients')).toBeTruthy();
    expect(getByText('My Ingredients')).toBeTruthy();
    expect(getByText('Add Ingredients')).toBeTruthy();
  });
});
