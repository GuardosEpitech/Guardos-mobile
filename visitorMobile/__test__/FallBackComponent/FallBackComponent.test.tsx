import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FallbackComponent from '../../src/components/ErrorBoundary/FallbackComponent/FallbackComponent';

describe('FallbackComponent', () => {
  const mockResetError = jest.fn();

  it('renders correctly with error message', () => {
    const error = new Error('Test error');
    const { getByText } = render(<FallbackComponent error={error} resetError={mockResetError} />);

    expect(getByText('Oops!')).toBeTruthy();
    expect(getByText("There's an error")).toBeTruthy();
    expect(getByText('Error: Test error')).toBeTruthy();
    expect(getByText('Try again')).toBeTruthy();
  });

  it('calls resetError on button press', () => {
    const error = new Error('Test error');
    const { getByText } = render(<FallbackComponent error={error} resetError={mockResetError} />);

    fireEvent.press(getByText('Try again'));
    expect(mockResetError).toHaveBeenCalledTimes(1);
  });
});
