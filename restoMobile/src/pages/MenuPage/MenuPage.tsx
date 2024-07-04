import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import styles from './MenuPage.styles';
import { getDishesByResto, deleteDishByName } from '../../services/dishCalls';
import { Dish } from 'src/models/dishesInterfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getImages } from "../../services/imagesCalls";
import { defaultDishImage } from "../../assets/placeholderImagesBase64";
import { IimageInterface } from "../../models/imageInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

export interface DishData {
  _id: number;
  dishes: Dish[];
}

const MenuPage: React.FC = ({ route }) => {
  const [dishesData, setDishesData] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { restaurantName } = route.params;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [picturesId, setPicturesId] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const {t} = useTranslation();

  useEffect(() => {
    fetchDarkMode();
    fetchData();
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDishesByResto(restaurantName);
      const data: DishData[] = await response.json();

      const picturesId = data[0].dishes.reduce((acc, dish) => acc.concat(dish.picturesId), []);
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
        setDishesData(data);
      } else {
        setDishesData(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: adjust for i18n
  const menuGroupOrder = ['Appetizer', 'Maindish', 'Dessert'];

  const sortedDishes = dishesData[0]?.dishes.sort((a, b) => {
    const orderA = a.category.menuGroup ? menuGroupOrder.indexOf(a.category.menuGroup) : menuGroupOrder.length;
    const orderB = b.category.menuGroup ? menuGroupOrder.indexOf(b.category.menuGroup) : menuGroupOrder.length;
    return orderA - orderB;
  });

  const handleDelete = (dish: Dish) => {
    setSelectedDish(dish);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selectedDish) {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      await deleteDishByName(restaurantName, selectedDish.name, userToken);
      setShowConfirmation(false);
      fetchData();
    }
  };

  // @ts-ignore
  return (
    <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
      {loading ? (
        <Text>{t('common.loading')}</Text>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollView} horizontal={false} scrollEnabled={true}>
            {sortedDishes.map((dish, index) => (
              <React.Fragment key={dish.name+index}>
                {(index === 0 || sortedDishes[index - 1].category.menuGroup !== dish.category.menuGroup) && (
                  <Text style={[styles.groupTitle, darkMode && styles.groupTitleDarkTheme]}>{dish.category.menuGroup}</Text>
                )}
                <View style={[styles.card && darkMode && styles.cardDarkTheme]}>
                  <Image
                    source={{ uri: pictures[dish.picturesId[0]]?.base64 || defaultDishImage }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, darkMode && styles.cardTitleDarkTheme]}>{dish.name}</Text>
                    <Text>{dish.description}</Text>
                    <Text>{t('pages.MenuPage.price', {price: dish.price})}</Text>
                    <Text>{t('pages.MenuPage.allergens', {allergens: dish.allergens.join(', ')})}</Text>
                    <TouchableOpacity onPress={() => handleDelete(dish)} style={styles.deleteButton}>
                      <FontAwesomeIcon icon={faTrash} />
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </ScrollView>
          <Modal visible={showConfirmation} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text>{t('pages.MenuPage.confirm-delete-dish')}</Text>
                <View style={styles.modalButtons}>
                  <Button title={t('common.cancel')} onPress={() => setShowConfirmation(false)} />
                  <Button title={t('common.delete')} onPress={confirmDelete} />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default MenuPage;
