// __tests__/email.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { sendEmail } from '../../src/services/emailCalls';
import { IContactForm } from '../../src/models/emailInterfaces';

const API_URL = 'https://api.example.com/';
const baseUrl = `${API_URL}sendEmail/`;

describe('sendEmail', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should send an email successfully', async () => {
    const formData: IContactForm = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Email',
      message: 'This is a test email.'
    };
    const responseMessage = { message: 'Email sent successfully' };
    mock.onPost(baseUrl).reply(200, responseMessage);

    const response = await sendEmail(formData);
    expect(response).toEqual(responseMessage);
  });

  it('should handle non-200 response status', async () => {
    const formData: IContactForm = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Email',
      message: 'This is a test email.'
    };
    mock.onPost(baseUrl).reply(400);

    const response = await sendEmail(formData);
    expect(response).toBeNull();
  });

  it('should handle error while sending email', async () => {
    const formData: IContactForm = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Test Email',
      message: 'This is a test email.'
    };
    mock.onPost(baseUrl).networkError();

    await expect(sendEmail(formData)).rejects.toThrow('Error sending email');
  });
});
