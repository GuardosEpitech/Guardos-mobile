// __tests__/MapPage.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapPage from '../../src/pages/MapPage/MapPage';
import { getAllResto, getSelectedFilteredRestos } from '../../src/services/restoCalls';
import { getImages } from '../../src/services/imageCalls';
import { addSavedFilter, deleteSavedFilter, getSavedFilters } from '../../src/services/profileCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/restoCalls');
jest.mock('../../src/services/imageCalls');
jest.mock('../../src/services/profileCalls');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native-elements', () => ({
  CheckBox: jest.fn(),
  Slider: jest.fn(),
  removeItem: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('MapPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(
    <NavigationContainer>
      <MapPage navigation={mockNavigation} />
    </NavigationContainer>
  );

  it('renders correctly', async () => {
    (getAllResto as jest.Mock).mockResolvedValue([]);
    const { getByPlaceholderText, getByText } = renderComponent();

    await waitFor(() => {
      expect(getByPlaceholderText('Enter restaurant name')).toBeTruthy();
      expect(getByPlaceholderText('Enter city name')).toBeTruthy();
      expect(getByText('Search')).toBeTruthy();
    });
  });

  it('displays markers on the map', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Restaurant 1',
        location: {
          latitude: '52.5200',
          longitude: '13.4050',
          city: 'Berlin',
          country: 'Germany',
          streetName: 'Street 1',
          streetNumber: '1',
          postalCode: '10115',
        },
        rating: 4.5,
        picturesId: [],
      },
    ];
    (getAllResto as jest.Mock).mockResolvedValue(mockData);
    const { getByText, getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
      expect(getByTestId('map')).toBeTruthy();
    });
  });

  it('opens modal on marker press', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Restaurant 1',
        location: {
          latitude: '52.5200',
          longitude: '13.4050',
          city: 'Berlin',
          country: 'Germany',
          streetName: 'Street 1',
          streetNumber: '1',
          postalCode: '10115',
        },
        rating: 4.5,
        picturesId: [1],
      },
    ];
    const mockImageData = [{ base64: 'image-data' }];
    (getAllResto as jest.Mock).mockResolvedValue(mockData);
    (getImages as jest.Mock).mockResolvedValue(mockImageData);

    const { getByText, getByTestId } = renderComponent();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Restaurant 1'));

    await waitFor(() => {
      expect(getByTestId('modal')).toBeTruthy();
    });
  });

  it('navigates to MenuPage on Menu button press', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Restaurant 1',
        location: {
          latitude: '52.5200',
          longitude: '13.4050',
          city: 'Berlin',
          country: 'Germany',
          streetName: 'Street 1',
          streetNumber: '1',
          postalCode: '10115',
        },
        rating: 4.5,
        picturesId: [],
      },
    ];
    (getAllResto as jest.Mock).mockResolvedValue(mockData);
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });

    fireEvent.press(getByText('Restaurant 1'));

    await waitFor(() => {
      fireEvent.press(getByText('Menu'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('MenuPage', { restaurantId: 1, restaurantName: 'Restaurant 1' });
  });

  it('applies filters correctly', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Restaurant 1',
        location: {
          latitude: '52.5200',
          longitude: '13.4050',
          city: 'Berlin',
          country: 'Germany',
          streetName: 'Street 1',
          streetNumber: '1',
          postalCode: '10115',
        },
        rating: 4.5,
        picturesId: [],
      },
    ];
    (getSelectedFilteredRestos as jest.Mock).mockResolvedValue(mockData);

    const { getByText, getByPlaceholderText, getByTestId } = renderComponent();

    fireEvent.press(getByText('Filter'));
    await waitFor(() => {
      expect(getByTestId('filter-modal')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Enter restaurant name'), 'Restaurant 1');
    fireEvent.press(getByText('Apply Filter'));

    await waitFor(() => {
      expect(getByText('Restaurant 1')).toBeTruthy();
    });
  });

  it('saves filters correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue('userToken');
    addSavedFilter.mockResolvedValue('savedFilter');

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.press(getByText('Filter'));
    await waitFor(() => {
      expect(getByText('Save')).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText('Enter filter name'), 'Test Filter');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(addSavedFilter).toHaveBeenCalled();
    });
  });

  it('loads filters correctly', async () => {
    const savedFilters = [
      {
        filterName: 'Test Filter',
        range: 100,
        rating: [0, 5],
        categories: ['Burger'],
        allergenList: ['Milk'],
      },
    ];
    AsyncStorage.getItem.mockResolvedValue('userToken');
    getSavedFilters.mockResolvedValue(savedFilters);

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Filter'));
    await waitFor(() => {
      expect(getByText('Test Filter')).toBeTruthy();
    });

    fireEvent.press(getByText('Load'));

    await waitFor(() => {
      expect(getByText('Burger')).toBeTruthy();
    });
  });

  it('deletes filters correctly', async () => {
    const savedFilters = [
      {
        filterName: 'Test Filter',
        range: 100,
        rating: [0, 5],
        categories: ['Burger'],
        allergenList: ['Milk'],
      },
    ];
    AsyncStorage.getItem.mockResolvedValue('userToken');
    getSavedFilters.mockResolvedValue(savedFilters);
    deleteSavedFilter.mockResolvedValue(true);

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Filter'));
    await waitFor(() => {
      expect(getByText('Test Filter')).toBeTruthy();
    });

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(deleteSavedFilter).toHaveBeenCalled();
    });
  });
});
