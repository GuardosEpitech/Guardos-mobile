import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Profile from 'src/pages/ProfileScreen/Profile/Profile';

// Mock AsyncStorage methods
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock deleteRestoAccount function
jest.mock('src/services/userCalls', () => ({
  deleteRestoAccount: jest.fn().mockResolvedValue(true),
}));

describe('Profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates email, name, and city when inputs change', () => {
    const { getByPlaceholderText } = render(<Profile navigation={{}} setLoggedInStatus={() => {}} />);

    const emailInput = getByPlaceholderText('Enter your email');
    const nameInput = getByPlaceholderText('Enter your name');
    const cityInput = getByPlaceholderText('Enter your city');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(cityInput, 'New York');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(nameInput.props.value).toBe('John Doe');
    expect(cityInput.props.value).toBe('New York');
  });

  it('calls handleAddRestaurant when the Apply Change button is pressed', () => {
    const { getByText } = render(<Profile navigation={{}} setLoggedInStatus={() => {}} />);
    const applyChangeButton = getByText('Apply Change');
    fireEvent.press(applyChangeButton);
    // Assert that handleAddRestaurant is called
    // You can expand this test by adding assertions based on the expected behavior
  });

  it('calls handleLogout when the Logout button is pressed', () => {
    const { getByText } = render(<Profile navigation={{}} setLoggedInStatus={() => {}} />);
    const logoutButton = getByText('Logout');
    fireEvent.press(logoutButton);
    // Assert that handleLogout is called
    // You can expand this test by adding assertions based on the expected behavior
  });

  it('calls handleDeleteAccount when the Delete Account button is pressed', () => {
    const { getByText } = render(<Profile navigation={{}} setLoggedInStatus={() => {}} />);
    const deleteAccountButton = getByText('Delete Account');
    fireEvent.press(deleteAccountButton);
    // Assert that handleDeleteAccount is called
    // You can expand this test by adding assertions based on the expected behavior
  });
});
