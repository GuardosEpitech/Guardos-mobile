import React, { useEffect, useState , useCallback} from 'react';
import {View, StatusBar, FlatList, TouchableOpacity, Text , RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import Card from '../../components/RestaurantCard';
import axios from 'axios';
import styles from './HomeScreen.styles';
import MenuPage from '../MenuPage/MenuPage';

export interface IRestaurantFrontEnd {
  name: string;
  id: number;
  phoneNumber: string;
  website: string;
  description: string;
  pictures: string[];
  hitRate?: number;
  range: number;
  rating: number;
  ratingCount?: number;
}

const baseUrl = `http://195.90.210.111:8081/api/restaurants/`;

export const getAllResto = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all restaurants:', error);
    throw new Error('Failed to fetch all restaurants');
  }
};

const deleteRestaurantByName = async (restaurantName: string) => {
  try {
    await axios({
      method: 'DELETE',
      url: `${baseUrl}${restaurantName}`,
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('Failed to delete restaurant');
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    updateRestoData();
  }, []);

  const updateRestoData = () => {
    getAllResto()
      .then((res) => {
        setRestoData(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };

  const onDelete = async (restaurantName: string) => {
    console.log(restaurantName);

    try {
      await deleteRestaurantByName(restaurantName);
      updateRestoData();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const navigateToAddRestaurant = () => {
    navigation.navigate('AddRestaurant');
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateRestoData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Header label="Guardos" />
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={restoData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMenu(item.id, item.name)}>
            <Card info={item} onDelete={onDelete} />
          </TouchableOpacity>
        )}
        keyExtractor={(restaurant) => restaurant.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.roundButton}
        onPress={navigateToAddRestaurant}
      >
        <Text style={styles.buttonText}>Add Restaurant</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;