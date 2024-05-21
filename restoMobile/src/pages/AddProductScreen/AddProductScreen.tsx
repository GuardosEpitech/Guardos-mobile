import React from 'react';
import { View, Text } from 'react-native';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './AddProductScreen.styles';
import {useTranslation} from "react-i18next";

const AddProductScreen = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('pages.AddProductScreen.add-product')}</Text>
      <ProductForm/>
    </View>
  );
};

export default AddProductScreen;
