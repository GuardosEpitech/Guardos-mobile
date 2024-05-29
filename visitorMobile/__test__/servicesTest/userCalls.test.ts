// __tests__/authService.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  checkIfTokenIsValid,
  loginUser,
  registerUser,
  sendRecoveryLinkForVisitorUser,
  checkIfVisitorUserExist,
  deleteAccount
} from '../../src/services/userCalls';

// Mocking the environment variable
jest.mock('@env', () => ({
  API_URL: 'https://api.example.com/',
}));

const baseUrl = 'https://api.example.com/login/';
const baseUrl1 = 'https://api.example.com/user/';
const baseUrlEmail = 'https://api.example.com/sendEmail/';

describe('Auth Service', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should validate token successfully', async () => {
    const body = { token: 'testToken' };
    const responseData = { valid: true };
    mock.onGet(`${baseUrl}checkIn`).reply(200, responseData);

    const response = await checkIfTokenIsValid(body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while validating token', async () => {
    const body = { token: 'testToken' };
    mock.onGet(`${baseUrl}checkIn`).networkError();

    await expect(checkIfTokenIsValid(body)).rejects.toThrow('Error fetching the Users');
  });

  it('should login user successfully', async () => {
    const userData = { username: 'test', password: 'test' };
    const responseData = { token: 'testToken' };
    mock.onPost(baseUrl).reply(200, responseData);

    const response = await loginUser(userData);
    expect(response).toEqual(responseData);
  });

  it('should handle error while logging in user', async () => {
    const userData = { username: 'test', password: 'test' };
    mock.onPost(baseUrl).networkError();

    await expect(loginUser(userData)).rejects.toThrow('Error logging in');
  });

  it('should register user successfully', async () => {
    const userData = { username: 'test', password: 'test', email: 'test@example.com' };
    const responseData = { success: true };
    mock.onPost('https://api.example.com/register').reply(200, responseData);

    const response = await registerUser(userData);
    expect(response).toEqual(responseData);
  });

  it('should handle error while registering user', async () => {
    const userData = { username: 'test', password: 'test', email: 'test@example.com' };
    mock.onPost('https://api.example.com/register').networkError();

    await expect(registerUser(userData)).rejects.toThrow('Error registering user');
  });

  it('should send recovery link for visitor user successfully', async () => {
    const body = { email: 'test@example.com', username: 'test' };
    const responseData = { success: true };
    mock.onPost(`${baseUrlEmail}userVisitor/sendPasswordRecovery`).reply(200, responseData);

    const response = await sendRecoveryLinkForVisitorUser(body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while sending recovery link for visitor user', async () => {
    const body = { email: 'test@example.com', username: 'test' };
    mock.onPost(`${baseUrlEmail}userVisitor/sendPasswordRecovery`).networkError();

    await expect(sendRecoveryLinkForVisitorUser(body)).rejects.toThrow('Error checking visitor user');
  });

  it('should check if visitor user exists successfully', async () => {
    const body = { email: 'test@example.com', username: 'test' };
    const responseData = { exists: true };
    mock.onPost(`${baseUrl1}userVisitorExist`).reply(200, responseData);

    const response = await checkIfVisitorUserExist(body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while checking if visitor user exists', async () => {
    const body = { email: 'test@example.com', username: 'test' };
    mock.onPost(`${baseUrl1}userVisitorExist`).networkError();

    await expect(checkIfVisitorUserExist(body)).rejects.toThrow('Error checking visitor user');
  });

  it('should delete account successfully', async () => {
    const token = 'testToken';
    const responseData = { success: true };
    mock.onDelete('https://api.example.com/delete/').reply(200, responseData);

    const response = await deleteAccount(token);
    expect(response).toEqual(responseData);
  });

  it('should handle error while deleting account', async () => {
    const token = 'testToken';
    mock.onDelete('https://api.example.com/delete/').networkError();

    await expect(deleteAccount(token)).rejects.toThrow('Error deleting the User');
  });
});
