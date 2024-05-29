// __tests__/HomePage.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import HomePage from '../../src/pages/HomePage/HomePage'; // Adjust the import path

describe('HomePage', () => {
  it('renders correctly', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('Home Page')).toBeTruthy();
  });
});
