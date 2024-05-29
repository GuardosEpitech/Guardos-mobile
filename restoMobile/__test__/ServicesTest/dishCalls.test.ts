import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    getAllDishes,
    deleteDishByName,
    changeDishByName,
    addDish,
    getDishesByUser,
    getDishesByResto
} from 'src/services/dishCalls'; // Adjust the path accordingly

const mock = new MockAdapter(axios);

describe('restoCalls', () => {
    afterEach(() => {
        mock.reset();
    });

    describe('getAllDishes', () => {
        it('should fetch all dishes successfully', async () => {
            const mockData = [{ name: 'Dish 1' }, { name: 'Dish 2' }];
            mock.onGet("exemple.com").reply(200, mockData);

            const result = await getAllDishes();

            expect(result).toEqual(mockData);
        });

        it('should handle errors when fetching all dishes', async () => {
            mock.onGet("exemple.com").reply(500);

            await expect(getAllDishes()).rejects.toThrow('Failed to fetch all dishes');
        });
    });

    describe('deleteDishByName', () => {
        it('should delete a dish successfully', async () => {
            const mockData = { success: true };
            const restaurant = 'testRestaurant';
            const name = 'testDish';
            mock.onDelete("exemple.com" + restaurant).reply(200, mockData);

            const result = await deleteDishByName(restaurant, name);

            expect(result).toEqual(mockData);
        });

        it('should handle errors when deleting a dish', async () => {
            const restaurant = 'testRestaurant';
            const name = 'testDish';
            mock.onDelete("exemple.com" + restaurant).reply(500);

            await expect(deleteDishByName(restaurant, name)).rejects.toThrow('Failed to delete dish');
        });
    });

    describe('changeDishByName', () => {
        it('should change a dish successfully', async () => {
            const mockData = { success: true };
            const dish = { name: 'testDish', price: 10 };
            const restaurant = 'testRestaurant';
            mock.onPut("exemple.com" + restaurant).reply(200, mockData);

            const result = await changeDishByName(dish, restaurant);

            expect(result).toEqual(mockData);
        });

        it('should handle 404 error when changing a dish', async () => {
            const dish = { name: 'testDish', price: 10 };
            const restaurant = 'testRestaurant';
            mock.onPut("exemple.com" + restaurant).reply(404);

            const result = await changeDishByName(dish, restaurant);

            expect(result).toBeNull();
        });

        it('should handle other errors when changing a dish', async () => {
            const dish = { name: 'testDish', price: 10 };
            const restaurant = 'testRestaurant';
            mock.onPut("exemple.com" + restaurant).reply(500);

            const result = await changeDishByName(dish, restaurant);

            expect(result).toBe('ERROR');
        });
    });

    describe('addDish', () => {
        it('should add a dish successfully', async () => {
            const mockData = { success: true };
            const dish = { name: 'testDish', price: 10 };
            const restaurant = 'testRestaurant';
            mock.onPost("exemple.com" + restaurant).reply(200, mockData);

            const result = await addDish(dish, restaurant);

            expect(result).toEqual(mockData);
        });

        it('should handle errors when adding a dish', async () => {
            const dish = { name: 'testDish', price: 10 };
            const restaurant = 'testRestaurant';
            mock.onPost("exemple.com" + restaurant).reply(500);

            const result = await addDish(dish, restaurant);

            expect(result).toBe('ERROR');
        });
    });

    describe('getDishesByUser', () => {
        it('should fetch dishes by user successfully', async () => {
            const mockData = [{ name: 'Dish 1' }, { name: 'Dish 2' }];
            const userToken = 'testToken';
            mock.onGet("exemple.com" + 'user/dish', { params: { key: userToken } }).reply(200, mockData);

            const result = await getDishesByUser(userToken);

            expect(result).toEqual(mockData);
        });

        it('should handle errors when fetching dishes by user', async () => {
            const userToken = 'testToken';
            mock.onGet("exemple.com" + 'user/dish', { params: { key: userToken } }).reply(500);

            await expect(getDishesByUser(userToken)).rejects.toThrow('Failed to fetch all dishes from user');
        });
    });

    describe('getDishesByResto', () => {
        it('should fetch dishes by restaurant successfully', async () => {
            const mockResponse = new Response(JSON.stringify([{ name: 'Dish 1' }, { name: 'Dish 2' }]), {
                status: 200,
                headers: { 'Content-type': 'application/json' },
            });
            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const restaurantName = 'testRestaurant';
            const result = await getDishesByResto(restaurantName);

            expect(result.status).toBe(200);
        });

        it('should handle errors when fetching dishes by restaurant', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

            const restaurantName = 'testRestaurant';
            await expect(getDishesByResto(restaurantName)).rejects.toThrow('Failed to fetch');
        });
    });
});
