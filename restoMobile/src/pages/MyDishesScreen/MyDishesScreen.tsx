import React, { useEffect, useState, useCallback } from 'react';
import {View, Text, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DishCard from '../../components/DishCard/DishCard';
import { deleteDishByName, getDishesByUser } from "../../services/dishCalls";
import styles from '../MyDishesScreen/MyDishScreen.styles';
import { IDishFE } from "../../../../shared/models/dishInterfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

const MyDishesScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [dishList, setDishList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  const {t, i18n} = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDishes = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const dishes = await getDishesByUser(userToken);
      setDishList(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  useEffect(() => {
    fetchDarkMode();
    if (isFocused) {
      fetchDishes();
    }
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

  const onDelete = async (dishName: string, restaurant: string) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      await deleteDishByName(restaurant, dishName, userToken);
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDishes().then(() => setRefreshing(false));
    setRefreshing(false);
    setKey(prevKey => prevKey + 1);
  }, []);

  const navigateToAddDish = () => {
    navigation.navigate('EditDish', { restaurantName: '', dish: null });
  };

  const navigateToChangeDish = ( restaurantName: string, dish: IDishFE) => {
    navigation.navigate('EditDish', { restaurantName, dish });
  };

  const onRefresh2 = useCallback(() => {
    setIsRefreshing(true);
    fetchDarkMode();
    setTimeout(() => {
      if (isFocused) {
        fetchDishes();
      }
      setIsRefreshing(false);
    }, 2000);
  }, []);


  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh2} />
    }>
      <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
        {dishList.length === 0 ? (
          <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.MyDishPage.nodish')}</Text>
        ) : (
        <FlatList
          data={dishList}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => navigateToChangeDish(item.resto, item)}>
            <DishCard dish={item} onDelete={() => onDelete(item.name, item.resto)} key={item.uid} isFirstLevel={true} />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        )}
        <TouchableOpacity style={styles.roundButton} onPress={navigateToAddDish}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default MyDishesScreen;
