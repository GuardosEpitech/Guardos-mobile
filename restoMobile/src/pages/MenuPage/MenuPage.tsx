import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, Linking, TouchableOpacity} from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto, deleteDishByName } from '../../services/dishCalls';
import { Dish } from 'src/models/dishesInterfaces';
import DishCard from "../../components/DishCard/DishCard"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { IDishFE } from '../../../../shared/models/dishInterfaces';
import {Ionicons} from "@expo/vector-icons";
import Header from "../../components/Header";
import {useNavigation} from "@react-navigation/native";
import {restoByName} from "../../services/restoCalls";


export interface DishData {
  _id: number;
  dishes: Dish[];
}

const MenuPage: React.FC = ({ route }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const { restaurantName } = route.params;
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigation = useNavigation();
  const [restaurantData, setRestaurantData] = useState({uid: 1});


  const { t } = useTranslation();

  function transformDishToIDishFE(dish: Dish, restoName: string): IDishFE {
    return {
      name: dish.name,
      uid: dish.uid,
      description: dish.description,
      price: dish.price,
      allergens: dish.allergens,
      pictures: dish.pictures ? [...dish.pictures] : undefined,
      picturesId: dish.picturesId ? [...dish.picturesId] : undefined,
      category: {
        menuGroup: dish.category.menuGroup,
        foodGroup: dish.category.foodGroup,
        extraGroup: dish.category.extraGroup ? [...dish.category.extraGroup] : [],
      },
      resto: restoName,
      products: dish.products ? [...dish.products] : [],
      discount: dish.discount,
      validTill: dish.validTill,
      combo: dish.combo ? [...dish.combo] : [],
    };
  }

  useEffect(() => {
    fetchDarkMode();
    fetchData();
    restoByName(restaurantName)
        .then(res => setRestaurantData(res));
  }, []);

  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDishesByResto(restaurantName);
      const data: DishData[] = await response.json();

      setDishesData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuGroupOrder = ['Appetizer', 'Maindish', 'Dessert'];

  const sortedDishes = dishesData[0]?.dishes.sort((a, b) => {
    const orderA = a.category.menuGroup ? menuGroupOrder.indexOf(a.category.menuGroup) : menuGroupOrder.length;
    const orderB = b.category.menuGroup ? menuGroupOrder.indexOf(b.category.menuGroup) : menuGroupOrder.length;
    return orderA - orderB;
  });

  const handleDelete = async (dishName: string, restoName: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }

    await deleteDishByName(restoName, dishName, userToken);
    fetchData();
  };

  const handlePressQR = () => {
    const url = `https://backend.guardos.eu/api/qrcode/base64/${restaurantData.uid}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
      <Header label={restaurantName}
              leftIcon={<Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />} />
      {loading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {sortedDishes.length === 0 ? (
              <Text style={[styles.noMenuText, darkMode && styles.noMenuTextDarkTheme]}>{t('pages.MenuPage.no-menu')}</Text>
            ) : sortedDishes.map((dish, index) => (
              <React.Fragment key={dish.name + index}>
                {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                  <Text style={[styles.groupTitle, darkMode && styles.groupTitleDarkTheme]}>{dish.category.menuGroup}</Text>
                )}
                <DishCard
                  dish={transformDishToIDishFE(dish, restaurantName)}
                  onDelete={handleDelete}
                  isFirstLevel={true}
                />
              </React.Fragment>
            ))}
            <TouchableOpacity onPress={handlePressQR} style={styles.QrCodeButton}>
              <Text style={{ color: '#fff', fontSize: 16,  }}>{t('pages.MenuPage.get-qr-code')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default MenuPage;
