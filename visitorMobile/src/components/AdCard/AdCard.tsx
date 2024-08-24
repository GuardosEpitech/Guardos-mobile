import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './AdCard.style';

const AdCard = () => {
  const adImage = require('../../../assets/amazon_ad.png');
  const adUrl = 'https://www.amazon.com/ref=nav_logo';
  const {t} = useTranslation();

  const handlePress = () => {
    Linking.openURL(adUrl);
  };

  return (
    <TouchableOpacity style={styles.adContainer} onPress={handlePress}>
      <Image source={adImage} style={styles.adImage} />
      <Text style={styles.adDescription}> {t('components.AdCard.description')}</Text>
      <Text style={styles.adLink}>{t('components.AdCard.link')}</Text>
    </TouchableOpacity>
  );
};

export default AdCard;
