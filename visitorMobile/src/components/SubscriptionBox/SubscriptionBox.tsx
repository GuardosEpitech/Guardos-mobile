import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you are using react-native-vector-icons

const SubscriptionBox = ({ title, description, price, onClick, isActive, permission, onDelete }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.subscriptionCard, isActive && styles.highlighted]}>
      {isActive && onDelete && (
        <TouchableOpacity style={styles.deleteIcon} onPress={() => onDelete([permission])}>
          <Icon name="cancel" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.descriptionList}>
        {description.map((desc, index) => (
          <Text key={index}>{desc}</Text>
        ))}
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.smallFont}>
          {t('components.SubscriptionBox.monthly-price')}
        </Text>
        <Text style={styles.bigFont}>{price}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onClick([permission])}>
        <Text>{t('components.SubscriptionBox.select')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionBox;

const styles = StyleSheet.create({
  subscriptionCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 200,
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  descriptionList: {
    fontSize: 20,
    marginBottom: 16,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
  },
  smallFont: {
    fontSize: 12,
    color: '#777',
  },
  bigFont: {
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#333',
    color: 'white',
    borderWidth: 0,
    padding: 8,
    textAlign: 'center',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
