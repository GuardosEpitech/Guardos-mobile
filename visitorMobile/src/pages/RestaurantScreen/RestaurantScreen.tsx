import React, { useEffect, useState, useCallback, useContext } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  Keyboard, 
  TouchableOpacity, 
  Text, 
  RefreshControl, 
  ScrollView
} from 'react-native';
import { Slider } from 'react-native-elements';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Card from '../../components/RestaurantCard';
import styles from './RestaurantScreen.styles'
import { getAllResto , getFilteredRestosNew} from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { IRestaurantFrontEnd } from '../../models/restaurantsInterfaces';
import {
  addSavedFilter, 
  deleteSavedFilter, 
  getSavedFilters} from "../../services/profileCalls";
import { 
  ISearchCommunication 
} from '../../../../shared/models/communicationInterfaces';
import { FilterContext } from '../../models/filterContext';

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [selectedRestoData, setSelectedRestoData] = 
    useState<IRestaurantFrontEnd[]>([]);
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
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [saveFilterStatus, setSaveFilterStatus] = useState({
    success: false,
    error: false,
    message: '',
  });
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const { filter, setFilter } = useContext(FilterContext);
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      loadSavedFilters();
    }
  }, [isFocused]);

  useEffect(() => {
    if (filter) {
      setNameFilter(filter.name);
      setLocationFilter(filter.location);
      setRating(filter.rating ? filter.rating[0] : 0);
      setDistance(filter.range || 0);
      setSelectedCategories(filter.categories || []);
      setSelectedAllergens(filter.allergenList || []);
      setCategories(categories.map(category => ({
        ...category,
        selected: filter.categories ? 
          filter.categories.includes(category.name) : false,
      })));
      setAllergens(allergens.map(allergen => ({
        ...allergen,
        selected: filter.allergenList ? 
          filter.allergenList.includes(allergen.name) : false,
      })));
      getFilteredRestosNew(filter)
        .then((res) => {
          setRestoData(res);
          setSelectedRestoData(res);
        }).catch((error) => {
          console.error('Error updating restaurant data:', error);
        });

    } else {
      updateRestoData();
    }
  }, [filter]);

  const updateRestoData = async () => {
    getAllResto()
      .then((res) => {
        setRestoData(res);
        setSelectedRestoData(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };

  const loadSavedFilters = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    getSavedFilters(userToken).then((res) => {
      setSavedFilters(res);
    })
  }

  const handleSearch = async () => {
    if (nameFilter || locationFilter) {
      let selectedRating = [];
      if (rating < 5 && rating !== 0) {
        selectedRating = [rating, rating + 1]
      } else if (rating === 0) {
        selectedRating = [];
      } else if (rating === 5) {
        selectedRating = [rating, rating];
      }
      const inter: ISearchCommunication = {
        range: distance,
        rating: selectedRating,
        name: nameFilter,
        location: locationFilter,
        categories: selectedCategories,
        allergenList: selectedAllergens
      }
      setSelectedRestoData(await getFilteredRestosNew(inter));
      setFilter(inter);
    } else {
      setSelectedRestoData(restoData);
    }
    Keyboard.dismiss();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    updateRestoData();
    setRefreshing(false);
  }, []);

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  const handleFilter = async () => {
    let selectedRating = [];
    if (rating < 5 && rating !== 0) {
      selectedRating = [rating, rating + 1]
    } else if (rating === 0) {
      selectedRating = [];
    } else if (rating === 5) {
      selectedRating = [rating, rating];
    }
    const inter: ISearchCommunication = {
      range: distance,
      rating: selectedRating,
      name: nameFilter,
      location: locationFilter,
      categories: selectedCategories,
      allergenList: selectedAllergens
    }
    setSelectedRestoData(await getFilteredRestosNew(inter));
    setFilter(inter);
    setIsTabVisible(false);
  };

  const handleRatingChange = (index: number) => {
    setRating(index);
  };

  const handleDistanceChange = (value: number) => {
    setDistance(value);
  };

  const handleCategoryToggle = (index: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].selected = !updatedCategories[index].selected;
    setCategories(updatedCategories);
    setSelectedCategories(categories
      .filter(category => category.selected).map(category => category.name));
  };

  const handleAllergenToggle = (index: number) => {
    const updatedAllergens = [...allergens];
    updatedAllergens[index].selected = !updatedAllergens[index].selected;
    setAllergens(updatedAllergens);
    setSelectedAllergens(allergens
      .filter(allergen => allergen.selected).map(allergen => allergen.name));
  };

  const resetFilters = () => {
    setNameFilter('');
    setLocationFilter('');
    setRating(0);
    setDistance(0);
    setSelectedAllergens([]);
    setSelectedCategories([]);
    setCategories(categories.map(category => (
      { ...category, selected: false })));
    setAllergens(allergens.map(allergen => (
      { ...allergen, selected: false })));
  };

  const handleSaveFilter = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      setSaveFilterStatus({
        success: false,
        error: true,
        message: 'Error saving filter. Please try again.',
      });
      setTimeout(() => {
        setSaveFilterStatus({
          success: false,
          error: false,
          message: '',
        });
      }, 5000);
      return;
    }
    let selectedRating = [];
      if (rating < 5 && rating !== 0) {
        selectedRating = [rating, rating + 1]
      } else if (rating === 0) {
        selectedRating = [];
      } else if (rating === 5) {
        selectedRating = [rating, rating];
      }
    const filter : ISearchCommunication = {
      filterName: filterName,
      range: distance,
      rating: selectedRating,
      name: '',
      location: '',
      categories: selectedCategories,
      allergenList: selectedAllergens
    }
    addSavedFilter(userToken, filter).then((res) => {
      if (res !== null) {
        const savedFiltersCopy = savedFilters;
        savedFiltersCopy.push(filter);
        setSavedFilters(savedFiltersCopy);
        setSaveFilterStatus({
          success: true,
          error: false,
          message: 'Filter saved successfully!',
        });
        console.log('Saved filter');
        setTimeout(() => {
          setSaveFilterStatus({
            success: false,
            error: false,
            message: '',
          });
        }, 5000);
      } else {
        setSaveFilterStatus({
          success: false,
          error: true,
          message: 'Error saving filter. Please try again.',
        });
        console.error('Error saving filter');
        setTimeout(() => {
          setSaveFilterStatus({
            success: false,
            error: false,
            message: '',
          });
        }, 5000);
      }
    }).catch((error) => {
      setSaveFilterStatus({
        success: false,
        error: true,
        message: 'Error saving filter. Please try again.',
      });
      console.error('Error saving filter:', error);
      setTimeout(() => {
        setSaveFilterStatus({
          success: false,
          error: false,
          message: '',
        });
      }, 5000);
    });
    setFilterName('');
  };

  const handleLoadFilter = async (loadFilterName: string) => {
    const newFilter : ISearchCommunication = savedFilters
      .find((filter) => filter.filterName === loadFilterName);

    await AsyncStorage.setItem('filter', JSON.stringify(newFilter));
    
    setRating(newFilter.rating[0]);
    setDistance(newFilter.range);
    const updatedCategories = categories.map(category => ({
      ...category,
      selected: newFilter.categories.includes(category.name),
    }));
    setCategories(updatedCategories);
    const updatedAllergens = allergens.map(allergen => ({
      ...allergen,
      selected: newFilter.allergenList.includes(allergen.name),
    }));
    setAllergens(updatedAllergens);
  };

  const handleDeleteFilter = async (filterName: string) => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      setSaveFilterStatus({
        success: false,
        error: true,
        message: 'Error deleting filter. Please log in again.',
      });
      setTimeout(() => {
        setSaveFilterStatus({
          success: false,
          error: false,
          message: '',
        });
      }, 5000);
      return;
    }

    deleteSavedFilter(userToken, filterName).then((res) => {
      if (res !== null) {
        const remainingFilters = savedFilters.filter((filter) => 
          filter.filterName !== filterName);
        setSavedFilters(remainingFilters);
        setSaveFilterStatus({
          success: true,
          error: false,
          message: 'Filter deleted successfully!',
        });
        console.log('Deleted filter');
        setTimeout(() => {
          setSaveFilterStatus({
            success: false,
            error: false,
            message: '',
          });
        }, 5000);
      } else {
        setSaveFilterStatus({
          success: false,
          error: true,
          message: 'Error deleting filter. Please try again.',
        });
        console.error('Error deleting filter');
        setTimeout(() => {
          setSaveFilterStatus({
            success: false,
            error: false,
            message: '',
          });
        }, 5000);
      }
    })
  };

  return (
    <View style={styles.container}>
      {isTabVisible && <View style={styles.overlay} />}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter restaurant name"
          value={nameFilter}
          onChangeText={(text) => setNameFilter(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={locationFilter}
          onChangeText={(text) => setLocationFilter(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={selectedRestoData}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigateToMenu(item.uid, item.name)}
            >
              <Card info={item} />
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
          onPress={() => setIsTabVisible(!isTabVisible)}
        >
          <Ionicons name="md-filter" size={30} color="white" />
        </TouchableOpacity>

        <Modal isVisible={isTabVisible} style={{ marginTop: 50 }}>
          <ScrollView style={styles.filterPopup}>
            <View style={styles.filterPopup}>
              <Text style={styles.popupHeading}>Filter</Text>

              <Text style={styles.categoryText}>Rating:</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingChange(index)} 
                  >
                    <Ionicons 
                      name={index <= rating ? 'md-star' : 'md-star-outline'} 
                      size={30} 
                      color="#6d071a" 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.categoryText}>Distance: </Text>
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
              <Text style={styles.distanceText}>Distance: {distance} km</Text>

              <Text style={styles.categoryText}>Categories:</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryBox, 
                      { backgroundColor: category.selected ? 
                        '#e2b0b3' : 'white' }]}
                    onPress={() => handleCategoryToggle(index)}
                  >
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.categoryText}>Allergens:</Text>
              <View style={styles.categoriesContainer}>
                {allergens.map((allergen, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryBox, 
                      { backgroundColor: allergen.selected ? 
                        '#e2b0b3' : 'white' }]}
                    onPress={() => handleAllergenToggle(index)}
                  >
                    <Text>{allergen.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View>
            <Text style={styles.categoryText}>Save Filter:</Text>
            <TextInput
              style={styles.saveInput}
              placeholder="Enter filter name"
              placeholderTextColor="gray"
              value={filterName}
              onChangeText={(text) => setFilterName(text)}
            />
            {/* Save Filter Status Messages */}
            {saveFilterStatus.success && (
              <Text style={styles.successMessage}>
                {saveFilterStatus.message}
              </Text>
            )}
            {saveFilterStatus.error && (
              <Text style={styles.errorMessage}>
                {saveFilterStatus.message}
              </Text>
            )}
            <TouchableOpacity
              style={styles.filterPopupButton}
              onPress={handleSaveFilter}
            >
              <Text style={styles.buttonTextPopup}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Saved Filters Section */}
          <Text style={styles.categoryText}>Saved Filters:</Text>
          <ScrollView>
            {savedFilters.map((filter, index) => (
              <View key={index} style={styles.savedFilterItem}>
                <View style={styles.filterNameContainer}>
                  <Text>{filter.filterName}</Text>
                </View>
                <View style={styles.saveButtonsContainer}>
                  <TouchableOpacity
                    onPress={() => handleLoadFilter(filter.filterName)}
                    style={styles.loadFilterButton}
                  >
                    <Text style={styles.buttonTextPopup}>Load</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteFilter(filter.filterName)}
                    style={styles.deleteFilterButton}
                  >
                    <Text style={styles.buttonTextPopup}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.buttonContainerPopup}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={resetFilters}
            >
              <Text style={styles.buttonTextPopup}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterPopupButton}
              onPress={handleFilter}
            >
              <Text style={styles.buttonTextPopup}>Apply</Text>
            </TouchableOpacity>
          </View>
            </View>
          </ScrollView>
          <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setIsTabVisible(!isTabVisible)}
        >
            <Ionicons name="close-circle" size={24} color="#6d071a" />
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

export default MyRestaurantsScreen;
