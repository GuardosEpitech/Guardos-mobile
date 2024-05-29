import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getImages,
  deleteImageRestaurant,
  addImageResto,
  addImageDish,
  deleteImageDish,
} from 'src/services/imagesCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('imagesCalls', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getImages', () => {
    it('should fetch images successfully', async () => {
      const mockData = [{ id: 1, base64: 'image1' }, { id: 2, base64: 'image2' }];
      const imageIds = [1, 2];
      mock.onGet("exemple.com" + '?imageIds=' + imageIds).reply(200, mockData);

      const result = await getImages(imageIds);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching images', async () => {
      const imageIds = [1, 2];
      mock.onGet("exemple.com" + '?imageIds=' + imageIds).reply(500);

      await expect(getImages(imageIds)).rejects.toThrow('Failed to fetch images');
    });
  });

  describe('deleteImageRestaurant', () => {
    it('should delete an image from restaurant successfully', async () => {
      const mockData = { success: true };
      const imageId = 1;
      const restaurantName = 'testRestaurant';
      mock.onDelete("exemple.com").reply(200, mockData);

      const result = await deleteImageRestaurant(imageId, restaurantName);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when deleting an image from restaurant', async () => {
      const imageId = 1;
      const restaurantName = 'testRestaurant';
      mock.onDelete("exemple.com").reply(500);

      const result = await deleteImageRestaurant(imageId, restaurantName);

      expect(result).toBeUndefined();
    });
  });

  describe('addImageResto', () => {
    it('should add an image to restaurant successfully', async () => {
      const mockData = { success: true };
      const restaurantName = 'testRestaurant';
      const imageName = 'testImage';
      const contentType = 'image/png';
      const size = 100;
      const base64 = 'base64string';
      mock.onPost("exemple.com").reply(200, mockData);

      const result = await addImageResto(restaurantName, imageName, contentType, size, base64);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when adding an image to restaurant', async () => {
      const restaurantName = 'testRestaurant';
      const imageName = 'testImage';
      const contentType = 'image/png';
      const size = 100;
      const base64 = 'base64string';
      mock.onPost("exemple.com").reply(500);

      await expect(addImageResto(restaurantName, imageName, contentType, size, base64)).rejects.toThrow('Failed to add image');
    });
  });

  describe('addImageDish', () => {
    it('should add an image to dish successfully', async () => {
      const mockData = { success: true };
      const restaurantName = 'testRestaurant';
      const dishName = 'testDish';
      const imageName = 'testImage';
      const contentType = 'image/png';
      const size = 100;
      const base64 = 'base64string';
      mock.onPost("exemple.com").reply(200, mockData);

      const result = await addImageDish(restaurantName, dishName, imageName, contentType, size, base64);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when adding an image to dish', async () => {
      const restaurantName = 'testRestaurant';
      const dishName = 'testDish';
      const imageName = 'testImage';
      const contentType = 'image/png';
      const size = 100;
      const base64 = 'base64string';
      mock.onPost("exemple.com").reply(500);

      await expect(addImageDish(restaurantName, dishName, imageName, contentType, size, base64)).rejects.toThrow('Failed to add image');
    });
  });

  describe('deleteImageDish', () => {
    it('should delete an image from dish successfully', async () => {
      const mockData = { success: true };
      const imageId = 1;
      const restaurantName = 'testRestaurant';
      const dishName = 'testDish';
      mock.onDelete("exemple.com").reply(200, mockData);

      const result = await deleteImageDish(imageId, restaurantName, dishName);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when deleting an image from dish', async () => {
      const imageId = 1;
      const restaurantName = 'testRestaurant';
      const dishName = 'testDish';
      mock.onDelete("exemple.com").reply(500);

      await expect(deleteImageDish(imageId, restaurantName, dishName)).rejects.toThrow('Failed to delete image');
    });
  });
});
