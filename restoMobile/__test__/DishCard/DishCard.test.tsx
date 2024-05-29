import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DishCard from 'src/components/DishCard/DishCard';
import { useNavigation } from '@react-navigation/native';
import { getImages } from 'src/services/imagesCalls';
import { defaultDishImage, defaultRestoImage } from "src/assets/placeholderImagesBase64";
jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: jest.fn().mockReturnValue(null),
  }));
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
jest.mock('src/services/imagesCalls');

describe('DishCard', () => {
  const mockNavigation = { navigate: jest.fn() };
  useNavigation.mockReturnValue(mockNavigation);

  const mockDish = {
    name: 'Test Dish',
    description: 'Test Description',
    resto: 'Test Resto',
    picturesId: [1, 2, 3],
  };

  const mockDishWithoutPictures = {
    ...mockDish,
    picturesId: [],
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with dish details', () => {
    const { getByText } = render(<DishCard dish={mockDish} onDelete={mockOnDelete} />);
    expect(getByText('Test Dish')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('renders default image if no pictures are available', async () => {
    getImages.mockResolvedValue([]);
    const { getByTestId } = render(<DishCard dish={mockDishWithoutPictures} onDelete={mockOnDelete} />);
    await waitFor(() => {
      const image = getByTestId('dish-image');
      expect(image.props.source.uri).toBe(defaultDishImage);
    });
  });

  it('fetches and displays images', async () => {
    const mockImages = [
      { base64: 'image1_base64', contentType: 'image/png', filename: 'image1.png', size: 1234, uploadDate: '2021-01-01', id: 1 },
      { base64: 'image2_base64', contentType: 'image/png', filename: 'image2.png', size: 1234, uploadDate: '2021-01-01', id: 2 },
    ];
    getImages.mockResolvedValue(mockImages);
    const { getByTestId } = render(<DishCard dish={mockDish} onDelete={mockOnDelete} />);
    await waitFor(() => {
      const image = getByTestId('dish-image');
      expect(image.props.source.uri).toBe('image1_base64');
    });
  });

  it('toggles and handles delete confirmation modal', async () => {
    const { getByRole, getByText, queryByText } = render(<DishCard dish={mockDish} onDelete={mockOnDelete} />);
    const deleteButton = getByRole('button');
    fireEvent.press(deleteButton);
    expect(queryByText('Are you sure you want to delete this dish?')).toBeTruthy();
    fireEvent.press(getByText('Confirm'));
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('Test Dish', 'Test Resto');
    });
    expect(queryByText('Are you sure you want to delete this dish?')).toBeFalsy();
  });

  it('handles dish without a name and description', () => {
    const dishWithoutNameDescription = {
      ...mockDish,
      name: '',
      description: '',
    };
    const { getByText } = render(<DishCard dish={dishWithoutNameDescription} onDelete={mockOnDelete} />);
    expect(getByText('No name')).toBeTruthy();
    expect(getByText('No description')).toBeTruthy();
  });

  it('handles modal cancel action', () => {
    const { getByRole, getByText, queryByText } = render(<DishCard dish={mockDish} onDelete={mockOnDelete} />);
    const deleteButton = getByRole('button');
    fireEvent.press(deleteButton);
    expect(queryByText('Are you sure you want to delete this dish?')).toBeTruthy();
    fireEvent.press(getByText('Cancel'));
    expect(queryByText('Are you sure you want to delete this dish?')).toBeFalsy();
  });
});
