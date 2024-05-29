// __tests__/App.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NetInfo from '@react-native-community/netinfo';
import MyTabs from '../Router';
import App from '../App';


jest.mock('@react-native-community/netinfo', () => ({
    NetInfo: jest.fn(),
}));
jest.mock('../Router', () => jest.fn());

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders MyTabs when there is internet connection', async () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation(callback => {
      callback({ isConnected: true });
      return jest.fn();
    });

    (MyTabs as jest.Mock).mockReturnValue(<Text>MyTabs Component</Text>);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('MyTabs Component')).toBeTruthy();
    });
  });

  it('renders ErrorScreen when there is no internet connection', async () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation(callback => {
      callback({ isConnected: false });
      return jest.fn();
    });

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('No internet connection. Please check your connection and try again.')).toBeTruthy();
    });
  });

  it('subscribes and unsubscribes to NetInfo updates', () => {
    const unsubscribeMock = jest.fn();
    (NetInfo.addEventListener as jest.Mock).mockImplementation(callback => {
      callback({ isConnected: true });
      return unsubscribeMock;
    });

    const { unmount } = render(<App />);
    expect(unsubscribeMock).not.toHaveBeenCalled();

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
