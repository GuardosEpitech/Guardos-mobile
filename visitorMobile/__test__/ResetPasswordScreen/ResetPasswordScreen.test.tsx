// __tests__/ResetPasswordScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResetPassword from '../../src/pages/ResetPasswordScreen/ResetPasswordScreen';
import { checkIfVisitorUserExist, sendRecoveryLinkForVisitorUser } from '../../src/services/userCalls';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../src/services/userCalls', () => ({
  checkIfVisitorUserExist: jest.fn(),
  sendRecoveryLinkForVisitorUser: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('ResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <NavigationContainer>
        <ResetPassword navigation={mockNavigation} />
      </NavigationContainer>
    );

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    expect(getByText('Getting back into your Guardos account')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('validates email on first step', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(getByText('Continue')).toBeDisabled();
    });
  });

  it('moves to the next step on valid email', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(getByText('Enter your username')).toBeTruthy();
    });
  });

  it('shows error for non-matching username and email', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockResolvedValue(false);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'wrongUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      expect(getByText(/don't match/i)).toBeTruthy();
    });
  });

  it('sends recovery link for matching username and email', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockResolvedValue(true);
    (sendRecoveryLinkForVisitorUser as jest.Mock).mockResolvedValue(true);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'correctUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      expect(getByText('E-Mail was sent!')).toBeTruthy();
    });
  });

  it('shows error modal if sending recovery link fails', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockResolvedValue(true);
    (sendRecoveryLinkForVisitorUser as jest.Mock).mockResolvedValue(false);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'correctUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      expect(getByText('There was an Error.')).toBeTruthy();
    });
  });

  it('handles exceptions correctly', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'correctUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      expect(getByText('Error checking user. Please try again.')).toBeTruthy();
    });
  });

  it('navigates back to login on modal button press', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockResolvedValue(true);
    (sendRecoveryLinkForVisitorUser as jest.Mock).mockResolvedValue(true);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'correctUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      fireEvent.press(getByText('Go back to login'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('handles navigation correctly for failed email send', async () => {
    (checkIfVisitorUserExist as jest.Mock).mockResolvedValue(true);
    (sendRecoveryLinkForVisitorUser as jest.Mock).mockResolvedValue(false);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'correctUsername');
    fireEvent.press(getByText('Send My Password Reset Link'));

    await waitFor(() => {
      fireEvent.press(getByText('Go back to login'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('disables button when email is invalid', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    await waitFor(() => {
      expect(getByText('Continue')).toBeDisabled();
    });
  });

  it('disables button when username is empty', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), '');
    await waitFor(() => {
      expect(getByText('Send My Password Reset Link')).toBeDisabled();
    });
  });

  it('enables button when username is not empty', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(getByText('Continue'));
    fireEvent.changeText(getByPlaceholderText('Username'), 'validUsername');
    await waitFor(() => {
      expect(getByText('Send My Password Reset Link')).not.toBeDisabled();
    });
  });
});
