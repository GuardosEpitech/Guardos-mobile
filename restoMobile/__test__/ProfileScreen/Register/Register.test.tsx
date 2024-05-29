import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from 'src/pages/ProfileScreen/Register/Register';

// Mock registerUser function
jest.mock('src/services/userCalls', () => ({
  registerUser: jest.fn().mockReturnValue([false, false, false]), // Mock response for registerUser function
}));

describe('Register', () => {
  it('displays error messages when fields are empty and register button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(<Register navigation={{}} />);
    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByText('Register');

    fireEvent.press(registerButton);

    expect(getByText('The desired Username exists already or is invalid')).toBeTruthy();
    expect(getByText('An account already exists for the specified email or is invalid')).toBeTruthy();
    expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy();
  });

  it('registers user when fields are filled and register button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(<Register navigation={{}} />);
    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const registerButton = getByText('Register');

    // Fill input fields
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Test1234');

    fireEvent.press(registerButton);

    // Wait for async operation to complete
    await Promise.resolve();

    // Assert that registerUser is called with correct data
    expect(registerUser).toHaveBeenCalledWith(JSON.stringify({
      username: 'testuser',
      password: 'Test1234',
      email: 'test@example.com',
    }));

    // Assert navigation to Login screen
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
