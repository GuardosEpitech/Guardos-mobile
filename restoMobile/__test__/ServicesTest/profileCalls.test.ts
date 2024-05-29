import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getProfileDetails,
  editProfileDetails,
  changePassword,
} from 'src/services/profileCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('profileCalls', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getProfileDetails', () => {
    it('should fetch profile details successfully', async () => {
      const token = 'userToken';
      const mockData = { username: 'testUser', email: 'test@example.com' };
      mock.onGet("exemple.com").reply(200, mockData);

      const result = await getProfileDetails(token);

      expect(result).toEqual(mockData);
    });

    it('should return null for non-200 response', async () => {
      const token = 'userToken';
      mock.onGet("exemple.com").reply(404);

      const result = await getProfileDetails(token);

      expect(result).toBeNull();
    });

    it('should handle errors when fetching profile details', async () => {
      const token = 'userToken';
      mock.onGet("exemple.com").networkError();

      await expect(getProfileDetails(token)).rejects.toThrow('Error fetching the User Details');
    });
  });

  describe('editProfileDetails', () => {
    it('should edit profile details successfully', async () => {
      const token = 'userToken';
      const body = { username: 'newUser', email: 'new@example.com' };
      const mockData = { success: true };
      mock.onPut("exemple.com").reply(200, mockData);

      const result = await editProfileDetails(token, body);

      expect(result).toEqual(mockData);
    });

    it('should return false for non-200 response', async () => {
      const token = 'userToken';
      const body = { username: 'newUser', email: 'new@example.com' };
      mock.onPut("exemple.com").reply(404);

      const result = await editProfileDetails(token, body);

      expect(result).toBeFalsy();
    });

    it('should handle errors when editing profile details', async () => {
      const token = 'userToken';
      const body = { username: 'newUser', email: 'new@example.com' };
      mock.onPut("exemple.com").networkError();

      await expect(editProfileDetails(token, body)).rejects.toThrow('Error editing the User Details');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const token = 'userToken';
      const oldPassword = 'oldPass';
      const newPassword = 'newPass';
      const mockData = { success: true };
      mock.onPut("exemple.com" + 'password').reply(200, mockData);

      const result = await changePassword(token, oldPassword, newPassword);

      expect(result).toEqual(mockData);
    });

    it('should return false for non-200 response', async () => {
      const token = 'userToken';
      const oldPassword = 'oldPass';
      const newPassword = 'newPass';
      mock.onPut("exemple.com" + 'password').reply(404);

      const result = await changePassword(token, oldPassword, newPassword);

      expect(result).toBeFalsy();
    });

    it('should handle errors when changing password', async () => {
      const token = 'userToken';
      const oldPassword = 'oldPass';
      const newPassword = 'newPass';
      mock.onPut("exemple.com" + 'password').networkError();

      await expect(changePassword(token, oldPassword, newPassword)).rejects.toThrow('Error changing the password of the Users');
    });
  });
});
