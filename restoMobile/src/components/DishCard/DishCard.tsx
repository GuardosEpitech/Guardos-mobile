import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faPlus, faPercentage } from '@fortawesome/free-solid-svg-icons';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { useNavigation } from '@react-navigation/native';
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import styles from "./DishCard.style";
import { getImages } from "../../services/imagesCalls";
import { defaultDishImage, defaultRestoImage } from "../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { getDishesByID } from '../../../src/services/dishCalls';

interface DishCardProps {
  dish: IDishFE;
  onDelete: any;
  isFirstLevel: boolean;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onDelete, isFirstLevel }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAccordionOpen, setAccordionOpen] = useState<boolean>(false);
  const [comboDishes, setComboDishes] = useState<IDishFE[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDishesByID = async () => {
      const dishes = await getDishesByID(dish.resto, { ids: dish.combo });
      setComboDishes(dishes);
    }
    fetchDarkMode();
    if (dish.combo && dish.combo.length > 0 && isFirstLevel) {
      fetchDishesByID();
    }
    dish.allergens = Array.from(new Set(dish.allergens.filter((allergen) => allergen !== 'Failed to detect allergens')));
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
    dish.description = t('components.DishCard.no-description') as string;
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const navigateCombo = () => {
    navigation.navigate('MyDishCombination', { dish });
  }

  const navigateDiscount = () => {
    navigation.navigate('Manage Discount', { dish });
  }

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

  const handleAccordionToggle = () => {
    setAccordionOpen(!isAccordionOpen);
  };

  return (
    <View style={isFirstLevel ? styles.container : styles.comboContainer}>
      <View style={isFirstLevel ? (darkMode ? styles.cardContainerDarkTheme : styles.cardContainer) : (darkMode ? styles.comboCardContainerDarkTheme : styles.comboCardContainer)}>
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
          {dish.allergens.length > 0 && (
            <View style={styles.pillContainer}>
              {dish.allergens.map((allergen, index) => (
                <TouchableOpacity style={[styles.pill]}>
                  <Text style={[styles.pillText]}>{allergen}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={[styles.categoryStyle, darkMode && styles.categoryStyleDarkTheme]} numberOfLines={2} ellipsizeMode="tail">
            {dish.description} 
          </Text>
          {dish.discount !== undefined && dish.discount !== -1 ? (
            <View style={styles.discountContainer}>
              <Text style={darkMode? styles.discountDark : styles.discount}>
                {t('components.DishCard.price')}{dish.price.toFixed(2)}€</Text>
              <Text style={darkMode ? styles.priceDark : styles.price}>
                {t('components.DishCard.discount')}{dish.discount.toFixed(2)} €</Text>
              <Text style={darkMode ? styles.priceDark : styles.price}>
                {t('components.DishCard.valid')}{dish.validTill}</Text>
            </View>
          ) : (
            <Text style={darkMode ? styles.priceDark : styles.price}>
              {t('components.DishCard.price')}{dish.price.toFixed(2)}€</Text>
          )}
        </View>
        {isFirstLevel && (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={navigateDiscount} style={styles.iconButton}>
            <FontAwesomeIcon icon={faPercentage} size={15} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
            <FontAwesomeIcon icon={faTrash} size={15} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateCombo} style={styles.iconButton}>
            <FontAwesomeIcon icon={faPlus} size={15} color="gray" />
          </TouchableOpacity>
          <ModalConfirm
            objectType={t('components.DishCard.dish')}
            isVisible={isModalVisible}
            onConfirm={handleDeleteDish}
            onCancel={toggleModal}
          />
        </View>
        )}

        {dish.combo && dish.combo.length > 0 && isFirstLevel && (
          <View style={darkMode ? styles.accordionContainerDark : styles.accordionContainer}>
            <TouchableOpacity onPress={handleAccordionToggle} 
              style={darkMode ? styles.accordionHeaderDark : styles.accordionHeader}>
              <Text style={darkMode ? styles.accordionHeaderTextDark : styles.accordionHeaderText}>
                {isAccordionOpen ? t('components.DishCard.hide') : t('components.DishCard.show')}
              </Text>
            </TouchableOpacity>
            {isAccordionOpen && (
              <View style={darkMode ? styles.comboContainerDark : styles.comboContainer}>
                {comboDishes.map((comboDish) => (
                  <DishCard
                    key={comboDish.uid + "combo" + dish.uid}
                    dish={comboDish}
                    onDelete={onDelete}
                    isFirstLevel={false}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default DishCard;
