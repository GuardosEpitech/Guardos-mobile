import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  getAllResto, 
  getAllRestaurantsByUser, 
  getRestaurantByName, 
  addRestaurant, 
  deleteRestaurantByName 
} from 'src/services/restoCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('restoCalls', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('getAllResto', () => {
    it('should fetch all restaurants successfully', async () => {
      const mockData = [{ name: 'Restaurant 1' }, { name: 'Restaurant 2' }];
      mock.onGet(`exemple.com/restaurants/`).reply(200, mockData);

      const result = await getAllResto();
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching all restaurants', async () => {
      mock.onGet(`exemple.com/restaurants/`).networkError();

      await expect(getAllResto()).rejects.toThrow('Failed to fetch all restaurants');
    });
  });

  describe('getAllRestaurantsByUser', () => {
    it('should fetch all restaurants by user successfully', async () => {
      const mockData = [{ name: 'User Restaurant 1' }];
      const body = { userId: '123' };
      mock.onGet(`exemple.com/restaurants/user/resto`, { params: body }).reply(200, mockData);

      const result = await getAllRestaurantsByUser(body);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching restaurants by user', async () => {
      const body = { userId: '123' };
      mock.onGet(`exemple.com/restaurants/user/resto`, { params: body }).networkError();

      await expect(getAllRestaurantsByUser(body)).rejects.toThrow('Failed to fetch all restaurants');
    });
  });

  describe('getRestaurantByName', () => {
    it('should fetch restaurant by name successfully', async () => {
      const mockData = { name: 'Specific Restaurant' };
      const name = 'Specific Restaurant';
      mock.onGet(`exemple.com/restaurants/${name}`).reply(200, mockData);

      const result = await getRestaurantByName(name);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching restaurant by name', async () => {
      const name = 'NonExistingRestaurant';
      mock.onGet(`exemple.com/restaurants/${name}`).networkError();

      await expect(getRestaurantByName(name)).rejects.toThrow('Failed to fetch restaurant');
    });
  });

  describe('addRestaurant', () => {
    it('should add a restaurant successfully', async () => {
      const mockData = { name: 'New Restaurant' };
      const restaurantData = { name: 'New Restaurant', location: 'Some Location' };
      mock.onPost(`exemple.com/restaurants/`, restaurantData).reply(200, mockData);

      const result = await addRestaurant(restaurantData);
      expect(result).toEqual(mockData);
    });

    it('should handle errors when adding a restaurant', async () => {
      const restaurantData = { name: 'New Restaurant', location: 'Some Location' };
      mock.onPost(`exemple.com/restaurants/`, restaurantData).networkError();

      await expect(addRestaurant(restaurantData)).rejects.toThrow('Failed to add restaurant');
    });
  });

  describe('deleteRestaurantByName', () => {
    it('should delete a restaurant successfully', async () => {
      const restaurantName = 'RestaurantToDelete';
      mock.onDelete(`exemple.com/restaurants/${restaurantName}`).reply(200);

      await expect(deleteRestaurantByName(restaurantName)).resolves.not.toThrow();
    });

    it('should handle errors when deleting a restaurant', async () => {
      const restaurantName = 'NonExistingRestaurant';
      mock.onDelete(`exemple.com/restaurants/${restaurantName}`).networkError();

      await expect(deleteRestaurantByName(restaurantName)).rejects.toThrow('Failed to delete restaurant');
    });
  });
});
