import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import { defaultRestoImage } from "../../../assets/placeholderImagesBase64";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addRestoAsFavourite, deleteRestoFromFavourites} from "../../services/favourites";
import {useTranslation} from "react-i18next";

const RestaurantCard = ({ info, isFavouriteResto, isSmallerCard}) => {
  const navigation = useNavigation();
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavorite, setIsFavorite] = useState(isFavouriteResto);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const {t} = useTranslation();

  let picturesId = info.picturesId;
  useEffect(() => {
    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        setPictures(fetchedImages);
      } else {
        setPictures([{
          base64: defaultRestoImage,
          contentType: "image/png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    }

    fetchImages();
    fetchDarkMode();
  }, [picturesId, isFavouriteResto]);

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

    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    if (!isFavorite) {
      await addRestoAsFavourite(userToken, info.uid);
    } else {
      await deleteRestoFromFavourites(userToken, info.uid);
    }
  };

  return (
    <View style={isSmallerCard ? styles.containerSmall : styles.container}>
      <View style={isSmallerCard ? (darkMode ? styles.cardContainerSmallDarkTheme : styles.cardContainerSmall) : ( darkMode ? styles.cardContainerDarkTheme : styles.cardContainer)}>
        <Image
          style={isSmallerCard ? styles.imageStyleSmall : styles.imageStyle}
          resizeMode="contain"
          source={
            pictures.length > 0 && pictures[0].base64
              ? { uri: pictures[0].base64 }
              : { uri: defaultRestoImage }
          }
        />
        <View style={styles.infoStyle}>
          <View style={styles.titleContainer}>
            <Text style={[styles.titleStyle, darkMode && styles.titleStyleDarkTheme]} numberOfLines={1} ellipsizeMode="tail">
              {info.name}
            </Text>
            <TouchableOpacity onPress={handleFavoriteClick}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? '#FF0000' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.categoryStyle, darkMode && styles.categoryStyleDarkTheme]} numberOfLines={2} ellipsizeMode="tail">
            {info.description}
          </Text>
          <Text style = {[darkMode && styles.ratingDarkTheme]} numberOfLines={1} ellipsizeMode="tail">
            {t('components.RestaurantCard.rating', {rating: info.rating, ratingCount: info.ratingCount})}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCard;
