import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QRCodeEngin from 'src/pages/QRCodeEngin/QRCodeEngin';

// Mock axios and BarCodeScanner
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: { product: { product_name: 'Test Product' } } }),
}));

jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  },
}));

describe('QRCodeEngin', () => {
  it('renders the component properly', async () => {
    const { getByText, getByPlaceholderText } = render(<QRCodeEngin navigation={{}} />);
    expect(getByText('Requesting for camera permission')).toBeTruthy();

    await Promise.resolve(); // Resolve promise to complete the useEffect hook

    expect(getByText('Scan Ingredient')).toBeTruthy();
    expect(getByPlaceholderText('Select a restaurant')).toBeTruthy();
  });

  it('scans a barcode and adds product to the list', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, getByPlaceholderText } = render(<QRCodeEngin navigation={navigation} />);

    await Promise.resolve(); // Resolve promise to complete the useEffect hook

    const barcodeData = '123456789'; // Sample barcode data
    const scanButton = getByText('Scan Again');

    // Mock barcode scanning
    fireEvent.press(scanButton);

    // Ensure barcode scanning process starts
    expect(axios.get).toHaveBeenCalledWith(`https://world.openfoodfacts.org/api/v0/product/${barcodeData}.json`);

    // Mock selecting a restaurant
    const dropdownInput = getByPlaceholderText('Select a restaurant');
    fireEvent.changeText(dropdownInput, 'Restaurant Name');

    // Mock adding product
    const yesButton = getByText('YES');
    fireEvent.press(yesButton);

    // Ensure product is added and navigation occurs
    expect(axios.post).toHaveBeenCalledWith(`http://195.90.210.111:8081/api/products/Restaurant ID`, {
      name: 'Test Product',
      resto: 'Restaurant ID',
    });
    expect(navigation.navigate).toHaveBeenCalledWith('AddPage');
  });
});
