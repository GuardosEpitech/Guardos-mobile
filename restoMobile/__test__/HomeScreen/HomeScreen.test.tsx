import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from 'src/pages/HomeScreen/HomeScreen'; // Adjust the path accordingly
import * as restoCalls from 'src/services/restoCalls';
import { useNavigation } from '@react-navigation/native';

// Mock the necessary modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('src/services/restoCalls', () => ({
  getAllResto: jest.fn(),
  deleteRestaurantByName: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

const mockedRestoData = [
  { id: 1, name: 'Restaurant 1', description: 'Description 1', picturesId: [], rating: 4.5, ratingCount: 10 },
  { id: 2, name: 'Restaurant 2', description: 'Description 2', picturesId: [], rating: 4.0, ratingCount: 5 },
];

describe('HomeScreen', () => {
  let navigation: any;

  beforeEach(() => {
    navigation = {
      navigate: jest.fn(),
    };

    (useNavigation as jest.Mock).mockReturnValue(navigation);

    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(mockedRestoData);
    (restoCalls.deleteRestaurantByName as jest.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Guardos')).toBeTruthy();
      expect(getByText('Add Restaurant')).toBeTruthy();
      expect(queryByText('Restaurant 1')).toBeTruthy();
      expect(queryByText('Restaurant 2')).toBeTruthy();
    });
  });

  it('navigates to AddRestaurant screen', async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => getByText('Add Restaurant'));

    fireEvent.press(getByText('Add Restaurant'));

    expect(navigation.navigate).toHaveBeenCalledWith('AddRestaurant');
  });

  it('navigates to MenuPage screen with correct parameters', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    await waitFor(() => getByText('Restaurant 1'));

    fireEvent.press(getByTestId('restaurant-1'));

    expect(navigation.navigate).toHaveBeenCalledWith('MenuPage', { restaurantId: 1, restaurantName: 'Restaurant 1' });
  });

  it('deletes a restaurant and updates the list', async () => {
    const { getByText, queryByText } = render(<HomeScreen />);

    await waitFor(() => getByText('Restaurant 1'));

    fireEvent.press(getByText('Delete Restaurant 1'));

    await waitFor(() => {
      expect(restoCalls.deleteRestaurantByName).toHaveBeenCalledWith('Restaurant 1');
      expect(restoCalls.getAllResto).toHaveBeenCalledTimes(2); // Called initially and after deletion
      expect(queryByText('Restaurant 1')).toBeFalsy();
    });
  });

  it('refreshes the list on pull down', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    await waitFor(() => getByText('Restaurant 1'));

    fireEvent.scroll(getByTestId('flatlist'), { refresh: true });

    await waitFor(() => {
      expect(restoCalls.getAllResto).toHaveBeenCalledTimes(2); // Initial call and refresh call
    });
  });

  it('handles errors during data fetching', async () => {
    (restoCalls.getAllResto as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Error updating restaurant data: Failed to fetch')).toBeTruthy();
    });
  });

  it('handles errors during restaurant deletion', async () => {
    (restoCalls.deleteRestaurantByName as jest.Mock).mockRejectedValueOnce(new Error('Failed to delete'));

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => getByText('Restaurant 1'));

    fireEvent.press(getByText('Delete Restaurant 1'));

    await waitFor(() => {
      expect(getByText('Error deleting restaurant: Failed to delete')).toBeTruthy();
    });
  });
});
