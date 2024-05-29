import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyRestaurantsScreen from 'src/pages/MyRestaurantsScreen/MyRestaurantsScreen'; // Adjust the path accordingly
import * as restoCalls from 'src/services/restoCalls';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { IRestaurantFrontEnd } from 'src/models/restaurantsInterfaces';

jest.mock('src/services/restoCalls', () => ({
  getAllRestaurantsByUser: jest.fn(),
  deleteRestaurantByName: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('moti', () => ({
  MotiView: '',
}));
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('MyRestaurantsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    return render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );
  };

  const mockRestaurants: IRestaurantFrontEnd[] = [
    { id: 1, name: 'Restaurant 1', picturesId: [] },
    { id: 2, name: 'Restaurant 2', picturesId: [] },
  ];

  it('fetches and displays restaurants on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (restoCalls.getAllRestaurantsByUser as jest.Mock).mockResolvedValue(mockRestaurants);

    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });
  });

  it('refreshes restaurant data on pull down', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (restoCalls.getAllRestaurantsByUser as jest.Mock).mockResolvedValue(mockRestaurants);

    const { getByText, getByTestId } = setup();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });

    fireEvent(getByTestId('flatlist'), 'refresh');

    await waitFor(() => {
      expect(restoCalls.getAllRestaurantsByUser).toHaveBeenCalledTimes(2);
    });
  });

  it('navigates to AddRestaurantScreen when add button is pressed', async () => {
    const { getByText } = setup();

    fireEvent.press(getByText('+'));

    expect(mockNavigate).toHaveBeenCalledWith('AddRestaurantScreen');
  });

  it('navigates to MenuPage when a restaurant card is pressed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (restoCalls.getAllRestaurantsByUser as jest.Mock).mockResolvedValue(mockRestaurants);

    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Restaurant 1'));

    expect(mockNavigate).toHaveBeenCalledWith('MenuPage', { restaurantId: 1, restaurantName: 'Restaurant 1' });
  });

  it('deletes a restaurant and updates the list', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (restoCalls.getAllRestaurantsByUser as jest.Mock).mockResolvedValue(mockRestaurants);
    (restoCalls.deleteRestaurantByName as jest.Mock).mockResolvedValue(null);

    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(restoCalls.deleteRestaurantByName).toHaveBeenCalledWith('Restaurant 1');
      expect(restoCalls.getAllRestaurantsByUser).toHaveBeenCalledTimes(2);
    });
  });

  it('handles errors during fetching and deleting', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (restoCalls.getAllRestaurantsByUser as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    (restoCalls.deleteRestaurantByName as jest.Mock).mockRejectedValue(new Error('Failed to delete'));

    const { getByText } = setup();

    await waitFor(() => {
      expect(getByText('Error updating restaurant data:')).toBeTruthy();
    });

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(getByText('Error deleting restaurant:')).toBeTruthy();
    });
  });
});
