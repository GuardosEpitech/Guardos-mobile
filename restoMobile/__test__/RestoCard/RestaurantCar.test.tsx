import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RestaurantCard from 'src/components/RestaurantCard';
jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: () => null, // Mocking FontAwesomeIcon component
  }));
  
  jest.mock('@react-native-async-storage/async-storage', () => ({
    AsyncStorage: () => null, // Mocking FontAwesomeIcon component
  }));
  
describe('RestaurantCard', () => {
  const mockInfo = {
    name: 'Test Restaurant',
    description: 'Test Description',
    rating: 4.5,
    ratingCount: 100,
    picturesId: [1, 2, 3], // Sample picturesId
  };

  it('renders correctly', () => {
    const { getByText } = render(<RestaurantCard info={mockInfo} />);
    expect(getByText(mockInfo.name)).toBeTruthy();
    expect(getByText(mockInfo.description)).toBeTruthy();
    expect(getByText(`Rating: ${mockInfo.rating} (${mockInfo.ratingCount} ratings)`)).toBeTruthy();
  });

  it('calls onDelete when delete button is pressed', () => {
    const mockDelete = jest.fn();
    const { getByTestId } = render(<RestaurantCard info={mockInfo} onDelete={mockDelete} />);
    const deleteButton = getByTestId('delete-button');
    fireEvent.press(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith(mockInfo.name);
  });

  it('navigates to EditRestaurant screen when edit button is pressed', () => {
    const mockNavigation = {
      navigate: jest.fn(),
    };
    const { getByTestId } = render(<RestaurantCard info={mockInfo} onDelete={() => {}} />);
    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditRestaurant', { restaurantId: mockInfo.name });
  });
});
