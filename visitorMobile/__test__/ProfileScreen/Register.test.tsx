// __tests__/Register.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from '../../src/pages/ProfileScreen/Register/Register';
import { registerUser } from '../../src/services/userCalls';

jest.mock('../../src/services/userCalls', () => ({
  registerUser: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <Register navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('shows error messages for invalid inputs', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), '');
    fireEvent.changeText(getByPlaceholderText('Email'), '');
    fireEvent.changeText(getByPlaceholderText('Password'), 'abc');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('The desired Username exists already or is invalid')).toBeTruthy();
      expect(getByText('An account already exists for the specified email or is invalid')).toBeTruthy();
      expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy();
    });
  });

  it('shows error message for missing username', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), '');
    fireEvent.changeText(getByPlaceholderText('Email'), 'newUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('The desired Username exists already or is invalid')).toBeTruthy();
    });
  });

  it('shows error message for missing email', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'newUser');
    fireEvent.changeText(getByPlaceholderText('Email'), '');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('An account already exists for the specified email or is invalid')).toBeTruthy();
    });
  });

  it('shows error message for missing password', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'newUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'newUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy();
    });
  });

  it('shows error message for invalid password', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'newUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'newUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'short');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy();
    });
  });

  it('navigates to login on successful registration', async () => {
    (registerUser as jest.Mock).mockResolvedValue([false, false]);

    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'newUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'newUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(JSON.stringify({
        username: 'newUser',
        password: 'Password1',
        email: 'newUser@example.com',
      }));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('shows error messages for existing username or email', async () => {
    (registerUser as jest.Mock).mockResolvedValue([true, true]);

    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'existingUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'existingUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(JSON.stringify({
        username: 'existingUser',
        password: 'Password1',
        email: 'existingUser@example.com',
      }));
      expect(getByText('The desired Username exists already or is invalid')).toBeTruthy();
      expect(getByText('An account already exists for the specified email or is invalid')).toBeTruthy();
    });
  });

  it('handles exceptions correctly', async () => {
    (registerUser as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { getByText, getByPlaceholderText } = render(
      <Register navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'newUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'newUser@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Password1');

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(JSON.stringify({
        username: 'newUser',
        password: 'Password1',
        email: 'newUser@example.com',
      }));
      expect(getByText('An account already exists for the specified email or is invalid')).toBeTruthy();
      expect(getByText('The desired Username exists already or is invalid')).toBeTruthy();
    });
  });
});
