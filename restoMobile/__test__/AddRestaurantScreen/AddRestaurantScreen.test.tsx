import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddRestaurantScreen from 'src/pages/AddRestaurantScreen/AddRestaurantScreen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { addRestaurant } from 'src/services/restoCalls';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('src/services/restoCalls', () => ({
  addRestaurant: jest.fn(),
}));

describe('AddRestaurantScreen', () => {
  let mockNavigation;

  beforeEach(() => {
    mockNavigation = { navigate: jest.fn() };
    useNavigation.mockReturnValue(mockNavigation);
    AsyncStorage.getItem.mockResolvedValue('mockToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<AddRestaurantScreen />);
    expect(getByPlaceholderText('Restaurant Name *')).toBeTruthy();
    expect(getByPlaceholderText('Phone Number')).toBeTruthy();
    expect(getByPlaceholderText('Street Name *')).toBeTruthy();
    expect(getByPlaceholderText('Street Number *')).toBeTruthy();
    expect(getByPlaceholderText('Postal Code *')).toBeTruthy();
    expect(getByPlaceholderText('City *')).toBeTruthy();
    expect(getByPlaceholderText('Country *')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByPlaceholderText('Website')).toBeTruthy();
    expect(getByText('Add Restaurant')).toBeTruthy();
  });

  it('shows error alert if mandatory fields are missing', async () => {
    const { getByText } = render(<AddRestaurantScreen />);
    fireEvent.press(getByText('Add Restaurant'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'All fields are mandatory.');
    });
  });

  it('adds a restaurant successfully', async () => {
    addRestaurant.mockResolvedValue({ status: 200 });

    const { getByPlaceholderText, getByText } = render(<AddRestaurantScreen />);

    fireEvent.changeText(getByPlaceholderText('Restaurant Name *'), 'Test Restaurant');
    fireEvent.changeText(getByPlaceholderText('Street Name *'), 'Test Street');
    fireEvent.changeText(getByPlaceholderText('Street Number *'), '123');
    fireEvent.changeText(getByPlaceholderText('Postal Code *'), '12345');
    fireEvent.changeText(getByPlaceholderText('City *'), 'Test City');
    fireEvent.changeText(getByPlaceholderText('Country *'), 'Test Country');

    fireEvent.press(getByText('Add Restaurant'));

    await waitFor(() => {
      expect(addRestaurant).toHaveBeenCalledWith({
        userToken: 'mockToken',
        resto: {
          name: 'Test Restaurant',
          phonenumber: '',
          website: '',
          pictures: [''],
          location: {
            streetName: 'Test Street',
            streetNumber: '123',
            postalCode: '12345',
            city: 'Test City',
            country: 'Test Country',
            latitude: "0",
            longitude: "0",
          },
          description: '',
        },
      });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyRestaurantsScreen');
    });
  });

  it('shows error alert if adding restaurant fails', async () => {
    addRestaurant.mockRejectedValue(new Error('Failed to add restaurant'));

    const { getByPlaceholderText, getByText } = render(<AddRestaurantScreen />);

    fireEvent.changeText(getByPlaceholderText('Restaurant Name *'), 'Test Restaurant');
    fireEvent.changeText(getByPlaceholderText('Street Name *'), 'Test Street');
    fireEvent.changeText(getByPlaceholderText('Street Number *'), '123');
    fireEvent.changeText(getByPlaceholderText('Postal Code *'), '12345');
    fireEvent.changeText(getByPlaceholderText('City *'), 'Test City');
    fireEvent.changeText(getByPlaceholderText('Country *'), 'Test Country');

    fireEvent.press(getByText('Add Restaurant'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to add restaurant. Please try again.');
    });
  });

  it('handles image picking successfully', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      cancelled: false,
      uri: 'test-uri',
    });

    const { getByText } = render(<AddRestaurantScreen />);
    fireEvent.press(getByText('Add Restaurant'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('handles image picking cancellation', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({ cancelled: true });

    const { getByText } = render(<AddRestaurantScreen />);
    fireEvent.press(getByText('Add Restaurant'));

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });
});
