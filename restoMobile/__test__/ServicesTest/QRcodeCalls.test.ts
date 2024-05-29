import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getQRCodeByName } from 'src/services/QRcodeCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('getQRCodeByName', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch QR code by name successfully', async () => {
    const name = 'testName';
    const mockData = { qrCode: 'base64encodedstring' };
    mock.onGet(`exemple.com/qrcode/${name}`).reply(200, mockData);

    const result = await getQRCodeByName(name);

    expect(result).toEqual(mockData);
  });

  it('should handle errors when fetching QR code by name', async () => {
    const name = 'testName';
    mock.onGet(`exemple.com/qrcode/${name}`).networkError();

    await expect(getQRCodeByName(name)).rejects.toThrow('Failed to fetch QR code by name');
  });
});
