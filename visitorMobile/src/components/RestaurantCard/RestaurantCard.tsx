import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, Button, Share } from 'react-native';
import styles from './RestaurantCard.styles';
import { useNavigation } from '@react-navigation/native';
import { getResto } from '../../services/restoCalls';
import { IimageInterface } from "../../models/imageInterface";
import { getImages } from "../../services/imageCalls";
import { defaultRestoImage } from "../../../assets/placeholderImagesBase64";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [ratingData, setRatingData] = useState([]);

  const { t } = useTranslation();

  let picturesId = info.picturesId;
  useEffect(() => {
    getRatingData(name)
        .then(res => setRatingData(res));
  },[]);

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
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) return;

    setIsFavorite((prevIsFavorite) => !prevIsFavorite);

    if (!isFavorite) {
      await addRestoAsFavourite(userToken, info.uid);
    } else {
      await deleteRestoFromFavourites(userToken, info.uid);
      if (deleteFavResto) deleteFavResto(info.uid);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
  const navigateToReview = () => {
    const restoName = info.name;
    navigation.navigate('RatingPage', {ratingData, restoName});
  };
  const handleShare = async () => {
    const uid = info.uid;

    try {
      const result = await Share.share({
        message: `https://guardos.eu/menu/${uid}`,
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
            <TouchableOpacity onPress={toggleModal}>
              <Icon
                name={'info'}
                size={24}
                color={'grey'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareIconContainer}
              onPress={handleShare}
            >
              <Icon name="share" size={12} color={darkMode ? 'black' : 'white'}/>
            </TouchableOpacity>
          </Text>
          <TouchableOpacity  style={styles.button} onPress={navigateToReview}>
            <Text style={{ color: '#fff'}}>{t('pages.Review.rating')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, darkMode && styles.modalContaineDark]}>
            <Image
              source={
                pictures.length > 0 && pictures[0].base64
                  ? { uri: pictures[0].base64 }
                  : { uri: defaultRestoImage }
              }
              style={styles.modalImage}
              onError={() => {
                setImageError(true);
                console.warn('Image loading error');
                return null;
              }}
            />
            <View style={[styles.headingContainer, darkMode && styles.headingContainerDarkTheme]}>
              <Text style={[styles.headingText, darkMode && styles.headingTextDarkTheme]}>
                {info && info.name}
              </Text>
              <View style={styles.starContainer}>
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = info ? info.rating || 0 : 0;
                  const isFullStar = index < Math.floor(rating);
                  const isHalfStar = index === Math.floor(rating) && rating % 1 !== 0;

                  return (
                    <Ionicons
                      key={index}
                      name={isFullStar ? 'star' : isHalfStar ? 'star-half' : 'star-outline'}
                      size={20}
                      color={isFullStar || isHalfStar ? 'gold' : 'black'}
                      style={[styles.starIcon, darkMode && styles.starIconDarkTheme]}
                    />
                  );
                })}
                <Text style={{ marginLeft: 5 }}>
                  {info && info.ratingCount}
                </Text>
              </View>
            </View>

            <View style={[styles.locationContainer, darkMode && styles.locationContainerDarkTheme]}>
              <Ionicons name="location-sharp" size={18} color={darkMode ? 'white' : 'black'} />
              <Text style={{ marginLeft: 5, color: darkMode ? 'white' : 'black' }}>
                {`${info?.location?.streetName} ${info?.location?.streetNumber}, ${info?.location?.postalCode} ${info?.location?.city}, ${info?.location?.country}`}
              </Text>
            </View>

            <Text style={{ marginTop: 10, color: darkMode ? 'white' : 'black' }}>
              {info && info.description}
            </Text>

            <View style={[styles.phoneContainer, darkMode && styles.phoneContainerDarkTheme]}>
              <Ionicons name="call-outline" size={18} color={darkMode ? 'white' : 'black'} />
              <Text style={{ marginTop: 10, marginLeft: 5, color: darkMode ? 'white' : 'black' }}>
                {info?.phoneNumber}
              </Text>
            </View>

            <View style={[styles.websiteContainer, darkMode && styles.websiteContainerDarkTheme]}>
              <Ionicons name="globe-outline" size={18} color={darkMode ? 'white' : 'black'} />
              <Text style={{ marginLeft: 5, color: darkMode ? 'white' : 'black' }}>
                {info && decodeURIComponent(info.website)}
              </Text>
            </View>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RestaurantCard;
