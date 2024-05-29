import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MenuPage from 'src/pages/MenuPage/MenuPage'; // Adjust the path accordingly
import * as dishCalls from 'src/services/dishCalls';
import * as imagesCalls from 'src/services/imagesCalls';
import * as QRcodeCalls from 'src/services/QRcodeCalls';
import { Linking } from 'react-native';

// Mock the necessary modules
jest.mock('src/services/dishCalls', () => ({
  getDishesByResto: jest.fn(),
  deleteDishByName: jest.fn(),
}));
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));
jest.mock('src/services/imagesCalls', () => ({
  getImages: jest.fn(),
}));

jest.mock('src/services/QRcodeCalls', () => ({
  getQRCodeByName: jest.fn(),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

const mockedDishesData = [
  {
    _id: 1,
    dishes: [
      {
        name: 'Dish 1',
        description: 'Description 1',
        price: 10,
        allergens: ['Allergen 1'],
        category: { menuGroup: 'Appetizer' },
        picturesId: [1],
      },
      {
        name: 'Dish 2',
        description: 'Description 2',
        price: 20,
        allergens: ['Allergen 2'],
        category: { menuGroup: 'Maindish' },
        picturesId: [2],
      },
    ],
  },
];

const mockedImages = [
  { base64: 'base64string1', contentType: 'image/png', filename: 'image1.png', size: 100, uploadDate: '2021-01-01', id: 1 },
  { base64: 'base64string2', contentType: 'image/png', filename: 'image2.png', size: 100, uploadDate: '2021-01-01', id: 2 },
];

const mockedQRCode = { name: 'restaurantQRCode' };

describe('MenuPage', () => {
  beforeEach(() => {
    (dishCalls.getDishesByResto as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockedDishesData),
    });
    (dishCalls.deleteDishByName as jest.Mock).mockResolvedValue({});
    (imagesCalls.getImages as jest.Mock).mockResolvedValue(mockedImages);
    (QRcodeCalls.getQRCodeByName as jest.Mock).mockResolvedValue(mockedQRCode);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and fetches data', async () => {
    const route = { params: { restaurantId: 1, restaurantName: 'Restaurant 1' } };
    const { getByText, queryByText } = render(<MenuPage route={route} />);

    expect(getByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeFalsy();
      expect(getByText('Dish 1')).toBeTruthy();
      expect(getByText('Dish 2')).toBeTruthy();
    });
  });

  it('deletes a dish', async () => {
    const route = { params: { restaurantId: 1, restaurantName: 'Restaurant 1' } };
    const { getByText } = render(<MenuPage route={route} />);

    await waitFor(() => getByText('Dish 1'));

    fireEvent.press(getByText('Delete'));

    await waitFor(() => getByText('Are you sure you want to delete this dish?'));

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(dishCalls.deleteDishByName).toHaveBeenCalledWith('Restaurant 1', 'Dish 1');
      expect(getByText('Dish 1')).toBeTruthy(); // Since it fetches data again, it will still show if mock is not adjusted
    });
  });

  it('handles QR code generation', async () => {
    const route = { params: { restaurantId: 1, restaurantName: 'Restaurant 1' } };
    const { getByText } = render(<MenuPage route={route} />);

    await waitFor(() => getByText('Dish 1'));

    fireEvent.press(getByText('Get My Menu QRCode'));

    await waitFor(() => {
      expect(Linking.openURL).toHaveBeenCalledWith(`exemple.com/qrcode/base64/restaurantQRCode`);
    });
  });

  it('handles errors during data fetching', async () => {
    (dishCalls.getDishesByResto as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const route = { params: { restaurantId: 1, restaurantName: 'Restaurant 1' } };
    const { getByText } = render(<MenuPage route={route} />);

    await waitFor(() => {
      expect(getByText('Error fetching data:')).toBeTruthy();
    });
  });
});
