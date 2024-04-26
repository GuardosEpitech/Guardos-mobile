import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './DishCard.styles';
import { defaultDishImage } from "../../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import {Dish} from '../../models/dishesInterfaces'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addDishAsFavourite, deleteDishFromFavourites} from "../../services/favourites";

interface DishCardProps {
  restoID: number;
  dish: Dish;
  isFavourite: boolean;
  pictures: IimageInterface[];
}

const DishCard: React.FC<DishCardProps> = ({ restoID, dish, isFavourite, pictures, isSmallerCard }) => {
  const [isDishFavorite, setIsDishFavorite] = useState(isFavourite);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDishFavorite(isFavourite);
    fetchDarkMode();  
  }, [isFavourite]);

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

  const handleFavoriteClick = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    setIsDishFavorite((prevIsFavorite) => !prevIsFavorite);

    if (!isDishFavorite) {
      await addDishAsFavourite(userToken, restoID, dish.uid);
    } else {
      await deleteDishFromFavourites(userToken, restoID, dish.uid);
    }
  };

  return (
    <React.Fragment>
      <View style={isSmallerCard ? (darkMode ? styles.cardSmallDarkTheme : styles.cardSmall) : (darkMode ? styles.cardDarkTheme : styles.card)}>
        <Image
          source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
          style={isSmallerCard ? styles.cardImageSmall : styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={[styles.titleContainer, darkMode && styles.titleContainerDarkTheme]}>
            <Text style={[styles.cardTitle, darkMode && styles.cardTitleDarkTheme]}>{dish.name}</Text>
            <TouchableOpacity onPress={handleFavoriteClick}>
              <Icon
                name={isDishFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isDishFavorite ? '#FF0000' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <Text style= {[darkMode && styles.descriptionDarkTheme]} numberOfLines={2} ellipsizeMode="tail">{dish.description}</Text>
          <Text style={[darkMode && styles.priceDarkTheme]}> Price: ${dish.price}</Text>
          <Text style={[darkMode && styles.allergensDarkTheme]}>Allergens: {dish.allergens.join(', ')}</Text>
        </View>
      </View>
    </React.Fragment>
  );
};

export default DishCard;
