// __tests__/MyRestaurantsScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyRestaurantsScreen from '../../src/pages/RestaurantScreen/RestaurantScreen';
import { NavigationContainer } from '@react-navigation/native';
import * as restoCalls from '../../src/services/restoCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../../src/services/restoCalls');

jest.mock('react-native-elements', () => {
  const Slider = ({ onValueChange, value, ...props }) => {
    return (
      <input
        {...props}
        type="range"
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
      />
    );
  };
  return {
    Slider,
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

const mockNavigation = {
  navigate: jest.fn(),
};

const restoData = [
  { id: 1, name: 'Restaurant 1', description: 'Description 1', rating: 4.5, ratingCount: 10 },
  { id: 2, name: 'Restaurant 2', description: 'Description 2', rating: 4.0, ratingCount: 20 },
];

describe('MyRestaurantsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches restaurants', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });
  });

  it('handles filter selections correctly', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (restoCalls.getFilteredRestos as jest.Mock).mockResolvedValue(restoData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });

    fireEvent.press(getByText('Apply'));

    await waitFor(() => {
      expect(restoCalls.getFilteredRestos).toHaveBeenCalled();
    });
  });

  it('navigates to the menu page when a restaurant is pressed', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });

    fireEvent.press(getByText('Restaurant 1'));

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MenuPage', { restaurantId: 1, restaurantName: 'Restaurant 1' });
    });
  });

  it('resets filters correctly', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');

    const { getByText, getByDisplayValue } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });

    fireEvent.press(getByText('Reset Filters'));

    await waitFor(() => {
      expect(restoCalls.getAllResto).toHaveBeenCalled();
    });
  });

  it('toggles the filter tab visibility', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByText('Restaurant 2')).toBeTruthy();
    });

    fireEvent.press(getByText('Apply'));

    await waitFor(() => {
      expect(getByText('Rating')).toBeTruthy();
      expect(getByText('Distance')).toBeTruthy();
    });

    fireEvent.press(getByText('Close'));

    await waitFor(() => {
      expect(getByText('Rating')).toBeTruthy();
    });
  });

  it('handles distance change', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (restoCalls.getFilteredRestos as jest.Mock).mockResolvedValue(restoData);

    const { getByText, getByRole } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Apply'));

    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '50' } });

    await waitFor(() => {
      expect(restoCalls.getFilteredRestos).toHaveBeenCalled();
    });
  });

  it('handles rating change', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (restoCalls.getFilteredRestos as jest.Mock).mockResolvedValue(restoData);

    const { getByText, getByRole } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Apply'));

    const star = getByText('1'); // Assuming your stars are buttons or text elements
    fireEvent.press(star);

    await waitFor(() => {
      expect(restoCalls.getFilteredRestos).toHaveBeenCalled();
    });
  });

  it('handles category toggle', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (restoCalls.getFilteredRestos as jest.Mock).mockResolvedValue(restoData);

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Apply'));

    const category = getByText('Burger');
    fireEvent.press(category);

    await waitFor(() => {
      expect(restoCalls.getFilteredRestos).toHaveBeenCalled();
    });
  });

  it('handles allergen toggle', async () => {
    (restoCalls.getAllResto as jest.Mock).mockResolvedValue(restoData);
    (restoCalls.getFilteredRestos as jest.Mock).mockResolvedValue(restoData);

    const { getByText } = render(
      <NavigationContainer>
        <MyRestaurantsScreen />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Apply'));

    const allergen = getByText('gluten');
    fireEvent.press(allergen);

    await waitFor(() => {
      expect(restoCalls.getFilteredRestos).toHaveBeenCalled();
    });
  });
});
