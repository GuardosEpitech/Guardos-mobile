// __tests__/MyTabs.test.tsx
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MyTabs from '../../Router'; // Adjust the path accordingly
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the pages and components
jest.mock('../../src/pages/RestaurantScreen/RestaurantScreen', () => 'RestaurantScreen');
jest.mock('../../src/pages/AboutUs/AboutUs', () => 'AboutUsScreen');
jest.mock('../../src/pages/ContactUs/ContactUs', () => 'ContactUsScreen');
jest.mock('../../src/pages/MapPage/MapPage', () => 'MapPage');
jest.mock('../../src/pages/ProfileScreen/Register/Register', () => 'Register');
jest.mock('../../src/pages/ProfileScreen/Login/Login', () => 'LoginScreen');
jest.mock('../../src/pages/MenuPage/MenuPage', () => 'MenuPage');
jest.mock('../../src/pages/ResetPasswordScreen/ResetPasswordScreen', () => 'ResetPassword');
jest.mock('../../src/pages/ProfileScreen/ChangePassword/ChangePassword', () => 'ChangePasswordScreen');
jest.mock('../../src/pages/ProfileScreen/Profile/Profile', () => 'Profile');

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(),
}));
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: jest.fn(),
}));


const mockSetLoggedInStatus = jest.fn();

describe('MyTabs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login and register tabs when logged out', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
    });
  });

  it('renders all tabs when logged in', async () => {
    AsyncStorage.getItem.mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('RestaurantScreen')).toBeTruthy();
      expect(getByText('MapScreen')).toBeTruthy();
      expect(getByText('AboutUs')).toBeTruthy();
      expect(getByText('ContactUs')).toBeTruthy();
      expect(getByText('My Profile')).toBeTruthy();
    });
  });

  it('navigates to RestaurantScreen', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('RestaurantScreen'));

    await waitFor(() => {
      expect(getByText('RestaurantScreen')).toBeTruthy();
    });
  });

  it('navigates to MapScreen', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('MapScreen'));

    await waitFor(() => {
      expect(getByText('MapScreen')).toBeTruthy();
    });
  });

  it('navigates to AboutUsScreen', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('AboutUs'));

    await waitFor(() => {
      expect(getByText('AboutUs')).toBeTruthy();
    });
  });

  it('navigates to ContactUsScreen', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('ContactUs'));

    await waitFor(() => {
      expect(getByText('ContactUs')).toBeTruthy();
    });
  });

  it('navigates to Profile', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('My Profile'));

    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });
  });

  it('navigates to Change Password', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Change Password'));

    await waitFor(() => {
      expect(getByText('Change Password')).toBeTruthy();
    });
  });

  it('navigates to MenuPage', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('MenuPage'));

    await waitFor(() => {
      expect(getByText('MenuPage')).toBeTruthy();
    });
  });

  it('navigates to Reset Password', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Account Recovery'));

    await waitFor(() => {
      expect(getByText('Account Recovery')).toBeTruthy();
    });
  });

  it('logs out correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue('userToken');

    const { getByText } = render(
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );

    await waitFor(() => {
      fireEvent.press(getByText('My Profile'));
    });

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(false);
      expect(getByText('Login')).toBeTruthy();
    });
  });
});
