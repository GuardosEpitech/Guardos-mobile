import React, { useEffect, useState , useCallback} from 'react';
import { View, FlatList, TouchableOpacity, Text , RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import styles from './RestaurantScreen.styles'
import axios from 'axios';
import { getAllResto } from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuPage from '../MenuPage/MenuPager';
import {IRestaurantFrontEnd} from '../../models/restaurantsInterfaces'

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    updateRestoData();
  }, []);

  const updateRestoData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    getAllResto()
      .then((res) => {
        setRestoData(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateRestoData();
    setRefreshing(false);
  }, []);


  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={restoData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMenu(item.id, item.name)}>
            <Card info={item}/>
          </TouchableOpacity>
        )}
        keyExtractor={(restaurant) => restaurant.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default MyRestaurantsScreen;
