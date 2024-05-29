// __tests__/ProfileScreen/Profile.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../../src/pages/ProfileScreen/Profile/Profile';
import { getVisitorProfileDetails, editVisitorProfileDetails } from '../../src/services/profileCalls';
import { deleteAccount } from '../../src/services/userCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock the modules that use API_URL
jest.mock('../../src/services/profileCalls', () => ({
  getVisitorProfileDetails: jest.fn(),
  editVisitorProfileDetails: jest.fn(),
}));

jest.mock('../../src/services/userCalls', () => ({
  deleteAccount: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockSetLoggedInStatus = jest.fn();

const profileData = {
  email: 'test@example.com',
  username: 'testuser',
  city: 'Test City',
  allergens: ['milk', 'peanuts'],
  profilePicId: 1,
  preferredLanguage: 'english',
};

describe('Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with fetched user data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (getVisitorProfileDetails as jest.Mock).mockResolvedValue(profileData);

    const { getByText, getByPlaceholderText, getByDisplayValue } = render(
      <NavigationContainer>
        <Profile navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByDisplayValue('testuser')).toBeTruthy();
      expect(getByDisplayValue('test@example.com')).toBeTruthy();
      expect(getByDisplayValue('Test City')).toBeTruthy();
    });

    expect(getByText('Account Page')).toBeTruthy();
  });

  it('handles image selection correctly', async () => {
    const { requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } = require('expo-image-picker');

    requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'image-uri' }],
    });

    const { getByText, getByRole } = render(
      <NavigationContainer>
        <Profile navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.press(getByRole('button', { name: /add picture/i }));

    await waitFor(() => {
      expect(launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('handles save profile correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (editVisitorProfileDetails as jest.Mock).mockResolvedValue('newToken');
    (getVisitorProfileDetails as jest.Mock).mockResolvedValue(profileData);

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <Profile navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Enter your name'), 'newName');
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'newEmail@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your city'), 'newCity');
    });

    fireEvent.press(getByText('Apply Change'));

    await waitFor(() => {
      expect(editVisitorProfileDetails).toHaveBeenCalledWith('userToken', {
        username: 'newName',
        email: 'newEmail@example.com',
        city: 'newCity',
        allergens: ['milk', 'peanuts'],
        preferredLanguage: 'english',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', 'newToken');
    });
  });

  it('handles logout correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (getVisitorProfileDetails as jest.Mock).mockResolvedValue(profileData);

    const { getByText } = render(
      <NavigationContainer>
        <Profile navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Logout'));

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(false);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('handles delete account correctly', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (deleteAccount as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(
      <NavigationContainer>
        <Profile navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Delete Account'));

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(false);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });
});
