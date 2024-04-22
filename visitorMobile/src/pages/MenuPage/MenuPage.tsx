import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView} from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto } from '../../services/dishCalls';
import {Dish, IDishFE} from '../../models/dishesInterfaces'
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import DishCard from "../../components/DishCard/DishCard";
import {getDishFavourites} from "../../services/favourites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import {useTranslation} from "react-i18next";

export interface DishData {
  _id: number;
  dishes: Dish[];
}

type MenuProps = {
  route: any;
  navigation: NavigationProp<ParamListBase>;
}

const MenuPage: React.FC<MenuProps> = ({ route, navigation }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const {restaurantId, restaurantName } = route.params;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const {t} = useTranslation();

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
    fetchData();

    const unsubscribe = navigation.addListener('focus', fetchData);

    return unsubscribe;
  }, [restaurantName, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavourites().then(r => console.log("Loaded favourite dish list"));
      fetchData();

      const unsubscribe = navigation.addListener('focus', fetchData);

      return unsubscribe;
    }, [])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDishesByResto(restaurantName);
      const data: DishData[] = await response.json();

      const picturesId = data[0].dishes.reduce((acc, dish) => acc.concat(dish.picturesId), []);

      if (picturesId.length > 0) {
        const imagesResponse = await getImages(picturesId);
        const imagesData: IimageInterface[] = [];
        for (const image of imagesResponse) {
          imagesData.push(await image);
        }
        const imagesMap = imagesData.reduce((acc, image) => {
          // @ts-ignore
          acc[image._id] = image;
          return acc;
        }, {});

        // @ts-ignore
        setPictures(imagesMap);
        setDishesData(data);
      } else {
        setDishesData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favouriteDishIds = await getDishFavourites(userToken);
      setIsFavouriteDishs(favouriteDishIds);
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  // TODO: adjust for i18n
  const menuGroupOrder = ['Appetizer', 'Maindish', 'Dessert'];

  const sortedDishes = dishesData[0]?.dishes.sort((a, b) => {
    const orderA = a.category.menuGroup ? menuGroupOrder.indexOf(a.category.menuGroup) : menuGroupOrder.length;
    const orderB = b.category.menuGroup ? menuGroupOrder.indexOf(b.category.menuGroup) : menuGroupOrder.length;
    return orderA - orderB;
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {sortedDishes.map((dish, index) => (
            <React.Fragment key={dish.name + index}>
              {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                <Text style={styles.groupTitle}>{dish.category.menuGroup}</Text>
              )}
              <DishCard restoID={restaurantId} dish={dish} isFavourite={isFavouriteDishs.some(fav => {
                return fav.restoID === restaurantId && fav.dish.uid === dish.uid;
              })} pictures={pictures} />
            </React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MenuPage;
