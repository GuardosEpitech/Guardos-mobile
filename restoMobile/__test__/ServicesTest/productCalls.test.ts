import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getAllProducts,
  getProductsByUser,
  addNewProduct,
  deleteProduct,
  editProduct,
} from 'src/services/productCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('productCalls', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getAllProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockData = [{ name: 'Product 1' }, { name: 'Product 2' }];
      mock.onGet("exemple.com").reply(200, mockData);

      const result = await getAllProducts();

      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching all products', async () => {
      mock.onGet("exemple.com").reply(500);

      await expect(getAllProducts()).rejects.toThrow('Failed to fetch all products');
    });
  });

  describe('getProductsByUser', () => {
    it('should fetch products by user successfully', async () => {
      const userToken = 'userToken';
      const mockData = [{ name: 'User Product 1' }];
      mock.onGet("exemple.com" + '/user/product').reply(200, mockData);

      const result = await getProductsByUser(userToken);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching products by user', async () => {
      const userToken = 'userToken';
      mock.onGet("exemple.com" + '/user/product').reply(500);

      await expect(getProductsByUser(userToken)).rejects.toThrow('Failed to fetch all products from user');
    });
  });

  describe('addNewProduct', () => {
    it('should add a new product successfully', async () => {
      const product = { name: 'New Product', ingredients: [], allergens: [] };
      const restoName = 'TestResto';
      const mockData = { success: true };
      mock.onPost("exemple.com" + restoName).reply(200, mockData);

      const result = await addNewProduct(product, restoName);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when adding a new product with no name', async () => {
      const product = { name: '', ingredients: [], allergens: [] };
      const restoName = 'TestResto';

      await expect(addNewProduct(product, restoName)).rejects.toThrow('Failed to add new product');
    });

    it('should handle errors when adding a new product fails', async () => {
      const product = { name: 'New Product', ingredients: [], allergens: [] };
      const restoName = 'TestResto';
      mock.onPost("exemple.com" + restoName).reply(500);

      await expect(addNewProduct(product, restoName)).rejects.toThrow('Failed to add new product');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const product = { name: 'Product to Delete' };
      const mockData = { success: true };
      mock.onDelete("exemple.com" + product.name).reply(200, mockData);

      const result = await deleteProduct(product);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when deleting a product', async () => {
      const product = { name: 'Product to Delete' };
      mock.onDelete("exemple.com" + product.name).reply(500);

      await expect(deleteProduct(product)).rejects.toThrow('Failed to delete product');
    });
  });

  describe('editProduct', () => {
    it('should edit a product successfully', async () => {
      const product = { name: 'Edited Product', ingredients: [], allergens: [], id: 1, restaurantId: [1] };
      const originalProductName = 'Original Product';
      const mockData = { success: true };
      mock.onPut("exemple.com" + originalProductName).reply(200, mockData);

      const result = await editProduct(product, originalProductName);

      expect(result).toEqual(mockData);
    });

    it('should handle errors when editing a product', async () => {
      const product = { name: 'Edited Product', ingredients: [], allergens: [], id: 1, restaurantId: [1] };
      const originalProductName = 'Original Product';
      mock.onPut("exemple.com" + originalProductName).reply(500);

      await expect(editProduct(product, originalProductName)).rejects.toThrow('Failed to edit product');
    });
  });
});
