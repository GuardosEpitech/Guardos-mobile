// __tests__/MenuPage.test.tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import MenuPage from '../../src/pages/MenuPage/MenuPage';
import { getDishesByResto } from '../../src/services/dishCalls';
import { getImages } from '../../src/services/imageCalls';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../src/services/dishCalls');
jest.mock('../../src/services/imageCalls');

const mockRoute = {
  params: {
    restaurantId: 1,
    restaurantName: 'Test Restaurant',
  },
};

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn().mockImplementation((event, callback) => {
    if (event === 'focus') {
      callback();
    }
    return jest.fn();
  }),
};

const dishesData = [
  {
    _id: 1,
    dishes: [
      {
        name: 'Test Dish 1',
        description: 'Test Description 1',
        price: 10,
        allergens: ['Milk', 'Peanut'],
        picturesId: [1],
        category: {
          menuGroup: 'Appetizer',
        },
      },
      {
        name: 'Test Dish 2',
        description: 'Test Description 2',
        price: 15,
        allergens: ['Eggs', 'Shellfish'],
        picturesId: [2],
        category: {
          menuGroup: 'Maindish',
        },
      },
    ],
  },
];

const imagesData = [
  { _id: 1, base64: 'data:image/png;base64,testimage1' },
  { _id: 2, base64: 'data:image/png;base64,testimage2' },
];

describe('MenuPage', () => {
  beforeEach(() => {
    (getDishesByResto as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(dishesData),
    });
    (getImages as jest.Mock).mockResolvedValue(imagesData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getByText } = render(
      <NavigationContainer>
        <MenuPage route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders dishes correctly after loading', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <MenuPage route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => expect(queryByText('Loading...')).toBeFalsy());

    expect(getByText('Appetizer')).toBeTruthy();
    expect(getByText('Test Dish 1')).toBeTruthy();
    expect(getByText('Test Description 1')).toBeTruthy();
    expect(getByText('Price: $10')).toBeTruthy();
    expect(getByText('Allergens: Milk, Peanut')).toBeTruthy();

    expect(getByText('Maindish')).toBeTruthy();
    expect(getByText('Test Dish 2')).toBeTruthy();
    expect(getByText('Test Description 2')).toBeTruthy();
    expect(getByText('Price: $15')).toBeTruthy();
    expect(getByText('Allergens: Eggs, Shellfish')).toBeTruthy();
  });

  it('toggles dish description on press', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <MenuPage route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => expect(queryByText('Loading...')).toBeFalsy());

    const dish1Description = getByText('Test Description 1');
    fireEvent.press(dish1Description);

    expect(dish1Description.props.numberOfLines).toBeUndefined();

    fireEvent.press(dish1Description);
    expect(dish1Description.props.numberOfLines).toBe(1);
  });

  it('scrolls to section on button press', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <MenuPage route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => expect(queryByText('Loading...')).toBeFalsy());

    const appetizerButton = getByText('Appetizer');
    const maindishButton = getByText('Maindish');
    const dessertButton = getByText('Dessert');

    fireEvent.press(appetizerButton);
    // You can add more assertions to check the scrolling behavior
    fireEvent.press(maindishButton);
    fireEvent.press(dessertButton);
  });
});
