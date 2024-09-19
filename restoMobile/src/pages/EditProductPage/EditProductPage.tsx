import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './EditProductPage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import {useTranslation} from "react-i18next";

export type RootStackParamList = {
    EditProductPage: {
      productID: number;
      productName: string;
      productIngredients: string[];
      productRestoNames: string[];
    };
  };

interface ProductPropsEdit {
    route: RouteProp<RootStackParamList, 'EditProductPage'>;
};

const EditProductPage: React.FC<ProductPropsEdit> = ({ route }) => {
  const {t} = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  useEffect(() => {
    fetchDarkMode();
  }, []);

  return (
    <View style={darkMode ? styles.containerDark : styles.container}>
      <Text style={darkMode ? styles.titleDark : styles.title}>{t('pages.EditProductPage.edit-product')}</Text>
      <ProductForm 
        productName={route.params.productName}
        productIngredients={route.params.productIngredients}
        productRestaurantNames={route.params.productRestoNames}
        productId={route.params.productID}
        editable
        />
    </View>
  );
};

export default EditProductPage;
