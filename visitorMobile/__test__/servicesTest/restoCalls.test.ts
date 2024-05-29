// __tests__/restoService.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getFilteredRestos,
  getSelectedFilteredRestos,
  getAllResto
} from '../../src/services/restoCalls';
import { IRestaurantFrontEnd } from '../../../shared/models/restaurantInterfaces';

// Mocking the environment variable

const baseUrl = 'https://api.example.com/filter/';
const baseUrlResto = 'https://api.example.com/restaurants/';
const selectedURL = 'https://api.example.com/filter/filteredlist';

describe('Resto Service', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch filtered restos successfully', async () => {
    const body = { name: 'test' };
    const responseData = [{ name: 'testResto' }];
    mock.onPost(baseUrl).reply(200, responseData);

    const response = await getFilteredRestos(body);
    expect(response).toEqual(responseData);
  });

  it('should handle error while fetching filtered restos', async () => {
    const body = { name: 'test' };
    mock.onPost(baseUrl).networkError();

    await expect(getFilteredRestos(body)).rejects.toThrow();
  });

  it('should fetch selected filtered restos successfully', async () => {
    const body = { name: 'test' };
    const responseData: IRestaurantFrontEnd[] = [
      { name: 'testResto', location: { latitude: '123', longitude: '456' } },
      { name: 'testResto2', location: { latitude: '', longitude: '' } },
    ];
    mock.onPost(selectedURL).reply(200, responseData);

    const response = await getSelectedFilteredRestos(body);
    expect(response).toEqual([
      { name: 'testResto', location: { latitude: '123', longitude: '456' } }
    ]);
  });

  it('should handle error while fetching selected filtered restos', async () => {
    const body = { name: 'test' };
    mock.onPost(selectedURL).networkError();

    await expect(getSelectedFilteredRestos(body)).rejects.toThrow();
  });

  it('should fetch all restos successfully', async () => {
    const responseData = [{ name: 'testResto' }];
    mock.onGet(baseUrlResto).reply(200, responseData);

    const response = await getAllResto();
    expect(response).toEqual(responseData);
  });

  it('should handle error while fetching all restos', async () => {
    mock.onGet(baseUrlResto).networkError();

    await expect(getAllResto()).rejects.toThrow('Failed to fetch all restaurants');
  });
});
