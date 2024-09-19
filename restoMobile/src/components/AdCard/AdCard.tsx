import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Image, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import styles from './AdCard.style';

const AdCard = () => {
  const adImage = require('../../assets/amazon_ad.png');
  const adUrl = 'https://www.amazon.com/ref=nav_logo';
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
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

    fetchDarkMode();
  }, []);

  const handlePress = () => {
    Linking.openURL(adUrl);
  };

  return (
    <TouchableOpacity
      style={[styles.adContainer, darkMode ? styles.adContainerDark : styles.adContainer]}
      onPress={handlePress}
    >
      <Image source={adImage} style={styles.adImage} />
      <Text style={[styles.adDescription, darkMode ? styles.adDescriptionDark : styles.adDescription]}>
        {t('components.AdCard.description')}
      </Text>
      <Text style={[styles.adLink, darkMode ? styles.adLinkDark : styles.adLink]}>
        {t('components.AdCard.link')}
      </Text>
    </TouchableOpacity>
  );
};
export default AdCard;