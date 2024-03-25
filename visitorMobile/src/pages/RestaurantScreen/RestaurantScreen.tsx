import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, RefreshControl, ScrollView} from 'react-native';
import { Slider } from 'react-native-elements';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Card from '../../components/RestaurantCard/RestaurantCard';
import styles from './RestaurantScreen.styles'
import { getAllResto , getFilteredRestos} from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IRestaurantFrontEnd, ICommunication } from '../../models/restaurantsInterfaces';
import {getRestoFavourites} from "../../services/favourites";

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
  const [allergens, setAllergens] = useState([
    { name: 'gluten', selected: false },
    { name: 'celery', selected: false },
    { name: 'crustaceans', selected: false },
    { name: 'eggs', selected: false },
    { name: 'fish', selected: false },
    { name: 'lupin', selected: false },
    { name: 'milk', selected: false },
    { name: 'molluscs', selected: false },
    { name: 'mustard', selected: false },
    { name: 'peanuts', selected: false },
    { name: 'sesame', selected: false },
    { name: 'soybeans', selected: false },
    { name: 'sulphides', selected: false },
    { name: 'tree nuts', selected: false },
  ]);
  const [filterSelections, setFilterSelections] = useState<ICommunication>({
    rating: [0],
    range: 0,
    categories: [],
    allergens: [],
  });
  const [isFavouriteRestos, setIsFavouriteRestos] = React.useState<Array<number>>([]);

  useEffect(() => {
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    }, [])
  );

  const updateRestoData = async (favRestoIds) => {
    getAllResto()
      .then((res) => {
        const updatedRestoData = res.map(resto => ({
          ...resto,
          isFavouriteResto: favRestoIds?.includes(resto.uid)
        }));
        setRestoData(updatedRestoData);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };

  const fetchFavourites = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favourites = await getRestoFavourites(userToken);
      const favouriteRestoIds = favourites.map((fav: any) => fav.uid);
      setIsFavouriteRestos(favouriteRestoIds);

      updateRestoData(favouriteRestoIds).then(r => console.log("Loaded resto data"));
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  };

  const updateRestoByFilterData = async (filterSelections: any) => {
    getFilteredRestos(filterSelections)
      .then((res) => {
        const updatedRestoData = res.map(resto => ({
          ...resto,
          isFavouriteResto: isFavouriteRestos.includes(resto.uid)
        }));
        setRestoData(updatedRestoData);
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
    setDistance(value);
    updateFilterSelections();
  };

  const handleCategoryToggle = (index: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].selected = !updatedCategories[index].selected;
    setCategories(updatedCategories);
    updateFilterSelections();
  };

  const handleAllergenToggle = (index: number) => {
    const updatedAllergens = [...allergens];
    updatedAllergens[index].selected = !updatedAllergens[index].selected;
    setAllergens(updatedAllergens);
    updateFilterSelections();
  };

  const updateFilterSelections = () => {
    const selectedCategories = categories.filter(category => category.selected).map(category => category.name);
    const selectedAllergens = allergens.filter(allergen => allergen.selected).map(allergen => allergen.name);
    const updatedFilterSelections: ICommunication = {
      rating: rating > 0 ? [1, 2, 3, 4, 5].slice(0, rating) : [],
      range: distance,
      categories: selectedCategories,
      allergens: selectedAllergens,
    };
    
    setFilterSelections(updatedFilterSelections);
    if (rating === 0 && distance === 0 && categories.filter(category => category.selected).length === 0 && allergens.filter(allergen => allergen.selected).length === 0) {
      updateRestoData()
    } else {   
      updateRestoByFilterData(updatedFilterSelections)
    }
  };

  const resetFilters = () => {
    setRating(0);
    setDistance(0);
    setCategories(categories.map(category => ({ ...category, selected: false })));
    setAllergens(allergens.map(allergen => ({ ...allergen, selected: false })));
    updateFilterSelections(); 
  };


  return (
    <View style={styles.container}>
      {isTabVisible && <View style={styles.overlay} />}
      <View style={styles.content}>
        <FlatList
          data={restoData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
              <Card info={item} isFavouriteResto={item.isFavouriteResto} />
            </TouchableOpacity>
          )}
          keyExtractor={(restaurant) => restaurant.uid.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <TouchableOpacity style={styles.roundButton} onPress={() => setIsTabVisible(!isTabVisible)}>
          <Ionicons name="md-filter" size={30} color="white" />
        </TouchableOpacity>
        {isTabVisible && (
          <ScrollView style={styles.scrollView}>
            <View style={styles.tabContainer}>
              <Text>Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingChange(index)} >
                    <Ionicons name={index <= rating ? 'md-star' : 'md-star-outline'} size={30} color="#6d071a" />
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
                    style={[styles.categoryBox, { backgroundColor: category.selected ? '#e2b0b3' : 'white' }]}
                    onPress={() => handleCategoryToggle(index)}
                  >
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text>Allergens</Text>
              <View style={styles.categoriesContainer}>
                {allergens.map((allergen, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryBox, { backgroundColor: allergen.selected ? '#e2b0b3' : 'white' }]}
                    onPress={() => handleAllergenToggle(index)}
                  >
                    <Text>{allergen.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsTabVisible(!isTabVisible)}>
                <Ionicons name="close" size={30} color="black" />
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Text>Reset Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={() => setIsTabVisible(!isTabVisible)}>
                  <Text>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default MyRestaurantsScreen;
