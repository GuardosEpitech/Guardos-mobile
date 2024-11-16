import React, { useState, useEffect, useCallback } from 'react';
import {View, TouchableOpacity, Text, RefreshControl, FlatList, ScrollView} from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './MyProductsScreen.styles';
import AddProductScreen from '../AddProductScreen/AddProductScreen';
import { useIsFocused } from '@react-navigation/native';
import { getProductsByUser } from '../../services/productCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";



const MyProductsScreen = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  const {t} = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDarkMode();
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

  const updateProductList = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const updatedProductList = await getProductsByUser(userToken);
    setProductList(updatedProductList);
  };

  const navigateToAddProduct = () => {
    navigation.navigate('AddProductScreen');
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDarkMode();
    setRefreshing(false);
    setKey(prevKey => prevKey + 1);
  }, []);

  const onRefresh2 = useCallback(() => {
    setIsRefreshing(true);
    fetchDarkMode();
    setTimeout(() => {
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
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh2} />
    }>
      <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
        {productList.length === 0 ? (
          <View style={styles.centered}>
          <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.MyProductPage.noprod')}</Text>
          </View>
        ) : (
          <FlatList
          data={productList}
          renderItem={({ item }) => (
            <ProductCard key={item._id} product={item} onDelete={updateProductList} key={key}/>
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            />
          )}
        <TouchableOpacity style={styles.addButton} onPress={navigateToAddProduct}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MyProductsScreen;
