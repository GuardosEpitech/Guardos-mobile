import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChangePasswordScreen from 'src/pages/ProfileScreen/ChangePassword/ChangePasswordScreen'; // Adjust the path accordingly
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changePassword } from 'src/services/profileCalls'; // Adjust the path accordingly

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('src/services/profileCalls', () => ({
  changePassword: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);

    expect(getByText('Change Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter old password')).toBeTruthy();
    expect(getByPlaceholderText('Enter new password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
  });

  it('shows error for invalid new password', async () => {
    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'short');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy();
    });
  });

  it('shows error for same old and new password', async () => {
    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'OldPassword1');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Your new Password should not be your old password')).toBeTruthy();
    });
  });

  it('shows error for non-matching new and confirm passwords', async () => {
    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword2');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByText('Your Password does not match')).toBeTruthy();
    });
  });

  it('handles password change successfully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-token');
    (changePassword as jest.Mock).mockResolvedValue('new-user-token');

    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword1');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', 'new-user-token');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile', { passwordChanged: true });
    });
  });

  it('does not proceed if token is null', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword1');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('handles password change failure', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-token');
    (changePassword as jest.Mock).mockRejectedValue(new Error('Password change failed'));

    const { getByText, getByPlaceholderText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword1');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('checks all state updates and branches', async () => {
    const { getByPlaceholderText, getByText } = render(<ChangePasswordScreen navigation={mockNavigation} />);
    
    // Testing invalid new password
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'short');
    fireEvent.press(getByText('Save'));
    await waitFor(() => expect(getByText('Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters')).toBeTruthy());

    // Testing same old and new password
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'OldPassword1');
    fireEvent.press(getByText('Save'));
    await waitFor(() => expect(getByText('Your new Password should not be your old password')).toBeTruthy());

    // Testing non-matching new and confirm passwords
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword2');
    fireEvent.press(getByText('Save'));
    await waitFor(() => expect(getByText('Your Password does not match')).toBeTruthy());
    
    // Valid case with mock success response
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-token');
    (changePassword as jest.Mock).mockResolvedValue('new-user-token');
    
    fireEvent.changeText(getByPlaceholderText('Enter old password'), 'OldPassword1');
    fireEvent.changeText(getByPlaceholderText('Enter new password'), 'NewPassword1');
    fireEvent.changeText(getByPlaceholderText('Confirm new password'), 'NewPassword1');
    fireEvent.press(getByText('Save'));
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', 'new-user-token');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile', { passwordChanged: true });
    });

    // Valid case with token as null
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    fireEvent.press(getByText('Save'));
    await waitFor(() => {
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });
});
