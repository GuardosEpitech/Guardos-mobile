import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import App from '../App';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  AsyncStorage: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('moti', () => ({
  MotiView: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('expo-image-picker', () => ({
  ImagePicker: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('expo-barcode-scanner', () => ({
  BarCodeScanner: () => null, // Mocking FontAwesomeIcon component
}));

jest.mock('react-native-gesture-handler', () => ({
  NativeViewGestureHandler: () => null,
  TapGestureHandler: () => null,
  LongPressGestureHandler: () => null,
  PanGestureHandler: () => null,
  FlingGestureHandler: () => null,
  PinchGestureHandler: () => null,
  RotationGestureHandler: () => null,
  /* Add more handlers as needed */
}));



// Mock NetInfo module
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
}));

describe('App Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders MyTabs when internet connection is available', async () => {
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: true });

    const { getByTestId } = render(<App />);

    await waitFor(() => expect(getByTestId('MyTabs')).toBeTruthy());
  });

  test('renders error screen when no internet connection', async () => {
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: false });

    const { getByText } = render(<App />);

    await waitFor(() => expect(getByText(/No internet connection/i)).toBeTruthy());
  });

  test('updates internet connection status', async () => {
    const unsubscribe = jest.fn();
    NetInfo.addEventListener.mockReturnValueOnce(unsubscribe);

    const { rerender } = render(<App />);

    expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);

    rerender(<App />);
    expect(unsubscribe).not.toHaveBeenCalled();

    rerender(<App />);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
