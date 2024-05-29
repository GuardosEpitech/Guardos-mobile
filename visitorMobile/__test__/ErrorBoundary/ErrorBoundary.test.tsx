// __tests__/ErrorBoundary/ErrorBoundary.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary, { type Props } from '../../src/components/ErrorBoundary/ErrorBoundary';

jest.mock('@testing-library/react', () => ({
    render: jest.fn(),
    screen: jest.fn(),
    fireEvent: jest.fn(),
}));

const FallbackComponent = ({ error, resetError }) => (
  <div>
    <p>{error.message}</p>
    <button onClick={resetError}>Reset</button>
  </div>
);

const ProblemChild = () => {
  throw new Error('Test error');
};

const renderWithErrorBoundary = (ui: React.ReactElement, props: Partial<Props> = {}) => {
  return render(
    <ErrorBoundary FallbackComponent={FallbackComponent} {...props}>
      {ui}
    </ErrorBoundary>
  );
};

describe('ErrorBoundary', () => {
  it('renders children without error', () => {
    renderWithErrorBoundary(<div>Child component</div>);

    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('renders fallback component when an error occurs', () => {
    renderWithErrorBoundary(<ProblemChild />);

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onError callback when an error occurs', () => {
    const onError = jest.fn();
    renderWithErrorBoundary(<ProblemChild />, { onError });

    expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(String));
  });

  it('resets error state when reset button is clicked', () => {
    renderWithErrorBoundary(<ProblemChild />);

    expect(screen.getByText('Test error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.queryByText('Test error')).not.toBeInTheDocument();
  });
});
