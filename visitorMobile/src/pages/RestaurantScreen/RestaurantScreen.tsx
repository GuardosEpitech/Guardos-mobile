import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl} from 'react-native';
import { Slider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import styles from './RestaurantScreen.styles'
import axios from 'axios';
import { getAllResto , getFilteredRestos} from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MenuPage from '../MenuPage/MenuPager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IRestaurantFrontEnd, ICommunication} from '../../models/restaurantsInterfaces'

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [distance, setDistance] = useState(0);
  const [categories, setCategories] = useState([
    { name: 'Burger', selected: false },
    { name: 'Sushi', selected: false },
    { name: 'Pizza', selected: false },
    { name: 'Salad', selected: false },
    { name: 'Pasta', selected: false },
  ]);
  const [filterSelections, setFilterSelections] = useState<ICommunication>({
    rating: [0],
    range: 0,
    categories: [],
  });

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

  const updateRestoByFilterData = async (filterSelections: any) => {
    const userToken = await AsyncStorage.getItem('userToken');    
    getFilteredRestos(filterSelections)
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

  const handleRatingChange = (index: number) => {
    setRating(index);
    updateFilterSelections();
  };

  const handleDistanceChange = (value: number) => {
    console.log(value);
    setDistance(value);
    updateFilterSelections();
  };

  const handleCategoryToggle = (index: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].selected = !updatedCategories[index].selected;
    setCategories(updatedCategories);
    updateFilterSelections();
  };

  const updateFilterSelections = () => {
    const selectedCategories = categories.filter(category => category.selected).map(category => category.name);
    const updatedFilterSelections: ICommunication = {
      rating: rating > 0 ? [1, 2, 3, 4, 5].slice(0, rating) : [],
      range: distance,
      categories: selectedCategories.length > 0 ? selectedCategories : [],
    };
    
    setFilterSelections(updatedFilterSelections);
    if (rating === 0 && distance === 0 && categories.filter(category => category.selected).length === 0) {
      updateRestoData()
    } else {   
      updateRestoByFilterData(updatedFilterSelections)
    }
  };

  const resetFilters = () => {
    setRating(0);
    setDistance(0);
    setCategories(categories.map(category => ({ ...category, selected: false })));
    updateFilterSelections(); 
  };


  return (
    <View style={styles.container}>
      {isTabVisible && <View style={styles.overlay} />}
      <View style={styles.content}>
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
        <TouchableOpacity style={styles.roundButton} onPress={() => setIsTabVisible(!isTabVisible)}>
          <Ionicons name="md-filter" size={30} color="white" />
        </TouchableOpacity>
        {isTabVisible && (
          <View style={styles.tabContainer}>
            <Text>Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRatingChange(index)} >
                  <Ionicons name={index <= rating ? 'md-star' : 'md-star-outline'} size={30} color="gold" />
                </TouchableOpacity>
              ))}
            </View>
            <Text>Distance</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={distance}
              minimumTrackTintColor="#6d071a"
              maximumTrackTintColor="#e2b0b3"
              thumbTintColor="#6d071a"
              thumbStyle={styles.thumbStyle}
              onValueChange={(value) => handleDistanceChange(value)}
            />
            <Text>Distance: {distance} km</Text>
            <Text>Categories</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryBox, { backgroundColor: category.selected ? 'yellow' : 'white' }]}
                  onPress={() => handleCategoryToggle(index)}
                >
                  <Text>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={resetFilters}>
              <Text>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyRestaurantsScreen;
