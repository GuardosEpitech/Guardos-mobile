// __tests__/imageService.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getImages } from '../../src/services/imageCalls';

const API_URL = 'https://api.example.com/';
const baseUrl = `${API_URL}images/`;

describe('getImages', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch images successfully', async () => {
    const imageIds = [1, 2, 3];
    const responseData = [{ id: 1, base64: 'data:image1' }, { id: 2, base64: 'data:image2' }];
    mock.onGet(`${baseUrl}?imageIds=${imageIds}`).reply(200, responseData);

    const response = await getImages(imageIds);
    expect(response).toEqual(responseData);
  });

  it('should handle errors when fetching images', async () => {
    const imageIds = [1, 2, 3];
    mock.onGet(`${baseUrl}?imageIds=${imageIds}`).networkError();

    await expect(getImages(imageIds)).rejects.toThrow('Failed to fetch images');
  });
});
