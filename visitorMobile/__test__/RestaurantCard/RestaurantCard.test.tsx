import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RestaurantCard from '../../src/components/RestaurantCard';
import { getImages } from '../../src/services/imageCalls';
import { defaultRestoImage } from "../../assets/placeholderImagesBase64";

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('../../src/services/imageCalls', () => ({
  getImages: jest.fn(),
}));

const mockRestaurantInfo = {
  name: 'Test Restaurant',
  description: 'Test Description',
  rating: 4.5,
  ratingCount: 100,
  picturesId: [1, 2, 3],
};

const mockImages = [
  {
    base64: 'mockBase64ImageString',
    contentType: 'image/png',
    filename: 'mockImage.png',
    size: 100,
    uploadDate: '2021-10-10',
    id: 1,
  },
];

describe('RestaurantCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with restaurant info', async () => {
    (getImages as jest.Mock).mockResolvedValueOnce(mockImages);

    const { getByText } = render(<RestaurantCard info={mockRestaurantInfo} />);

    await waitFor(() => {
      expect(getByText('Test Restaurant')).toBeTruthy();
      expect(getByText('Test Description')).toBeTruthy();
      expect(getByText('Rating: 4.5 (100 ratings)')).toBeTruthy();
    });
  });

  it('renders default image when there are no pictures', async () => {
    (getImages as jest.Mock).mockResolvedValueOnce([]);

    const { getByTestId } = render(<RestaurantCard info={{ ...mockRestaurantInfo, picturesId: [] }} />);

    await waitFor(() => {
      const image = getByTestId('restaurant-image');
      expect(image.props.source.uri).toBe(defaultRestoImage);
    });
  });

  it('fetches and displays images correctly', async () => {
    (getImages as jest.Mock).mockResolvedValueOnce(mockImages);

    const { getByTestId } = render(<RestaurantCard info={mockRestaurantInfo} />);

    await waitFor(() => {
      const image = getByTestId('restaurant-image');
      expect(image.props.source.uri).toBe('mockBase64ImageString');
    });
  });

  it('displays placeholder image when fetching images fails', async () => {
    (getImages as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch images'));

    const { getByTestId } = render(<RestaurantCard info={mockRestaurantInfo} />);

    await waitFor(() => {
      const image = getByTestId('restaurant-image');
      expect(image.props.source.uri).toBe(defaultRestoImage);
    });
  });
});
