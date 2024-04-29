import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Category.styles';

const Category = ({ title, children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    fetchDarkMode();
  })

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
    <View style={styles.categoryBox}>
      <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{title}</Text>
      {children}
    </View>
  );
};

export default Category;
