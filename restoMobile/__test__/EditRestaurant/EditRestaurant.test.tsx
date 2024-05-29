import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditRestaurant from 'src/pages/EditRestaurant/EditRestaurant'; // Adjust the path accordingly
import * as ImagePicker from 'expo-image-picker';
import { addImageResto, deleteImageRestaurant, getImages } from 'src/services/imagesCalls';
import { defaultRestoImage } from 'src/assets/placeholderImagesBase64';
import { useNavigation } from '@react-navigation/native';

// Mock the useNavigation hook
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: '',
}));

jest.mock('src/services/imagesCalls', () => ({
  addImageResto: jest.fn(),
  deleteImageRestaurant: jest.fn(),
  getImages: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const mockNavigation = {
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    restaurantId: '1',
  },
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      name: 'Test Restaurant',
      phoneNumber: '123456789',
      website: 'http://example.com',
      description: 'Test Description',
      location: {
        streetName: 'Test Street',
        streetNumber: '123',
        postalCode: '12345',
        city: 'Test City',
        country: 'Test Country',
      },
      picturesId: ['1'],
      pictures: [{
        base64: 'testbase64image',
        contentType: 'image/png',
        filename: 'test.png',
        size: 0,
        uploadDate: '',
        id: '1',
      }],
    }),
  })
);

describe('EditRestaurant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByPlaceholderText('Restaurant Name')).toHaveValue('Test Restaurant');
      expect(getByPlaceholderText('Phone Number')).toHaveValue('123456789');
      expect(getByPlaceholderText('Website')).toHaveValue('http://example.com');
      expect(getByPlaceholderText('Description')).toHaveValue('Test Description');
      expect(getByPlaceholderText('Street Name')).toHaveValue('Test Street');
      expect(getByPlaceholderText('Street Number')).toHaveValue('123');
      expect(getByPlaceholderText('Postal Code')).toHaveValue('12345');
      expect(getByPlaceholderText('City')).toHaveValue('Test City');
      expect(getByPlaceholderText('Country')).toHaveValue('Test Country');
    });
  });

  it('handles image change', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ cancelled: false, assets: [{ uri: 'newImageUri' }] });
    (addImageResto as jest.Mock).mockResolvedValue('newImageId');

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Change'));

    fireEvent.press(getByText('Change'));

    await waitFor(() => {
      expect(addImageResto).toHaveBeenCalled();
    });
  });

  it('handles image removal', async () => {
    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Delete'));

    fireEvent.press(getByText('Delete'));

    await waitFor(() => {
      expect(deleteImageRestaurant).toHaveBeenCalledWith('1', 'Test Restaurant');
    });
  });

  it('handles saving restaurant details', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Save'));

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('shows error if image picker permission is denied', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Change'));

    fireEvent.press(getByText('Change'));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Sorry, we need camera roll permissions to make this work!');
    });
  });

  it('handles errors during image loading', async () => {
    (getImages as jest.Mock).mockRejectedValue(new Error('Failed to load images'));

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      expect(getByText('Tap to Add Picture')).toBeTruthy();
    });
  });

  it('shows alert on failed save', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Save'));

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to update restaurant data');
    });
  });

  it('shows unexpected error alert on save failure', async () => {
    global.fetch = jest.fn(() => {
      throw new Error('Unexpected error');
    });

    const { getByText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => getByText('Save'));

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'An unexpected error occurred');
    });
  });

  it('updates text inputs', async () => {
    const { getByPlaceholderText } = render(
      <EditRestaurant route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Restaurant Name'), 'Updated Restaurant');
      fireEvent.changeText(getByPlaceholderText('Phone Number'), '987654321');
      fireEvent.changeText(getByPlaceholderText('Website'), 'http://updated.com');
      fireEvent.changeText(getByPlaceholderText('Description'), 'Updated Description');
      fireEvent.changeText(getByPlaceholderText('Street Name'), 'Updated Street');
      fireEvent.changeText(getByPlaceholderText('Street Number'), '456');
      fireEvent.changeText(getByPlaceholderText('Postal Code'), '67890');
      fireEvent.changeText(getByPlaceholderText('City'), 'Updated City');
      fireEvent.changeText(getByPlaceholderText('Country'), 'Updated Country');
    });

    expect(getByPlaceholderText('Restaurant Name')).toHaveValue('Updated Restaurant');
    expect(getByPlaceholderText('Phone Number')).toHaveValue('987654321');
    expect(getByPlaceholderText('Website')).toHaveValue('http://updated.com');
    expect(getByPlaceholderText('Description')).toHaveValue('Updated Description');
    expect(getByPlaceholderText('Street Name')).toHaveValue('Updated Street');
    expect(getByPlaceholderText('Street Number')).toHaveValue('456');
    expect(getByPlaceholderText('Postal Code')).toHaveValue('67890');
    expect(getByPlaceholderText('City')).toHaveValue('Updated City');
    expect(getByPlaceholderText('Country')).toHaveValue('Updated Country');
  });
});
