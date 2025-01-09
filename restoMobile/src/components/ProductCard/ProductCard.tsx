import React, { useEffect, useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './ProductCard.styles';
import { IRestaurantFrontEnd } from '../../../../shared/models/restaurantInterfaces';
import { IProductFE } from '../../../../shared/models/productInterfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { deleteProduct } from '../../services/productCalls';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { useNavigation } from '@react-navigation/native';
import { getAllResto } from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

interface ProductCardProps {
  product: IProductFE;
  onDelete: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState<IRestaurantFrontEnd[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    fetchDarkMode();
    const fetchRestaurants = async () => {
      try {
        const allRestaurants = await getAllResto();
        setRestaurants(allRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteProduct = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      await deleteProduct(product, userToken);
      onDelete(product.name);
    } catch (error) {
      console.error(error);
    } finally {
      toggleModal();
    }
  };

  const handleEdit = () => {
    const names: string[] = product.restaurantId.map((id) => restaurants.find((restaurant) => restaurant.uid === id)?.name).filter(Boolean);
    navigation.navigate('EditProductPage', {
      productID: product.id,
      productName: product.name,
      productIngredients: product.ingredients,
      productRestoNames: names,
    });
  };

  return (
    <View style={[styles.productCard, darkMode && styles.productCardDarkTheme]}>
      <View style={styles.productDetails}>
      <Text style={[styles.productName, darkMode && styles.productNameDarkTheme]}>{product.name}</Text>
        {product.allergens.length > 0 && (
          <View style={styles.pillContainer}>
            {product.allergens.map((allergen, index) => (
              <TouchableOpacity style={[styles.pill]}>
                <Text style={[styles.pillText]}>{allergen}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Text style={[styles.detailsText, darkMode && styles.detailsTextDarkTheme]}>
          {t('components.ProductCard.ingredients', {ingredients: product.ingredients.join(', ')})}
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faTrash } size={15} color="gray" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            {<FontAwesomeIcon icon={ faPen } size={15} color="gray" />}
          </TouchableOpacity>
          <ModalConfirm
            objectType={t('components.ProductCard.product')}
            isVisible={isModalVisible}
            onConfirm={handleDeleteProduct}
            onCancel={toggleModal}
          />
        </View>
      </View>
      </View>
  );
};

export default ProductCard;
