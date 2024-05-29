import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactUs from '../../src/pages/ContactUs/ContactUs'; // Adjust the import path
import { sendEmail } from '../../src/services/emailCalls';

jest.mock('../../src/services/emailCalls', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: '',
  }));


describe('ContactUs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the contact form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<ContactUs />);

    expect(getByText('Get in touch')).toBeTruthy();
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Subject')).toBeTruthy();
    expect(getByPlaceholderText('Message')).toBeTruthy();
  });

  it('validates email format and displays error message for invalid email', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ContactUs />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Subject'), 'Test Subject');
    fireEvent.changeText(getByPlaceholderText('Message'), 'Test Message');
    fireEvent.press(getByText('Submit'));

    expect(queryByText('Message sent successfully!')).toBeNull();
  });

  it('submits the form successfully', async () => {
    (sendEmail as jest.Mock).mockResolvedValue(true);
    const { getByPlaceholderText, getByText } = render(<ContactUs />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Subject'), 'Test Subject');
    fireEvent.changeText(getByPlaceholderText('Message'), 'Test Message');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      });
      expect(getByText('Message sent successfully!')).toBeTruthy();
    });
  });

  it('handles form submission error', async () => {
    (sendEmail as jest.Mock).mockRejectedValue(new Error('Failed to send email'));
    const { getByPlaceholderText, getByText } = render(<ContactUs />);

    fireEvent.changeText(getByPlaceholderText('Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Subject'), 'Test Subject');
    fireEvent.changeText(getByPlaceholderText('Message'), 'Test Message');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      });
      expect(getByText('Message sent successfully!')).toBeTruthy();
    });
  });
});
