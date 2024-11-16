import React, { useEffect, useState, useCallback } from 'react';
import {View, FlatList, TouchableOpacity, Text, RefreshControl, TextInput, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import AdCard from '../../components/AdCard/AdCard';
import styles from './MyRestaurantsScreen.styles';
import { useTranslation } from 'react-i18next';
import {
  deleteRestaurantByName,
  getAllRestaurantsByUserAndFilter,
} from '../../services/restoCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRestaurantFrontEnd } from 'src/models/restaurantsInterfaces';
import { getRestoUserPermission } from '../../services/permissionsCalls';

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  const [filter, setFilter] = useState('');
  const [adIndex, setAdIndex] = useState<number | null>(null);
  const { t } = useTranslation();
  const [premium, setPremium] = useState<boolean>(false);

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

  const getPremium = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const permissions = await getRestoUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      const isBasicUser = permissions.includes('basicSubscription');
      if (isBasicUser || isPremiumUser) {
        setPremium(true);
      } else {
        setPremium(false);
      }
    } catch (error) {
      console.error('Error getting permissions: ', error);
    }
  };

  useEffect(() => {
    getPremium();
    updateRestoData(filter);
    fetchDarkMode();
  }, [filter]);

  const onDelete = async (restaurantName: string) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      await deleteRestaurantByName(restaurantName, userToken);
      updateRestoData(filter);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const updateRestoData = async (filter: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) return;

    try {
      const res = await getAllRestaurantsByUserAndFilter(userToken, filter);
      setRestoData(res);
      setAdIndex(Math.floor(Math.random() * (res.length + 1)));
    } catch (error) {
      console.error('Error updating restaurant data:', error);
    }
  };

  const onRefresh = useCallback(() => {
    getPremium();
    setRefreshing(true);
    updateRestoData(filter);
    fetchDarkMode();
    setRefreshing(false);
    setKey((prevKey) => prevKey + 1);
  }, [filter]);

  const navigateToAddRestaurant = () => {
    navigation.navigate('AddRestaurantScreen');
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  const renderItem = ({ item, index }: { item: IRestaurantFrontEnd; index: number }) => (
    <View>
      {index === adIndex && !premium && <AdCard />}
      <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
        <Card info={item} onDelete={onDelete} key={key} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
      {restoData.length === 0 ? (
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>
            {t('pages.MyRestoPage.noresto')}
          </Text>
        </ScrollView>
      ) : (
        <>
          <TextInput
            style={darkMode ? styles.searchInputDark : styles.searchInput}
            placeholder={t('common.search-restaurants')}
            placeholderTextColor={darkMode ? '#fff' : '#000'}
            value={filter}
            onChangeText={setFilter}
            autoCapitalize="none"
          />
          <FlatList
            data={restoData}
            renderItem={renderItem}
            keyExtractor={(restaurant) =>
              restaurant.uid ? restaurant.uid.toString() : '0'
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </>
      )}
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
