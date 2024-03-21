import React, { useEffect, useState , useCallback} from 'react';
import {View, StatusBar, FlatList, TouchableOpacity, Text , RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import Card from '../../components/RestaurantCard';
import styles from './HomeScreen.styles';
import { getAllResto, deleteRestaurantByName } from 'src/services/restoCalls';
import MenuPage from '../MenuPage/MenuPage';
import {IRestaurantFrontEnd} from 'src/models/restaurantsInterfaces'

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
          <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
            <Card info={item} onDelete={onDelete} />
          </TouchableOpacity>
        )}
        keyExtractor={(restaurant) => restaurant.uid.toString()}
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
