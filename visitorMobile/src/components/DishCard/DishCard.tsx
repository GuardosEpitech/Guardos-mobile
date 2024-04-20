import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './DishCard.styles';
import { defaultDishImage } from "../../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import {IDishFE} from '../../models/dishesInterfaces'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addDishAsFavourite, deleteDishFromFavourites} from "../../services/favourites";
import {useTranslation} from "react-i18next";

interface DishCardProps {
  restoID: number;
  dish: IDishFE;
  isFavourite: boolean;
  pictures: IimageInterface[];
}

const DishCard: React.FC<DishCardProps> = ({ restoID, dish, isFavourite, pictures, isSmallerCard }) => {
  const [isDishFavorite, setIsDishFavorite] = useState(isFavourite);
  const {t} = useTranslation();

  useEffect(() => {
    setIsDishFavorite(isFavourite);
  }, [isFavourite]);

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
      <View style={isSmallerCard ? styles.cardSmall : styles.card}>
        <Image
          source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
          style={isSmallerCard ? styles.cardImageSmall : styles.cardImage}
        />
        <View style={styles.cardContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>{dish.name}</Text>
            <TouchableOpacity onPress={handleFavoriteClick}>
              <Icon
                name={isDishFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isDishFavorite ? '#FF0000' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <Text numberOfLines={2} ellipsizeMode="tail">{dish.description}</Text>
          <Text>{t('components.DishCard.price', {price: dish.price})}</Text>
          <Text>{t('components.DishCard.allergens', {allergens: dish.allergens.join(', ')})}</Text>
        </View>
      </View>
    </React.Fragment>
  );
};

export default DishCard;
