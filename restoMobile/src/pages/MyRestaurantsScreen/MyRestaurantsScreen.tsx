import React, { useEffect, useState , useCallback} from 'react';
import { View, FlatList, TouchableOpacity, Text , RefreshControl} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import axios from 'axios';
import styles from '../MyRestaurantsScreen/MyRestaurantsScreen.styles';
import { deleteRestaurantByName, getAllResto } from "../../services/restoCalls";

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

const MyRestaurantsScreen = () => {
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

    try {
      await deleteRestaurantByName(restaurantName);
      updateRestoData();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateRestoData();
    setRefreshing(false);
  }, []);

  const navigateToAddRestaurant = () => {
    navigation.navigate('AddRestaurantScreen');
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    //navigation.navigate('MenuPage', { restaurantId, restaurantName });
    navigation.navigate('EditRestaurant', { restaurantName });
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyRestaurantsScreen;
