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
import {useFocusEffect, useNavigation, useIsFocused} from '@react-navigation/native';
import Card from '../../components/RestaurantCard/RestaurantCard';
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
import {getRestoFavourites} from "../../services/favourites";
import {useTranslation} from "react-i18next";

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
  const [isFavouriteRestos, setIsFavouriteRestos] = React.useState<Array<number>>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const {t} = useTranslation();

  useEffect(() => {
    if (isFocused) {
      loadSavedFilters();
    }
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    fetchDarkMode();  
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    }, [])
  );

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
  


  const updateFavRestoData = async (filter, favRestoIds) => {
    getFilteredRestosNew(filter)
      .then((res) => {
        const updatedRestoData = res.map(resto => ({
          ...resto,
          isFavouriteResto: favRestoIds?.includes(resto.uid)
        }));
        setRestoData(updatedRestoData);
        setSelectedRestoData(updatedRestoData);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };

  const fetchFilteredFavourits = async (filter: ISearchCommunication) => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) { return; }

    try {
      const favourites = await getRestoFavourites(userToken);
      const favouriteRestoIds = favourites.map((fav: any) => fav.uid);
      setIsFavouriteRestos(favouriteRestoIds);
      updateFavRestoData(filter, favouriteRestoIds);
    } catch (error) {
      console.error("Error fetching user favourites:", error);
    }
  }

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
      fetchFilteredFavourits(filter);
    } else {
      fetchFavourites().then(r => console.log("Loaded favourite resto list"));
      getAllResto().then((res) => {
        const updatedRestoData = res.map(resto => ({
          ...resto,
          isFavouriteResto: isFavouriteRestos?.includes(resto.uid)
        }));
        setSelectedRestoData(updatedRestoData);
      });
    }
  }, [filter]);

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
      await setFilteredRestos(inter);
      setFilter(inter);
    } else {
      setSelectedRestoData(restoData);
    }
    Keyboard.dismiss();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllResto().then((res) => {
      setRestoData(res);
      setSelectedRestoData(res);
    }).catch((error) => {
      console.error('Error updating restaurant data:', error);
    });
    resetFilters();
    setRefreshing(false);
  }, []);

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  const setFilteredRestos = async (filter: ISearchCommunication) => {
    const restos: IRestaurantFrontEnd[] = await getFilteredRestosNew(filter);
    const updatedRestoData = restos.map(resto => ({
      ...resto,
      isFavouriteResto: isFavouriteRestos.includes(resto.uid)
    }));
    setSelectedRestoData(updatedRestoData);
  }

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
    await setFilteredRestos(inter);
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
        message: t('pages.RestaurantScreen.save-filter-error') as string,
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
          message: t('pages.RestaurantScreen.save-filter-success') as string,
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
          message: t('pages.RestaurantScreen.save-filter-error') as string,
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
        message: t('pages.RestaurantScreen.save-filter-error') as string
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
        message: t('pages.RestaurantScreen.delete-filter-error') as string
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
          message: t('pages.RestaurantScreen.delete-filter-success') as string,
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
          message: t('pages.RestaurantScreen.delete-filter-error') as string,
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
    <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
      {isTabVisible && <View style={styles.overlay} />}
      <View style={[styles.searchContainer, darkMode && styles.searchContainerDarkTheme]}>
        <TextInput
          style={[styles.input, darkMode && styles.inputDarkTheme]}
          placeholder={t('pages.RestaurantScreen.enter-resto-name') as string}
          value={nameFilter}
          onChangeText={(text) => setNameFilter(text)}
        />
        <TextInput
          style={[styles.input, darkMode && styles.inputDarkTheme]}
          placeholder={t('pages.RestaurantScreen.enter-city') as string}
          value={locationFilter}
          onChangeText={(text) => setLocationFilter(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>{t('pages.RestaurantScreen.search')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {selectedRestoData.length === 0 ? (
          <Text style={[styles.ErrorMsg, darkMode && styles.darkModeTxt]}>{t('pages.RestaurantScreen.noresto')}</Text>
        ) : (
          <FlatList
            data={selectedRestoData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
                <Card info={item} isFavouriteResto={item.isFavouriteResto} isSmallerCard={false}/>
              </TouchableOpacity>
            )}
            keyExtractor={(restaurant, index) => restaurant.uid ? restaurant.uid.toString() : index.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => setIsTabVisible(!isTabVisible)}
        >
          <Ionicons name="filter-outline" size={30} color="white" />
        </TouchableOpacity>

        <Modal isVisible={isTabVisible} style={{ marginTop: 50 }}>
          <ScrollView style={styles.filterPopup}>
            <View style={styles.filterPopup}>
              <Text style={styles.popupHeading}>{t('pages.RestaurantScreen.filter')}</Text>

              <Text style={styles.categoryText}>{t('pages.RestaurantScreen.rating')}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRatingChange(index)} 
                  >
                    <Ionicons 
                      name={index <= rating ? 'star' : 'star-outline'} 
                      size={30} 
                      color="#6d071a" 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.categoryText}>{t('pages.RestaurantScreen.distance')}</Text>
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
              <Text style={styles.distanceText}>{t('pages.RestaurantScreen.distance-details', {distance: distance})}</Text>

              <Text style={styles.categoryText}>{t('pages.RestaurantScreen.categories')}</Text>
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

              <Text style={styles.categoryText}>{t('pages.RestaurantScreen.allergens')}</Text>
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
            <Text style={styles.categoryText}>{t('pages.RestaurantScreen.save-filter')}</Text>
            <TextInput
              style={styles.saveInput}
              placeholder={t('pages.RestaurantScreen.enter-filter-name') as string}
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
              <Text style={styles.buttonTextPopup}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>

          {/* Saved Filters Section */}
          <Text style={styles.categoryText}>{t('pages.RestaurantScreen.saved-filters')}</Text>
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
                    <Text style={styles.buttonTextPopup}>{t('pages.RestaurantScreen.load')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteFilter(filter.filterName)}
                    style={styles.deleteFilterButton}
                  >
                    <Text style={styles.buttonTextPopup}>{t('common.delete')}</Text>
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
              <Text style={styles.buttonTextPopup}>{t('common.clear')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterPopupButton}
              onPress={handleFilter}
            >
              <Text style={styles.buttonTextPopup}>{t('common.apply')}</Text>
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
