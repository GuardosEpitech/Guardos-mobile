// __tests__/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/pages/ProfileScreen/Login/Login';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../src/services/userCalls';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../src/services/userCalls');

const mockNavigation = {
  navigate: jest.fn(),
};

const mockSetLoggedInStatus = jest.fn();

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Username or Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't you have an account yet? Register yourself")).toBeTruthy();
    expect(getByText('Or')).toBeTruthy();
  });

  it('handles successful login', async () => {
    (loginUser as jest.Mock).mockResolvedValue('userToken');

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(JSON.stringify({
        username: 'testuser',
        password: 'password',
      }));
    });

    await waitFor(() => {
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(true);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('RestaurantScreen');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('userName', 'testuser');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', JSON.stringify('isSet'));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', 'userToken');
  });

  it('handles invalid login', async () => {
    (loginUser as jest.Mock).mockResolvedValue('Invalid Access');

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(JSON.stringify({
        username: 'testuser',
        password: 'wrongpassword',
      }));
    });

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userName');
      expect(mockSetLoggedInStatus).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalledWith('RestaurantScreen');
    });

    expect(getByText('Invalid Logindata')).toBeTruthy();
  });

  it('navigates to account recovery', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.press(getByText('Trouble logging in?'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Account Recovery');
  });

  it('navigates to register', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} />
      </NavigationContainer>
    );

    fireEvent.press(getByText('here'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
