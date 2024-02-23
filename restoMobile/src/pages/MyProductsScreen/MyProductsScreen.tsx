import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './MyProductsScreen.styles';
import AddProductScreen from '../AddProductScreen/AddProductScreen';
import { useIsFocused } from '@react-navigation/native';
import { getProductsByUser } from '../../services/productCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";



const MyProductsScreen = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const products = await getProductsByUser(userToken);
        setProductList(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [isFocused]);

  const updateProductList = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const updatedProductList = await getProductsByUser(userToken);
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
