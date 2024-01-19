import React from 'react';
import { View, Text } from 'react-native';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './AddProductScreen.styles';

const AddProductScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new Product</Text>
      <ProductForm/>
    </View>
  );
};

export default AddProductScreen;
