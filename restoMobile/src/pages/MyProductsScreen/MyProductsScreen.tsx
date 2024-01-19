import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './MyProductsScreen.styles';
import AddProductScreen from '../AddProductScreen/AddProductScreen';
import { useIsFocused } from '@react-navigation/native';
import { getAllProducts } from '../../services/productCalls';



const MyProductsScreen = ({ navigation }: { navigation: any }) => {
  console.log('Help');
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setProductList(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [isFocused]);

  const updateProductList = async () => {
    const updatedProductList = await getAllProducts();
    setProductList(updatedProductList);
  };

  const navigateToAddProduct = () => {
    navigation.navigate('AddProductScreen');
  };

  return (
    <View style={styles.container}>
      {productList.map((product) => (
        <ProductCard key={product._id} product={product} onDelete={updateProductList}/>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddProduct}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyProductsScreen;
