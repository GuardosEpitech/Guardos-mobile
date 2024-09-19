import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './AddProductScreen.styles';
import { useTranslation } from "react-i18next";

const AddProductScreen = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <View style={darkMode ? styles.containerDark : styles.container}>
      <Text style={darkMode ? styles.titleDark : styles.title}>
        {t('pages.AddProductScreen.add-product')}
      </Text>
      <ProductForm/>
    </View>
  );
};

export default AddProductScreen;
