import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary, { Props } from 'src/components/ErrorBoundary/ErrorBoundary';
import { Text, Button } from 'react-native';

const MockFallbackComponent = ({ error, resetError }: { error: Error, resetError: () => void }) => (
  <View>
    <Text>Something went wrong: {error.message}</Text>
    <Button title="Try again" onPress={resetError} />
  </View>
);

const ProblematicComponent = () => {
  throw new Error('Test error');
};

const SafeComponent = () => <Text>Safe Component</Text>;

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    const { getByText } = render(
      <ErrorBoundary FallbackComponent={MockFallbackComponent}>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(getByText('Safe Component')).toBeTruthy();
  });

  it('renders fallback component when error is thrown', () => {
    const { getByText } = render(
      <ErrorBoundary FallbackComponent={MockFallbackComponent}>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong: Test error')).toBeTruthy();
  });

  it('calls onError prop when error is thrown', () => {
    const mockOnError = jest.fn();
    render(
      <ErrorBoundary FallbackComponent={MockFallbackComponent} onError={mockOnError}>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error), expect.any(String));
  });

  it('resets error state when resetError is called', () => {
    const { getByText, queryByText, rerender } = render(
      <ErrorBoundary FallbackComponent={MockFallbackComponent}>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    fireEvent.press(getByText('Try again'));

    rerender(
      <ErrorBoundary FallbackComponent={MockFallbackComponent}>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(queryByText('Something went wrong: Test error')).toBeNull();
    expect(getByText('Safe Component')).toBeTruthy();
  });
});
