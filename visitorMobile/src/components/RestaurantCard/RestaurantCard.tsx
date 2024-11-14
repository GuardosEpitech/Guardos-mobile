import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Button } from 'react-native';
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';
import { getResto } from '../../services/restoCalls';
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import { defaultRestoImage } from "../../../assets/placeholderImagesBase64";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addRestoAsFavourite, deleteRestoFromFavourites } from "../../services/favourites";
import { useTranslation } from "react-i18next";
import {getRatingData} from "../../services/ratingCalls";

interface RestaurantCardProps {
  info: any;
  isFavouriteResto: boolean;
  isSmallerCard: boolean;
  deleteFavResto?: (restoId: number) => void;
}

const RestaurantCard = (props: RestaurantCardProps) => {
  const navigation = useNavigation();
  const { info, isFavouriteResto, isSmallerCard, deleteFavResto } = props;  
  const { name, description, phoneNumber, website, openingHours } = info;
  const { streetName, streetNumber, postalCode, city, country } = info.location;
  const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [isFavorite, setIsFavorite] = useState(isFavouriteResto);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ratingData, setRatingData] = useState([]);

  const { t } = useTranslation();

  let picturesId = info.picturesId;
  useState(() => {
    getRatingData(name)
        .then(res => setRatingData(res));
  });

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
        setDarkMode(darkModeValue === 'true');
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  const handleFavoriteClick = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) return;

    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    if (!isFavorite) {
      await addRestoAsFavourite(userToken, info.uid);
    } else {
      await deleteRestoFromFavourites(userToken, info.uid);
      if (deleteFavResto) deleteFavResto(info.uid);
    }
  };

  const handleOpenDetails = () => {
    console.log(openingHours.length);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };


  const averageRating = () => {
    let sum = 0;
    if (Array.isArray(ratingData)) {
      ratingData.forEach((data) => {
        if (data.note === undefined) {
          sum += 0;
        } else {
          sum += data.note;
        }
      });
      return parseFloat((sum / ratingData.length).toFixed(1));
    } else {
      return sum;
    }
  };
  console
  const navigateToReview = () => {
    const restoName = info.name
    navigation.navigate('RatingPage', {ratingData, restoName});
  };

  return (
    <View style={isSmallerCard ? styles.containerSmall : styles.container}>
      <View style={isSmallerCard ? (darkMode ? styles.cardContainerSmallDarkTheme : styles.cardContainerSmall) : (darkMode ? styles.cardContainerDarkTheme : styles.cardContainer)}>
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
                size={20}
                color={isFavorite ? '#FF0000' : '#000000'}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.categoryStyle, darkMode && styles.categoryStyleDarkTheme]} numberOfLines={2} ellipsizeMode="tail">
            {info.description}
          </Text>
          <Text style={[darkMode && styles.ratingDarkTheme]} numberOfLines={1} ellipsizeMode="tail">
            {t('components.RestaurantCard.rating', { rating: ratingData.length === 0 ? "0" : averageRating(), ratingCount: ratingData.length})}
            <TouchableOpacity onPress={handleOpenDetails}>
              <Icon
                name={'info'}
                size={24}
                color={'grey'}
              />
            </TouchableOpacity>
          </Text>
          <TouchableOpacity  style={styles.button} onPress={navigateToReview}>
            <Text style={{ color: '#fff'}}>Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalBackground, darkMode && styles.modalBackgroundDark]}>
          <View style={[styles.modalContainer, darkMode && styles.modalContaineDark]}>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]} > 
              {name}
            </Text>
            <Icon name="star" size={20} color={darkMode ? "grey" : "#000"} style={styles.Icon}/>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>
              {t('components.RestaurantCard.rating', { rating: info.rating, ratingCount: info.ratingCount })}
            </Text>
            <Icon name="location-on" size={20} color={darkMode ? "grey" : "#000"} style={styles.Icon}/>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>
                {address}
            </Text>
            <Icon name="phone" size={20} color={darkMode ? "grey" : "#000"} style={styles.Icon}/>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>{
              phoneNumber}
            </Text>
            <Icon name="web" size={20} color={darkMode ? "grey" : "#000"} style={styles.Icon}/>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>
              {website}
            </Text>
            <Icon name="info" size={20} color={darkMode ? "grey" : "#000"} style={styles.Icon}/>
            <Text style={[styles.modalText, darkMode && styles.modalTextDark]}>
              {description}
            </Text>
            <Button title={t('common.close')} onPress={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RestaurantCard;
