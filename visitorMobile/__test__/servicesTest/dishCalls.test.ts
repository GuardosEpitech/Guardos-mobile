// __tests__/dishes.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getAllDishes,
  deleteDishByName,
  changeDishByName,
  addDish,
  getDishesByUser,
  getDishesByResto
} from '../../src/services/dishCalls';
import { IDishFE } from "../../../shared/models/dishInterfaces";

const API_URL = 'https://api.example.com/';

describe('Dishes API calls', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should fetch all dishes', async () => {
    const data = [{ name: 'Dish1' }, { name: 'Dish2' }];
    mock.onGet("exemple.com/").reply(200, data);

    const response = await getAllDishes();
    expect(response).toEqual(data);
  });

  it('should handle error in fetching all dishes', async () => {
    mock.onGet("exemple.com/").networkError();

    await expect(getAllDishes()).rejects.toThrow('Failed to fetch all dishes');
  });

  it('should delete a dish by name', async () => {
    const responseMessage = { message: 'Deleted successfully' };
    mock.onDelete(`${"exemple.com/"}restaurant1`).reply(200, responseMessage);

    const response = await deleteDishByName('restaurant1', 'Dish1');
    expect(response).toEqual(responseMessage);
  });

  it('should handle error in deleting a dish', async () => {
    mock.onDelete(`${"exemple.com/"}restaurant1`).networkError();

    await expect(deleteDishByName('restaurant1', 'Dish1')).rejects.toThrow('Failed to delete dish');
  });

  it('should change a dish by name', async () => {
    const dish: IDishFE = { name: 'Dish1', price: 10 };
    const responseMessage = { message: 'Changed successfully' };
    mock.onPut(`${"exemple.com/"}restaurant1`).reply(200, responseMessage);

    const response = await changeDishByName(dish, 'restaurant1');
    expect(response).toEqual(responseMessage);
  });

  it('should handle 404 error in changing a dish', async () => {
    const dish: IDishFE = { name: 'Dish1', price: 10 };
    mock.onPut(`${"exemple.com/"}restaurant1`).reply(404);

    const response = await changeDishByName(dish, 'restaurant1');
    expect(response).toBeNull();
  });

  it('should handle other errors in changing a dish', async () => {
    const dish: IDishFE = { name: 'Dish1', price: 10 };
    mock.onPut(`${"exemple.com/"}restaurant1`).networkError();

    const response = await changeDishByName(dish, 'restaurant1');
    expect(response).toEqual('ERROR');
  });

  it('should add a dish', async () => {
    const dish: IDishFE = { name: 'Dish1', price: 10 };
    const responseMessage = { message: 'Added successfully' };
    mock.onPost(`${"exemple.com/"}restaurant1`).reply(200, responseMessage);

    const response = await addDish(dish, 'restaurant1');
    expect(response).toEqual(responseMessage);
  });

  it('should handle error in adding a dish', async () => {
    const dish: IDishFE = { name: 'Dish1', price: 10 };
    mock.onPost(`${"exemple.com/"}restaurant1`).networkError();

    const response = await addDish(dish, 'restaurant1');
    expect(response).toEqual('ERROR');
  });

  it('should fetch dishes by user', async () => {
    const data = [{ name: 'Dish1' }, { name: 'Dish2' }];
    const userToken = 'user-token';
    mock.onGet(`${"exemple.com/"}user/dish`).reply(200, data);

    const response = await getDishesByUser(userToken);
    expect(response).toEqual(data);
  });

  it('should handle error in fetching dishes by user', async () => {
    const userToken = 'user-token';
    mock.onGet(`${"exemple.com/"}user/dish`).networkError();

    await expect(getDishesByUser(userToken)).rejects.toThrow('Failed to fetch all dishes from user');
  });

  it('should fetch dishes by restaurant', async () => {
    const data = [{ name: 'Dish1' }, { name: 'Dish2' }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
      })
    ) as jest.Mock;

    const response = await getDishesByResto('restaurant1');
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual(data);
  });
});
