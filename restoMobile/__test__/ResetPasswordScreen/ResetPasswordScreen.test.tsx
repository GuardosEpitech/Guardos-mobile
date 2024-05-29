import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ResetPassword from 'src/pages/ResetPasswordScreen/ResetPasswordScreen'; // Adjust the path accordingly
import * as userCalls from 'src/services/userCalls';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('src/services/userCalls', () => ({
  checkIfRestoUserExist: jest.fn(),
  sendRecoveryLinkForRestoUser: jest.fn(),
}));

describe('ResetPassword', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () => {
    return render(
      <NavigationContainer>
        <ResetPassword navigation={mockNavigation} />
      </NavigationContainer>
    );
  };

  it('renders correctly and handles email input', () => {
    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');

    expect(getByText('Continue')).toBeTruthy();
  });

  it('validates email and proceeds to username input', async () => {
    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(getByPlaceholderText('Username')).toBeTruthy();
    });
  });

  it('validates username and sends recovery link successfully', async () => {
    (userCalls.checkIfRestoUserExist as jest.Mock).mockResolvedValue(true);
    (userCalls.sendRecoveryLinkForRestoUser as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
      fireEvent.press(getByText('Send My Password Reset Link'));
    });

    await waitFor(() => {
      expect(userCalls.checkIfRestoUserExist).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
      });
      expect(userCalls.sendRecoveryLinkForRestoUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
      });
      expect(getByText('E-Mail was sent!')).toBeTruthy();
    });
  });

  it('shows error when username and email do not match', async () => {
    (userCalls.checkIfRestoUserExist as jest.Mock).mockResolvedValue(false);

    const { getByPlaceholderText, getByText, getByTestId } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), 'wronguser');
      fireEvent.press(getByText('Send My Password Reset Link'));
    });

    await waitFor(() => {
      expect(userCalls.checkIfRestoUserExist).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'wronguser',
      });
      expect(getByTestId('error-text')).toBeTruthy();
    });
  });

  it('handles server error during username check', async () => {
    (userCalls.checkIfRestoUserExist as jest.Mock).mockRejectedValue(new Error('Server error'));

    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
      fireEvent.press(getByText('Send My Password Reset Link'));
    });

    await waitFor(() => {
      expect(userCalls.checkIfRestoUserExist).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'testuser',
      });
      expect(getByText('Error checking user. Please try again.')).toBeTruthy();
    });
  });

  it('navigates back to login from modal', async () => {
    (userCalls.checkIfRestoUserExist as jest.Mock).mockResolvedValue(true);
    (userCalls.sendRecoveryLinkForRestoUser as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
      fireEvent.press(getByText('Send My Password Reset Link'));
    });

    await waitFor(() => {
      fireEvent.press(getByText('Go back to login'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('disables continue button if email is invalid', () => {
    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');

    expect(getByText('Continue')).toBeDisabled();
  });

  it('disables send button if username is empty', async () => {
    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), '');
      expect(getByText('Send My Password Reset Link')).toBeDisabled();
    });
  });

  it('shows correct description based on step', () => {
    const { getByText } = setup();

    expect(getByText('Tell us some information about your account')).toBeTruthy();

    act(() => {
      fireEvent.press(getByText('Continue'));
    });

    expect(getByText('Next, give us the Guardos username you\'re having trouble with')).toBeTruthy();
  });

  it('handles going back to the first step', async () => {
    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
    });

    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      fireEvent.press(getByText('Go back'));
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Username')).not.toBeTruthy();
    });
  });
});
