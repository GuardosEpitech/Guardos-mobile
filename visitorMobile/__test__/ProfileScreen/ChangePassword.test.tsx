// __tests__/ChangePasswordScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChangePasswordScreen from '../../src/pages/ProfileScreen/ChangePassword/ChangePassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeVisitorPassword } from '../../src/services/profileCalls';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/profileCalls');

const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(
    <NavigationContainer>
      <ChangePasswordScreen navigation={mockNavigation} />
    </NavigationContainer>
  );

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    expect(getByText('Change Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter old password')).toBeTruthy();
    expect(getByPlaceholderText('Enter new password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
  });

  it('shows error if new password is not valid', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPass123');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'new');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'new');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Password must be at least 7 characters long and contain uppercase, lowercase, and numeric characters.')).toBeTruthy();
    });
  });

  it('shows error if new password and confirm password do not match', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPass123');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPass123');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'DifferentPass123');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('New password and confirmed password do not match.')).toBeTruthy();
    });
  });

  it('shows error if user token is not found', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPass123');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPass123');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPass123');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('User token not found. Please log in again.')).toBeTruthy();
    });
  });

  it('shows success message and navigates to profile on successful password change', async () => {
    AsyncStorage.getItem.mockResolvedValue('userToken');
    changeVisitorPassword.mockResolvedValue('newUserToken');

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPass123');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPass123');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPass123');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Password changed successfully.')).toBeTruthy();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });
  });

  it('shows error message on failed password change', async () => {
    AsyncStorage.getItem.mockResolvedValue('userToken');
    changeVisitorPassword.mockResolvedValue(false);

    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPass123');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPass123');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPass123');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Failed to change password. Please check your old password.')).toBeTruthy();
    });
  });
});
