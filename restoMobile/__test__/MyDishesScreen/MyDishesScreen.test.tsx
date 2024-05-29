import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MyDishesScreen from 'src/pages/MyDishesScreen/MyDishesScreen'; // Adjust the path accordingly
import * as dishCalls from 'src/services/dishCalls';
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

jest.mock('src/services/dishCalls', () => ({
  getDishesByUser: jest.fn(),
  deleteDishByName: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('MyDishesScreen', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (dishCalls.getDishesByUser as jest.Mock).mockResolvedValue([
      { name: 'Dish 1', resto: 'Restaurant 1', description: 'Delicious dish', price: 10, picturesId: [], category: { menuGroup: 'Main' }, allergens: [] },
      { name: 'Dish 2', resto: 'Restaurant 2', description: 'Another delicious dish', price: 15, picturesId: [], category: { menuGroup: 'Main' }, allergens: [] },
    ]);
    (dishCalls.deleteDishByName as jest.Mock).mockResolvedValue({});
    (useIsFocused as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches dishes on mount', async () => {
    const { getByText } = render(<MyDishesScreen />);

    await waitFor(() => {
      expect(getByText('Dish 1')).toBeTruthy();
      expect(getByText('Dish 2')).toBeTruthy();
    });

    expect(dishCalls.getDishesByUser).toHaveBeenCalledWith('userToken');
  });

  it('refreshes the dishes list on pull to refresh', async () => {
    const { getByText, getByTestId } = render(<MyDishesScreen />);

    await waitFor(() => {
      expect(getByText('Dish 1')).toBeTruthy();
    });

    const refreshControl = getByTestId('flatlist-refreshcontrol');
    act(() => {
      fireEvent(refreshControl, 'refresh');
    });

    await waitFor(() => {
      expect(dishCalls.getDishesByUser).toHaveBeenCalledTimes(2);
    });
  });

  it('deletes a dish and refreshes the list', async () => {
    const { getByText, getAllByText } = render(<MyDishesScreen />);

    await waitFor(() => {
      expect(getByText('Dish 1')).toBeTruthy();
    });

    const deleteButtons = getAllByText('Delete'); // Assuming the delete button contains the text 'Delete'
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(dishCalls.deleteDishByName).toHaveBeenCalledWith('Restaurant 1', 'Dish 1');
      expect(dishCalls.getDishesByUser).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates to the edit dish screen when a dish is pressed', async () => {
    const { getByText } = render(<MyDishesScreen />);
    const { navigate } = useNavigation();

    await waitFor(() => {
      expect(getByText('Dish 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Dish 1'));

    expect(navigate).toHaveBeenCalledWith('EditDish', {
      restaurantName: 'Restaurant 1',
      dish: { name: 'Dish 1', resto: 'Restaurant 1', description: 'Delicious dish', price: 10, picturesId: [], category: { menuGroup: 'Main' }, allergens: [] },
    });
  });

  it('navigates to add dish screen when add button is pressed', () => {
    const { getByText } = render(<MyDishesScreen />);
    const { navigate } = useNavigation();

    fireEvent.press(getByText('+'));

    expect(navigate).toHaveBeenCalledWith('EditDish', { restaurantName: '', dish: null });
  });
});
