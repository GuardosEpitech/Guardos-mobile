import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import EditDish from 'src/pages/EditDishScreen/EditDish';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllProducts } from 'src/services/productCalls';
import { getAllRestaurantsByUser, getRestaurantByName } from 'src/services/restoCalls';
import { addDish, changeDishByName } from 'src/services/dishCalls';
import {
  addImageDish,
  deleteImageDish,
  getImages,
} from 'src/services/imagesCalls';
import { defaultDishImage } from 'src/assets/placeholderImagesBase64';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(),
}));

jest.mock('src/services/productCalls', () => ({
  getAllProducts: jest.fn(),
}));

jest.mock('src/services/restoCalls', () => ({
  getAllRestaurantsByUser: jest.fn(),
  getRestaurantByName: jest.fn(),
}));

jest.mock('src/services/dishCalls', () => ({
  addDish: jest.fn(),
  changeDishByName: jest.fn(),
}));

jest.mock('src/services/imagesCalls', () => ({
  addImageDish: jest.fn(),
  deleteImageDish: jest.fn(),
  getImages: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('EditDish', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue(mockNavigation);
    AsyncStorage.getItem.mockResolvedValue('mockToken');
    getAllProducts.mockResolvedValue([]);
    getAllRestaurantsByUser.mockResolvedValue([]);
    getRestaurantByName.mockResolvedValue({ categories: [] });
    getImages.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const route = {
    params: {
      restaurantName: 'Test Restaurant',
      dish: {
        name: 'Test Dish',
        price: 10,
        description: 'Test Description',
        pictures: [],
        picturesId: [],
        allergens: [],
        products: [],
        category: { menuGroup: 'Test Category' },
        resto: 'Test Restaurant',
      },
    },
  };

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<EditDish route={route} />);

    expect(getByText('Guardos')).toBeTruthy();
    expect(getByText('Save')).toBeTruthy();
    expect(getByPlaceholderText('Dish name')).toBeTruthy();
    expect(getByPlaceholderText('Price')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
  });

  it('handles image change', async () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      cancelled: false,
      assets: [{ uri: 'test-uri' }],
    });
    addImageDish.mockResolvedValue(1);

    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Change'));
    });

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(addImageDish).toHaveBeenCalledWith(
        'Test Restaurant',
        'Test Dish',
        'DishImage',
        'image/png',
        1,
        'test-uri'
      );
    });
  });

  it('handles image delete', async () => {
    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });

    await waitFor(() => {
      expect(deleteImageDish).toHaveBeenCalledWith(0, 'Test Restaurant', 'Test Dish');
    });
  });

  it('handles adding a product', async () => {
    getAllProducts.mockResolvedValue([{ name: 'Test Product' }]);

    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Add new product'));
    });

    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalled();
    });
  });

  it('handles adding a category', async () => {
    getRestaurantByName.mockResolvedValue({ categories: [{ name: 'Test Category' }] });

    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Add new category'));
    });

    await waitFor(() => {
      expect(getRestaurantByName).toHaveBeenCalledWith('Test Restaurant');
    });
  });

  it('handles adding a restaurant', async () => {
    getAllRestaurantsByUser.mockResolvedValue([{ name: 'Test Restaurant' }]);

    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Add new restaurant'));
    });

    await waitFor(() => {
      expect(getAllRestaurantsByUser).toHaveBeenCalledWith({ key: 'mockToken' });
    });
  });

  it('handles saving the dish', async () => {
    changeDishByName.mockResolvedValue({ name: 'Test Dish' });

    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    await waitFor(() => {
      expect(changeDishByName).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyDishesScreen');
    });
  });

  it('shows an error alert if mandatory fields are missing', async () => {
    const { getByText } = render(<EditDish route={route} />);
    route.params.dish.name = ''; // Make name empty to trigger error

    await act(async () => {
      fireEvent.press(getByText('Save'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'All fields are mandatory.');
    });
  });

  it('renders with a placeholder image if no images are available', async () => {
    route.params.dish.picturesId = [];
    const { getByText, getByAltText } = render(<EditDish route={route} />);

    await waitFor(() => {
      expect(getByAltText('placeholder')).toBeTruthy();
    });
  });

  it('toggles modal visibility for adding products, allergens, categories, and restaurants', async () => {
    const { getByText } = render(<EditDish route={route} />);

    await act(async () => {
      fireEvent.press(getByText('Add new product'));
    });

    expect(getByText('Products')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Close'));
    });

    await act(async () => {
      fireEvent.press(getByText('Add new allergens'));
    });

    expect(getByText('Allergens')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Close'));
    });

    await act(async () => {
      fireEvent.press(getByText('Add new category'));
    });

    expect(getByText('Categories')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Close'));
    });

    await act(async () => {
      fireEvent.press(getByText('Add new restaurant'));
    });

    expect(getByText('Restaurants')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Close'));
    });
  });

  it('toggles product selection', async () => {
    const { getByText } = render(<EditDish route={route} />);
    await act(async () => {
      fireEvent.press(getByText('Add new product'));
    });

    const productButton = getByText('Test Product');
    await act(async () => {
      fireEvent.press(productButton);
    });

    expect(productButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'lightgray' }));

    await act(async () => {
      fireEvent.press(productButton);
    });

    expect(productButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'white' }));
  });

  it('toggles allergen selection', async () => {
    const { getByText } = render(<EditDish route={route} />);
    await act(async () => {
      fireEvent.press(getByText('Add new allergens'));
    });

    const allergenButton = getByText('Test Allergen');
    await act(async () => {
      fireEvent.press(allergenButton);
    });

    expect(allergenButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'lightgray' }));

    await act(async () => {
      fireEvent.press(allergenButton);
    });

    expect(allergenButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'white' }));
  });

  it('toggles category selection', async () => {
    const { getByText } = render(<EditDish route={route} />);
    await act(async () => {
      fireEvent.press(getByText('Add new category'));
    });

    const categoryButton = getByText('Test Category');
    await act(async () => {
      fireEvent.press(categoryButton);
    });

    expect(categoryButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'lightgray' }));

    await act(async () => {
      fireEvent.press(categoryButton);
    });

    expect(categoryButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'white' }));
  });

  it('toggles restaurant selection', async () => {
    const { getByText } = render(<EditDish route={route} />);
    await act(async () => {
      fireEvent.press(getByText('Add new restaurant'));
    });

    const restaurantButton = getByText('Test Restaurant');
    await act(async () => {
      fireEvent.press(restaurantButton);
    });

    expect(restaurantButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'lightgray' }));

    await act(async () => {
      fireEvent.press(restaurantButton);
    });

    expect(restaurantButton.parent.props.style).toContainEqual(expect.objectContaining({ backgroundColor: 'white' }));
  });
});
