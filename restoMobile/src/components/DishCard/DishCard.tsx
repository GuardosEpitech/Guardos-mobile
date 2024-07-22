import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { useNavigation } from '@react-navigation/native';
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import styles from "./DishCard.style";
import { getImages } from "../../services/imagesCalls";
import { defaultDishImage, defaultRestoImage } from "../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

interface DishCardProps {
  dish: IDishFE;
  onDelete: any;
  onDiscount: any;
}

const whatToDelete = "dish";

const DishCard: React.FC<DishCardProps> = ({ dish, onDelete, onDiscount }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { t } = useTranslation();

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

  if (!dish) {
    return null;
  }

  if (dish.name.length === 0) {
    dish.name = t('components.DishCard.no-name') as string;
  }
  if (dish.description.length === 0) {
    dish.description = t('components.DishCard.no-desciption') as string;
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteDish = async () => {
    try {
      onDelete(dish.name, dish.resto);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      toggleModal();
    }
  };

  let picturesId = dish.picturesId;
  useEffect(() => {
    async function fetchImages() {
      if (picturesId.length > 0) {
        const fetchedImages = await getImages(picturesId);
        setPictures(fetchedImages);
      } else {
        setPictures([{
          base64: defaultDishImage,
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

//  const handleEdit = () => {
//    const names: string[] = product.restaurantId.map((id) => restaurants.find((restaurant) => restaurant.id === id)?.name).filter(Boolean);
//    navigation.navigate('EditProductPage', {
//      productID: product.id,
//      productName: product.name,
//      productIngredients: product.ingredients,
//      productRestoNames: names,
//    });
//  };
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
        <View style={[styles.infoStyle, darkMode && styles.infoStyleDarkTheme]}>
          <Text style={[styles.titleStyle, darkMode && styles.titleStyleDarkTheme]} numberOfLines={1} ellipsizeMode="tail">
            {dish.name}
          </Text>
          <Text style={[styles.categoryStyle, darkMode && styles.categoryStyleDarkTheme]} numberOfLines={2} ellipsizeMode="tail">
            {dish.description} {/* Add a description field or similar*/}
          </Text>
          {dish.discount !== undefined && dish.discount !== -1 ? (
            <Text>Discount available: {dish.discount}%</Text>
          ) : (
            <Text>No discount available</Text>
          )}
        </View>
        <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onDiscount} style={styles.iconButton}>
            <FontAwesomeIcon icon={faPercentage} size={15} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
            <FontAwesomeIcon icon={faTrash} size={15} color="gray" />
          </TouchableOpacity>
          <ModalConfirm
            whatToDelete={whatToDelete}
            isVisible={isModalVisible}
            onConfirm={handleDeleteDish}
            onCancel={toggleModal}
          />
        </View>
      </View>
    </View>
  );
};
export default DishCard;
