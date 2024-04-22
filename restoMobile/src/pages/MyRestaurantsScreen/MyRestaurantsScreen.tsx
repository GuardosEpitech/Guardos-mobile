import React, { useEffect, useState , useCallback} from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import styles from '../MyRestaurantsScreen/MyRestaurantsScreen.styles';
import {useTranslation} from "react-i18next";
import MenuPage from '../MenuPage/MenuPage';
import AddRestaurantScreen from '../AddRestaurantScreen/AddRestaurantScreen';
import {
  deleteRestaurantByName,
  getAllRestaurantsByUserAndFilter
} from "../../services/restoCalls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IRestaurantFrontEnd } from 'src/models/restaurantsInterfaces';

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    updateRestoData(filter);
  }, [filter]);

  const updateRestoData = async (filter: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
    getAllRestaurantsByUserAndFilter(userToken, filter)
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
    updateRestoData(filter);
    setRefreshing(false);
  }, [filter]);

  const navigateToAddRestaurant = () => {
    navigation.navigate('AddRestaurantScreen');
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('common.search-restaurants')}
        value={filter}
        onChangeText={setFilter}
        autoCapitalize="none"
      />
      <FlatList
        data={restoData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
            <Card info={item} onDelete={onDelete} />
          </TouchableOpacity>
        )}
        keyExtractor={(restaurant) => (restaurant.uid ? restaurant.uid.toString() : '0')}
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
