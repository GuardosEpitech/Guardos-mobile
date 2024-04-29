import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';
import { getImages } from '../services/imagesCalls';
import { IimageInterface } from '../models/imageInterface';
import { defaultRestoImage } from "../assets/placeholderImagesBase64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

const RestaurantCard = ({ info, onDelete }) => {
  const navigation = useNavigation();
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    fetchDarkMode();  
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
  const {t} = useTranslation();

  const handleDelete = () => {
    onDelete(info.name);
  };

  const handleEdit = () => {
    navigation.navigate('EditRestaurant', { restaurantId: info.name });
  };

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
  }, [picturesId]);

  return (
    <View style={styles.container}>
    <View style={[styles.cardContainer, darkMode && styles.cardContainerDarkTheme]}>
      <Image
          style={styles.imageStyle}
          resizeMode="contain"
          source={
            pictures.length > 0 && pictures[0].base64
              ? { uri: pictures[0].base64 }
              : { uri: defaultRestoImage }
          }
        />
        <View style={styles.infoStyle}>
          <Text style={[styles.titleStyle, darkMode && styles.titleStyleDarkTheme]} numberOfLines={1} ellipsizeMode="tail">
            {info.name}
          </Text>
          <Text style={[styles.categoryStyle, darkMode && styles.categoryStyleDarkTheme]} numberOfLines={2} ellipsizeMode="tail">
            {info.description}
          </Text>
          <Text style={[darkMode && styles.ratingDarkTheme]}numberOfLines={1} ellipsizeMode="tail">
            {t('components.RestaurantCard.rating', { rating: info.rating, ratingCount: info.ratingCount})}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faTrash } size={15} color="gray" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faPen } size={15} color="gray" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RestaurantCard;
