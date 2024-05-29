import React from 'react';
import { View, Text } from 'react-native';
// import { render } from '@testing-library/react-native'; // Import render from @testing-library/react-native
import AddProductScreen from '../../src/pages/AddProductScreen/AddProductScreen';

describe('<AddProductScreen />', () => {
  it('renders correctly', () => {
    // Render AddProductScreen component
    const { getByText } = render(<AddProductScreen />);
    
    // Check if the title text is rendered correctly
    const titleElement = getByText('Add new Product');
    expect(titleElement).toBeDefined();

    // Check if ProductForm component is rendered
    const productFormElement = getByText('Product Form');
    expect(productFormElement).toBeDefined();
  });
});
