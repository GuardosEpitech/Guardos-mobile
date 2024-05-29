import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ProfilePage from 'src/pages/ProfileScreen/Profile/NewProfile'; // Adjust the path accordingly
import * as profileCalls from 'src/services/profileCalls';
import * as userCalls from 'src/services/userCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('src/services/profileCalls', () => ({
  getProfileDetails: jest.fn(),
  editProfileDetails: jest.fn(),
}));

jest.mock('src/services/userCalls', () => ({
  deleteRestoAccount: jest.fn(),
}));

describe('ProfilePage', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockSetLoggedInStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('userToken');
    (profileCalls.getProfileDetails as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      username: 'testuser',
      profilePicId: 1,
      defaultMenuDesign: 'default',
      preferredLanguage: 'english',
    });
    (profileCalls.editProfileDetails as jest.Mock).mockResolvedValue('updatedUserToken');
    (userCalls.deleteRestoAccount as jest.Mock).mockResolvedValue('success');
  });

  it('fetches user data on mount', async () => {
    const { getByPlaceholderText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Username').props.value).toBe('testuser');
      expect(getByPlaceholderText('Email').props.value).toBe('test@example.com');
    });

    expect(profileCalls.getProfileDetails).toHaveBeenCalledWith('userToken');
  });

  it('updates user data when apply changes button is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'updatedUser');
    fireEvent.changeText(getByPlaceholderText('Email'), 'updated@example.com');

    fireEvent.press(getByText('Apply Changes'));

    await waitFor(() => {
      expect(profileCalls.editProfileDetails).toHaveBeenCalledWith('userToken', {
        username: 'updatedUser',
        email: 'updated@example.com',
        defaultMenuDesign: 'default',
        preferredLanguage: 'english',
      });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', 'updatedUserToken');
  });

  it('handles image selection', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      cancelled: false,
      assets: [{ uri: 'test-uri' }],
    });

    const { getByTestId } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByTestId('select-image-button'));

    await waitFor(() => {
      expect(getByTestId('profile-image').props.source.uri).toBe('test-uri');
    });

    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });

  it('logs out the user', async () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByText('Logout'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(false);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('deletes the user account', async () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByText('Delete Account'));

    await waitFor(() => {
      expect(userCalls.deleteRestoAccount).toHaveBeenCalledWith('userToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userToken');
      expect(mockSetLoggedInStatus).toHaveBeenCalledWith(false);
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });
  });

  it('displays password changed message when passwordChanged param is true', () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{ params: { passwordChanged: true } }} />
    );

    expect(getByText('Password Changed')).toBeTruthy();
  });

  it('handles DropDownPicker interactions', async () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByText('Default'));
    fireEvent.press(getByText('Fast food'));

    expect(getByText('Fast food')).toBeTruthy();

    fireEvent.press(getByText('English'));
    fireEvent.press(getByText('German'));

    expect(getByText('German')).toBeTruthy();
  });

  it('displays the default profile picture text when no image is selected', () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    expect(getByText('Add Picture')).toBeTruthy();
  });

  it('navigates to change password screen', () => {
    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByText('Change Password'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Change Password');
  });

  it('does not delete the account if delete is cancelled', async () => {
    jest.spyOn(global, 'alert').mockImplementation((message, options) => {
      options[0].onPress();
    });

    const { getByText } = render(
      <ProfilePage navigation={mockNavigation} setLoggedInStatus={mockSetLoggedInStatus} route={{}} />
    );

    fireEvent.press(getByText('Delete Account'));

    expect(userCalls.deleteRestoAccount).not.toHaveBeenCalled();
  });
});
