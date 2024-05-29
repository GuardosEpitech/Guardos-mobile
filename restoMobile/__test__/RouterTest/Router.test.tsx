import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyTabs from '../../Router'; // Adjust the path accordingly
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkIfTokenIsValid } from 'src/services/userCalls'; // Adjust the path accordingly

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
  }));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: '',
  }));

jest.mock('moti', () => ({
    MotiView: '',
  }));

jest.mock('expo-barcode-scanner', () => ({
  MotiBarCodeScanner: '',
}));

jest.mock('src/services/userCalls', () => ({
  checkIfTokenIsValid: jest.fn(),
}));

describe('MyTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login and register tabs when not logged in', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('Login')).toBeTruthy());
    expect(getByText('Register')).toBeTruthy();
  });

  it('renders the main tabs when logged in', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('valid-token');
    (checkIfTokenIsValid as jest.Mock).mockResolvedValue('OK');

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('My Restaurants')).toBeTruthy());
    expect(getByText('My Dishes')).toBeTruthy();
    expect(getByText('My Products')).toBeTruthy();
    expect(getByText('My Profile')).toBeTruthy();
    expect(getByText('Scanning')).toBeTruthy();
  });

  it('logs out the user if the token is invalid', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-token');
    (checkIfTokenIsValid as jest.Mock).mockResolvedValue('INVALID');

    render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken'));
  });

  it('navigates to the respective screens when tabs are clicked', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('valid-token');
    (checkIfTokenIsValid as jest.Mock).mockResolvedValue('OK');

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => expect(getByText('My Restaurants')).toBeTruthy());

    fireEvent.press(getByText('My Restaurants'));
    fireEvent.press(getByText('My Dishes'));
    fireEvent.press(getByText('My Products'));
    fireEvent.press(getByText('My Profile'));
    fireEvent.press(getByText('Scanning'));
  });
});
