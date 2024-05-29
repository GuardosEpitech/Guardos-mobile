// __tests__/profileService.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getVisitorProfileDetails,
  editVisitorProfileDetails,
  changeVisitorPassword,
  getSavedFilters,
  getSavedFilter,
  addSavedFilter,
  editSavedFilter,
  deleteSavedFilter
} from '../../src/services/profileCalls';

// Mocking the environment variable

describe('Profile Service', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch visitor profile details successfully', async () => {
    const token = 'test-token';
    const responseData = { username: 'testuser' };
    mock.onGet("https://api.example.com/profile/").reply(200, responseData);

    const response = await getVisitorProfileDetails(token);
    expect(response).toEqual(responseData);
  });

  it('should handle error while fetching visitor profile details', async () => {
    const token = 'test-token';
    mock.onGet("https://api.example.com/profile/").networkError();

    await expect(getVisitorProfileDetails(token)).rejects.toThrow('Error fetching the Users Details');
  });

  it('should edit visitor profile details successfully', async () => {
    const token = 'test-token';
    const body = { username: 'testuser' };
    const responseData = { success: true };
    mock.onPut("https://api.example.com/profile/").reply(200, responseData);

    const response = await editVisitorProfileDetails(token, body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while editing visitor profile details', async () => {
    const token = 'test-token';
    const body = { username: 'testuser' };
    mock.onPut("https://api.example.com/profile/").networkError();

    await expect(editVisitorProfileDetails(token, body)).rejects.toThrow('Error editing the Users Details');
  });

  it('should change visitor password successfully', async () => {
    const token = 'test-token';
    const oldPassword = 'oldPass';
    const newPassword = 'newPass';
    const responseData = { success: true };
    mock.onPut("https://api.example.com/profile/" + 'password').reply(200, responseData);

    const response = await changeVisitorPassword(token, oldPassword, newPassword);
    expect(response).toEqual(responseData);
  });

  it('should handle error while changing visitor password', async () => {
    const token = 'test-token';
    const oldPassword = 'oldPass';
    const newPassword = 'newPass';
    mock.onPut("https://api.example.com/profile/" + 'password').networkError();

    await expect(changeVisitorPassword(token, oldPassword, newPassword)).rejects.toThrow('Error changing the password of the Users');
  });

  it('should get saved filters successfully', async () => {
    const token = 'test-token';
    const responseData = [{ filterName: 'testFilter' }];
    mock.onGet("https://api.example.com/profile/" + 'filter').reply(200, responseData);

    const response = await getSavedFilters(token);
    expect(response).toEqual(responseData);
  });

  it('should handle error while getting saved filters', async () => {
    const token = 'test-token';
    mock.onGet("https://api.example.com/profile/" + 'filter').networkError();

    await expect(getSavedFilters(token)).rejects.toThrow('Error saving filter');
  });

  it('should get saved filter by name successfully', async () => {
    const token = 'test-token';
    const filterName = 'testFilter';
    const responseData = { filterName: 'testFilter' };
    mock.onGet("https://api.example.com/profile/" + 'filter/id').reply(200, responseData);

    const response = await getSavedFilter(token, filterName);
    expect(response).toEqual(responseData);
  });

  it('should handle error while getting saved filter by name', async () => {
    const token = 'test-token';
    const filterName = 'testFilter';
    mock.onGet("https://api.example.com/profile/" + 'filter/id').networkError();

    await expect(getSavedFilter(token, filterName)).rejects.toThrow('Error saving filter');
  });

  it('should add saved filter successfully', async () => {
    const token = 'test-token';
    const body = { filterName: 'testFilter' };
    const responseData = { success: true };
    mock.onPost("https://api.example.com/profile/" + 'filter').reply(200, responseData);

    const response = await addSavedFilter(token, body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while adding saved filter', async () => {
    const token = 'test-token';
    const body = { filterName: 'testFilter' };
    mock.onPost("https://api.example.com/profile/" + 'filter').networkError();

    await expect(addSavedFilter(token, body)).rejects.toThrow('Error saving filter');
  });

  it('should edit saved filter successfully', async () => {
    const token = 'test-token';
    const body = { filterName: 'testFilter' };
    const responseData = { success: true };
    mock.onPut("https://api.example.com/profile/" + 'filter').reply(200, responseData);

    const response = await editSavedFilter(token, body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while editing saved filter', async () => {
    const token = 'test-token';
    const body = { filterName: 'testFilter' };
    mock.onPut("https://api.example.com/profile/" + 'filter').networkError();

    await expect(editSavedFilter(token, body)).rejects.toThrow('Error editing filter');
  });

  it('should delete saved filter successfully', async () => {
    const token = 'test-token';
    const filterName = 'testFilter';
    const responseData = { success: true };
    mock.onDelete("https://api.example.com/profile/" + 'filter').reply(200, responseData);

    const response = await deleteSavedFilter(token, filterName);
    expect(response).toEqual(responseData);
  });

  it('should handle error while deleting saved filter', async () => {
    const token = 'test-token';
    const filterName = 'testFilter';
    mock.onDelete("https://api.example.com/profile/" + 'filter').networkError();

    await expect(deleteSavedFilter(token, filterName)).rejects.toThrow('Error deleting filter');
  });
});
