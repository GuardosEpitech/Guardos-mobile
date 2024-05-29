import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RestaurantCard from 'src/components/RestaurantCard';
import { useNavigation } from '@react-navigation/native';
import { getImages } from 'src/services/imagesCalls';
import { defaultRestoImage } from 'src/assets/placeholderImagesBase64';
jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: jest.fn().mockReturnValue(null),
  }));
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('src/services/imagesCalls');
jest.mock('src/assets/placeholderImagesBase64', () => ({
  defaultRestoImage: 'data:image/png;base64,defaultImage',
}));

describe('RestaurantCard', () => {
  const mockNavigation = { navigate: jest.fn() };
  useNavigation.mockReturnValue(mockNavigation);

  const mockInfo = {
    name: 'Test Restaurant',
    description: 'A test restaurant',
    rating: 4.5,
    ratingCount: 100,
    picturesId: [1, 2],
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getImages.mockResolvedValue([
      {
        base64: 'data:image/png;base64,testImage',
        contentType: 'image/png',
        filename: 'testImage.png',
        size: 100,
        uploadDate: '2021-01-01',
        id: 1,
      },
    ]);
  });

  it('renders correctly', async () => {
    const { getByText, getByRole } = render(
      <RestaurantCard info={mockInfo} onDelete={mockOnDelete} />
    );

    expect(getByText('Test Restaurant')).toBeTruthy();
    expect(getByText('A test restaurant')).toBeTruthy();
    expect(getByText('Rating: 4.5 (100 ratings)')).toBeTruthy();
    await waitFor(() => expect(getByRole('image')).toHaveProp('source', { uri: 'data:image/png;base64,testImage' }));
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByTestId } = render(<RestaurantCard info={mockInfo} onDelete={mockOnDelete} />);

    fireEvent.press(getByTestId('delete-button'));

    expect(mockOnDelete).toHaveBeenCalledWith('Test Restaurant');
  });

  it('navigates to EditRestaurant when edit button is pressed', () => {
    const { getByTestId } = render(<RestaurantCard info={mockInfo} onDelete={mockOnDelete} />);

    fireEvent.press(getByTestId('edit-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('EditRestaurant', { restaurantId: 'Test Restaurant' });
  });

  it('fetches and displays the correct images', async () => {
    const { getByRole } = render(<RestaurantCard info={mockInfo} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(getByRole('image')).toHaveProp('source', { uri: 'data:image/png;base64,testImage' });
    });
  });

  it('displays default image when no picturesId are provided', async () => {
    const mockInfoWithoutPictures = {
      ...mockInfo,
      picturesId: [],
    };

    const { getByRole } = render(<RestaurantCard info={mockInfoWithoutPictures} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(getByRole('image')).toHaveProp('source', { uri: 'data:image/png;base64,defaultImage' });
    });
  });
});
