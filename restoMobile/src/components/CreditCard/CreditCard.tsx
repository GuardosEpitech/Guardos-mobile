import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";
import styles from './CreditCard.styles';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ModalConfirmPayment from '../ModalConfirmPayment/ModalConfirmPayment';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ICreditCardProps {
  name: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  id: string;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

const CreditCard: React.FC<ICreditCardProps> = (props: ICreditCardProps) => {
  const { name, brand, last4, exp_month, exp_year, id, onDelete, onUpdate } = props;
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  async function handleConfirmDelete() {
    await onDelete(id);
    if (onUpdate) {
      await onUpdate();
      toggleModal();
    }
  };

  const loadDarkModeState = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        setDarkMode(JSON.parse(darkModeValue));
      }
    } catch (error) {
      console.error('Error loading dark mode value:', error);
    }
  };

  useEffect(() => {
    loadDarkModeState();
}, []);


  return (
    <View style={[styles.creditCard, darkMode && styles.creditCardDark]}>
      <TouchableOpacity style={styles.menu} onPress={toggleModal}>
        <FontAwesomeIcon icon={ faTrash } size={15} color="gray" />
      </TouchableOpacity>
      <Text style={[styles.brand, darkMode && styles.brandDark]}>{brand}</Text>
      <View style={styles.cardNumberContainer}>
        <View style={styles.cardNumber}>
          {[...Array(3)].map((_, index) => (
            <Text key={index} style={[styles.cardNumberDigit, darkMode && styles.cardNumberDark]}>
              {'****'}
              {'\u00A0'}
            </Text>
          ))}
          <Text style={[styles.last4, darkMode && styles.last4Dark]}>{last4}</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.name, darkMode && styles.nameDark]}>{name}</Text>
        <Text style={[styles.expiresOn, darkMode && styles.expiresOnDark]}>
          {t('components.CreditCard.expire')}{('0' + exp_month).slice(-2)}/{String(exp_year).slice(-2)}
        </Text>
      </View>
      <ModalConfirmPayment
        isVisible={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={toggleModal}
      />
    </View>
  );
};

export default CreditCard;