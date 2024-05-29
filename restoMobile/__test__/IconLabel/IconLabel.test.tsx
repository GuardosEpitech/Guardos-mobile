import React from 'react';
import { render } from '@testing-library/react-native';
import IconLabel from 'src/components/IconLabel'; // Adjust the path accordingly

describe('IconLabel', () => {
  it('renders correctly with given props', () => {
    const { getByText } = render(<IconLabel name="test-icon" label="Test Label" color="red" />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('has the correct label style', () => {
    const { getByText } = render(<IconLabel name="test-icon" label="Test Label" color="red" />);
    const label = getByText('Test Label');
    expect(label.props.style).toMatchObject({
      fontSize: 12,
    });
  });

  it('renders the icon with the correct color', () => {
    const { getByTestId } = render(<IconLabel name="test-icon" label="Test Label" color="red" />);
    const icon = getByTestId('icon');
    expect(icon.props.color).toBe('red');
  });
});
