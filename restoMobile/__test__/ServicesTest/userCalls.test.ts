import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  checkIfTokenIsValid,
  loginUser,
  sendRecoveryLinkForRestoUser,
  registerUser,
  checkIfRestoUserExist,
  deleteRestoAccount
} from 'src/services/userCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('userCalls', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('checkIfTokenIsValid', () => {
    it('should check if token is valid successfully', async () => {
      const mockData = { valid: true };
      const body = { token: 'testToken' };
      mock.onGet(`exemple.com/login/restoWeb/checkIn`, { params: body }).reply(200, mockData);

      const result = await checkIfTokenIsValid(body);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when checking if token is valid', async () => {
      const body = { token: 'testToken' };
      mock.onGet(`exemple.com/login/restoWeb/checkIn`, { params: body }).networkError();

      await expect(checkIfTokenIsValid(body)).rejects.toThrow('Error fetching the Users');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const mockData = { token: 'testToken' };
      const userData = { username: 'testUser', password: 'testPass' };
      mock.onPost(`exemple.com/login/restoWeb`, userData).reply(200, mockData);

      const result = await loginUser(userData);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when logging in', async () => {
      const userData = { username: 'testUser', password: 'testPass' };
      mock.onPost(`exemple.com/login/restoWeb`, userData).networkError();

      await expect(loginUser(userData)).rejects.toThrow('Error logging in');
    });
  });

  describe('sendRecoveryLinkForRestoUser', () => {
    it('should send recovery link successfully', async () => {
      const mockData = { success: true };
      const body = { email: 'test@example.com', username: 'testUser' };
      mock.onPost(`exemple.com/sendEmail/userResto/sendPasswordRecovery`, body).reply(200, mockData);

      const result = await sendRecoveryLinkForRestoUser(body);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when sending recovery link', async () => {
      const body = { email: 'test@example.com', username: 'testUser' };
      mock.onPost(`exemple.com/sendEmail/userResto/sendPasswordRecovery`, body).networkError();

      await expect(sendRecoveryLinkForRestoUser(body)).rejects.toThrow('Error checking visitor user');
    });
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      const mockData = { success: true };
      const userData = { username: 'testUser', password: 'testPass', email: 'test@example.com' };
      mock.onPost(`exemple.com/register/restoWeb`, userData).reply(200, mockData);

      const result = await registerUser(userData);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when registering user', async () => {
      const userData = { username: 'testUser', password: 'testPass', email: 'test@example.com' };
      mock.onPost(`exemple.com/register/restoWeb`, userData).networkError();

      await expect(registerUser(userData)).rejects.toThrow('Error registering user');
    });
  });

  describe('checkIfRestoUserExist', () => {
    it('should check if restaurant user exists successfully', async () => {
      const mockData = { exists: true };
      const body = { email: 'test@example.com', username: 'testUser' };
      mock.onPost(`exemple.com/user/userRestoExist`, body).reply(200, mockData);

      const result = await checkIfRestoUserExist(body);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when checking if restaurant user exists', async () => {
      const body = { email: 'test@example.com', username: 'testUser' };
      mock.onPost(`exemple.com/user/userRestoExist`, body).networkError();

      await expect(checkIfRestoUserExist(body)).rejects.toThrow('Error checking resto user');
    });
  });

  describe('deleteRestoAccount', () => {
    it('should delete restaurant account successfully', async () => {
      const mockData = { success: true };
      const token = 'testToken';
      mock.onDelete(`exemple.com/delete/resto`, { params: { key: token } }).reply(200, mockData);

      const result = await deleteRestoAccount(token);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when deleting restaurant account', async () => {
      const token = 'testToken';
      mock.onDelete(`exemple.com/delete/resto`, { params: { key: token } }).networkError();

      await expect(deleteRestoAccount(token)).rejects.toThrow('Error deleting the User');
    });
  });
});
