import React, { useState, useEffect } from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
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
import {getUserDislikedIngredients} from "../../services/userCalls";
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
  const [groupProfiles, setGroupProfiles] = useState(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavouriteDishs, setIsFavouriteDishs] = React.useState<Array<{ restoID: number, dish: IDishFE }>>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [restoMenu, setRestoMenu] = React.useState([]);
  const [dislikedIngredients, setDislikedIngredients] = React.useState([]);
  const {t} = useTranslation();
  const userProfileName: string = t('common.me') as string;

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite dish list"));
    fetchData();
    fetchDarkMode()

    const unsubscribe = navigation.addListener('focus', fetchData);

    return unsubscribe;
  }, [restaurantName, navigation]);

  const fetchGroupProfiles = async () => {
    let profile = {name: userProfileName, allergens: []};

    const groupProfilesFromStore = JSON.parse(await AsyncStorage.getItem('groupProfiles') || '[]');

    setGroupProfiles(groupProfilesFromStore);

    if (groupProfiles) {
      if (groupProfiles.length > 0) {
        profile = groupProfiles[0];
      }
    }
    setSelectedProfile(profile);
    return groupProfilesFromStore;
  }

  const handleSelectProfile = (profile: any, index: number) => {
    setSelectedProfile(profile);
    setSelectedProfileIndex(index)
  }

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

  useFocusEffect(
    React.useCallback(() => {
      fetchFavourites().then(r => console.log("Loaded favourite dish list"));
      fetchData();

      const unsubscribe = navigation.addListener('focus', fetchData);

      return unsubscribe;
    }, [])
  );

  const fetchMenu = async (groupProfilesFromStore) => {
    // const filter = JSON.parse(await AsyncStorage.getItem('filter') || '{}');
    // const allergenList = filter.allergenList;
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    const ingredients = await getUserDislikedIngredients(userToken);
    setDislikedIngredients(ingredients);
    const restosMenu = []

    for (let i = 0; i < groupProfilesFromStore?.length; i++) {
      const profileAllergens = groupProfilesFromStore[i].allergens.map((allergen) => {
        if (allergen.value || allergen.selected) return allergen.name;
      }).filter((allergen) => allergen !== undefined);
      const profileMenu = (await getRestosMenu(restaurantId, profileAllergens, ingredients))
        .filter((category: ICategories) => category.dishes.length > 0);
      restosMenu.push(profileMenu);
    }

    setRestoMenu(restosMenu);
    return restosMenu;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const groupProfilesFromStore = await fetchGroupProfiles();
      const restosMenu : ICategories[][] = await fetchMenu(groupProfilesFromStore);

      const picturesId = restosMenu[0].reduce((acc, category) => {
        const categoryPicturesId = category.dishes?.reduce((dishAcc, dish) => dishAcc.concat(dish.picturesId), []);
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

  const getCurrentMenu = () => {
    if (!restoMenu || restoMenu?.length <= selectedProfileIndex) {
      return [];
    }
    return restoMenu[selectedProfileIndex] ?? [];
  }

  return (
    <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
      {loading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <ScrollView contentContainerStyle={[styles.scrollView, darkMode && styles.scrollViewDarkTheme]}>
          <View style={styles.profileSwitcher}>
            {groupProfiles?.map((profile, index) => (
              <TouchableOpacity
                key={profile.name + index}
                style={[
                  styles.profileButton,
                  selectedProfile?.name === profile.name ? styles.activeProfileButton : null
                ]}
                onPress={() => handleSelectProfile(profile, index)}
              >
                <Text style={styles.profileButtonText}>{profile.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {getCurrentMenu().length === 0 ? (
            <Text style={[styles.noMenuText, darkMode && styles.noMenuTextDarkTheme]}>{t('pages.MenuPage.no-menu')}</Text>
          ) : getCurrentMenu().map((category: ICategories) => (
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
                      isFirstLevel={true}
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
                        dislikedIngredients={dislikedIngredients}
                        isSmallerCard={true}
                        pictures={pictures}
                        isFirstLevel={true}
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
