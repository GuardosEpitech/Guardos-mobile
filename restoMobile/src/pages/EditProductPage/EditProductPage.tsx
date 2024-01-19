import React from 'react';
import { View, Text } from 'react-native';
import ProductForm from '../../components/ProductForm/ProductForm';
import styles from './EditProductPage.styles';
import { RouteProp } from '@react-navigation/native';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>
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
