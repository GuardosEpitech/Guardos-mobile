import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './SubscriptionBox.styles';

const SubscriptionBox = ({ title, description, price, onClick, isActive, permission, onDelete, darkMode }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.subscriptionCard, darkMode && styles.subscriptionCardDark, isActive && styles.highlighted,]}>
      {isActive && onDelete && (
        <TouchableOpacity style={styles.deleteIcon} onPress={() => onDelete([permission])}>
          <Icon name="cancel" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, darkMode && styles.titleDark]}>{title}</Text>
      <View style={styles.descriptionList}>
        {description.map((desc, index) => (
          <View key={index} style={styles.bulletPointContainer}>
            <Text style={[styles.bulletPoint, darkMode && styles.bulletPointDark]}>•</Text>
            <Text style={[styles.descriptionText, darkMode && styles.descriptionTextDark]}>{desc}</Text>
          </View>
        ))}
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.smallFont, darkMode && styles.smallFontDark]}>
          {t('components.SubscriptionBox.monthly-price')}
        </Text>
        <Text style={[styles.bigFont, darkMode && styles.bigFontDark]}>{price}</Text>
      </View>
      <TouchableOpacity style={[styles.button, darkMode && styles.buttonDark]} onPress={() => onClick([permission])}>
        <Text style={styles.buttonText}>{t('components.SubscriptionBox.select')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionBox;
