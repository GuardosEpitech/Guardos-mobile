import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView} from 'react-native';
import styles from './MenuPage.styles';
import {Dish, IDishFE} from '../../models/dishesInterfaces'
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import DishCard from "../../components/DishCard/DishCard";
import {getDishFavourites} from "../../services/favourites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import {useTranslation} from "react-i18next";
import {getUserAllergens} from "../../services/userCalls";
import {getRestosMenu} from "../../services/menuCalls";
import { ICategories } from "../../../../shared/models/categoryInterfaces";
import Category from "../../components/Category/Category";
import Accordion from "../../components/Accordion/Accordion";

export interface DishData {
  _id: number;
  dishes: Dish[];
}

type MenuProps = {
  route: any;
  navigation: NavigationProp<ParamListBase>;
}

const MenuPage: React.FC<MenuProps> = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const {restaurantId, restaurantName } = route.params;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [restoMenu, setRestoMenu] = React.useState([]);
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

  const fetchMenu = async () => {
    // const filter = JSON.parse(await AsyncStorage.getItem('filter') || '{}');
    // const allergenList = filter.allergenList;
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    const userAllergens = await getUserAllergens(userToken);
    const restosMenu = await getRestosMenu(restaurantId, userAllergens);
    setRestoMenu(restosMenu);
    return restosMenu;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const restosMenu : ICategories[] = await fetchMenu();

      const picturesId = restosMenu.reduce((acc, category) => {
        const categoryPicturesId = category.dishes.reduce((dishAcc, dish) => dishAcc.concat(dish.picturesId), []);
        return acc.concat(categoryPicturesId);
      }, []);

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

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {restoMenu.map((category: ICategories) => (
            <View>
              <Category title={category.name} >
                {category.dishes
                  .filter((dish: IDishFE) => dish.fitsPreference)
                  .map((dish: IDishFE, dishIndex: number) => (
                    <DishCard
                      key={dish.name + dishIndex + "-fit"}
                      restoID={restaurantId}
                      dish={dish}
                      isFavourite={isFavouriteDishs.some(fav => {
                        return fav.restoID === restaurantId && fav.dish.uid === dish.uid;
                      })}
                      pictures={pictures}
                    />
                  ))
                }
                <Accordion title={t('pages.MenuPage.show-non-compatible-dishes')}>
                  {category.dishes
                    .filter((dish: IDishFE) => !dish.fitsPreference)
                    .map((dish: IDishFE, dishIndex: number) => (
                      <DishCard
                        key={dish.name + dishIndex + "-no-fit"}
                        restoID={restaurantId}
                        dish={dish}
                        isFavourite={isFavouriteDishs.some(fav => {
                          return fav.restoID === restaurantId && fav.dish.uid === dish.uid;
                        })}
                        isSmallerCard={true}
                        pictures={pictures}
                      />
                    ))
                  }
                </Accordion>
              </Category>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default MenuPage;
