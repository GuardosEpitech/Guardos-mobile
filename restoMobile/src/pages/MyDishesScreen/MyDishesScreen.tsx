import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import DishCard from '../../components/DishCard/DishCard';
import { getAllDishes, deleteDishByName } from '../../services/dishCalls';
import styles from '../MyDishesScreen/MyDishScreen.styles';
import { IDishFE } from "../../../../shared/models/dishInterfaces";

const MyDishesScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [dishList, setDishList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDishes = async () => {
    try {
      const dishes = await getAllDishes();
      setDishList(dishes);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDishes();
    }
  }, [isFocused]);

  const onDelete = async (dishName: string, restaurant: string) => {
    try {
      await deleteDishByName(restaurant, dishName);
      fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDishes().then(() => setRefreshing(false));
  }, []);

  const navigateToAddDish = () => {
    navigation.navigate('EditDish', { restaurantName: '', dish: null });
  };

  const navigateToChangeDish = ( restaurantName: string, dish: IDishFE) => {
    console.log('clicked on dish:')
    navigation.navigate('EditDish', { restaurantName, dish });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dishList}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigateToChangeDish(item.resto, item)}>
          <DishCard dish={item} onDelete={() => onDelete(item.name, item.resto)} />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity style={styles.roundButton} onPress={navigateToAddDish}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MyDishesScreen;
