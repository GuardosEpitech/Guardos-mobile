import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from 'src/pages/ProfileScreen/Login/Login';
import { loginUser } from 'src/services/userCalls';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('src/services/userCalls', () => ({
  loginUser: jest.fn(),
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={jest.fn()} setLoggedInStatus={jest.fn()} />);
    
    expect(getByPlaceholderText('Username or Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls loginUser and sets userToken on successful login', async () => {
    const navigationMock = jest.fn();
    const setLoggedInStatusMock = jest.fn();
    const response = 'validToken';

    loginUser.mockResolvedValueOnce(response);

    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={navigationMock} setLoggedInStatus={setLoggedInStatusMock} />);

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
    fireEvent.press(getByText('Login'));

    expect(loginUser).toHaveBeenCalledWith(JSON.stringify({ username: 'testUser', password: 'testPassword' }));
    await expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', response);
    expect(setLoggedInStatusMock).toHaveBeenCalledWith(true);
    expect(navigationMock).toHaveBeenCalledWith('Scanning');
  });

  it('displays error message on unsuccessful login', async () => {
    const navigationMock = jest.fn();
    const setLoggedInStatusMock = jest.fn();

    loginUser.mockResolvedValueOnce('Invalid Access');

    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen navigation={navigationMock} setLoggedInStatus={setLoggedInStatusMock} />);

    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'testUser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'testPassword');
    fireEvent.press(getByText('Login'));

    expect(loginUser).toHaveBeenCalledWith(JSON.stringify({ username: 'testUser', password: 'testPassword' }));
    await expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
    expect(queryByText('Invalid Logindata')).toBeTruthy();
    expect(setLoggedInStatusMock).not.toHaveBeenCalled();
    expect(navigationMock).not.toHaveBeenCalled();
  });
});
