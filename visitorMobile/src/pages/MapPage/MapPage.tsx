import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  ScrollView,
  Linking, 
  TouchableOpacity, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback,
  Alert 
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Modal from 'react-native-modal';
import { 
  IRestaurantFrontEnd
} from '../../../../shared/models/restaurantInterfaces';
import { 
  ISearchCommunication 
} from '../../../../shared/models/communicationInterfaces';
import {  
  getAllResto,
  getFilteredRestosNew
} from '../../services/restoCalls';
import styles from './MapPage.styles';
import MenuPage from '../MenuPage/MenuPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Slider } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addSavedFilter, 
  deleteSavedFilter, 
  getSavedFilters
} from "../../services/profileCalls";
import { defaultRestoImage } from "../../../assets/placeholderImagesBase64";
import { getImages } from "../../services/imageCalls";
import { FilterContext } from '../../models/filterContext';
import {useTranslation} from "react-i18next";
import * as Location from 'expo-location';
import {getCategories} from "../../services/categorieCalls";

const Epitech = [13.328820, 52.508540];// long,lat

const MapPage = () => {
  const [markers, setMarkers] = useState<IRestaurantFrontEnd[]>([]);
  const { filter, setFilter } = useContext(FilterContext);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [imageError, setImageError] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredMarkers, setFilteredMarkers] = 
    useState<IRestaurantFrontEnd[]>([]);
  const [filterName, setFilterName] = useState('');
  const [savedFilters, setSavedFilters] = useState([]);
  const [rating, setRating] = useState(0);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [range, setRange] = useState(0);
  const navigation = useNavigation();
  const [saveFilterStatus, setSaveFilterStatus] = useState({
    success: false,
    error: false,
    message: '',
  });
  const [categories, setCategories] = useState([]);
  const hasLoadedFilter = useRef(false);
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
  const isFocused = useIsFocused();
  const [darkMode, setDarkMode] = useState(false);
  const {t} = useTranslation();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (isFocused) {
      loadSavedFilters(); // Trigger loadSavedFilters when the screen is focused
    }
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Location Permission Required",
          "Please enable location services in settings.",
          [{ text: "OK", onPress: () => Linking.openSettings() }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    })();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !hasLoadedFilter.current) {
      hasLoadedFilter.current = true;
    }
  }, [categories]);

  useEffect(() => {
    if (filter) {
      setNameFilter(filter.name || '');
      setLocationFilter(filter.location || '');
      setRange(filter.range || 0);
      setRating(filter.rating ? filter.rating[0] : 0);
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
        const validMarkers = res
          .filter(marker => marker.location.latitude && 
            marker.location.longitude);
        setFilteredMarkers(validMarkers);
    })
    .catch((error) => {
      console.error('Error updating restaurant data:', error);
    });
      getAllResto()
      .then((res) => {
        const validMarkers = res
        .filter(marker => marker.location.latitude && 
          marker.location.longitude);
      setMarkers(validMarkers);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
    } else {
      updateRestoData();
    }
    fetchDarkMode();
  }, [filter]);

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

  const updateRestoData = () => {
    getAllResto()
      .then((res) => {
        const validMarkers = res
        .filter(marker => marker.location.latitude && 
          marker.location.longitude);
      setMarkers(validMarkers);
      setFilteredMarkers(validMarkers);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  };

  const loadSavedFilters = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }

    getSavedFilters(userToken).then((res) => {
      setSavedFilters(res);
    })

    getCategories(userToken)
        .then((res) => {
          setCategories(res.map(category => ({name: category, selected: false})));
        });
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setImageError(false);
  }, [isModalVisible]);
 
  const handleMarkerPress = async (marker) => {
    if (marker.picturesId.length > 0) {
      try {
        const res = await getImages(marker.picturesId);
        marker.pictures = res[0].base64;
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    } else {
      marker.pictures = defaultRestoImage;
    }
    setSelectedMarker(marker);
    toggleModal();
  };

  const handleNavigate = () => {
    if (selectedMarker && selectedMarker.location) {
      const { latitude, longitude } = selectedMarker.location;

      let url = '';

      if (Platform.OS === 'ios') {
        url = `http://maps.apple.com/?daddr=${latitude},${longitude}` 
        + `&dirflg=d&t=m&z=12`;
      } else {
        url = `http://maps.google.com/maps?daddr=${latitude},${longitude}` + 
        `&dirflg=d`;
      }

      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.error('Cannot open maps application.');
        }
      });
    } else {
      console.error('Selected marker or location is missing.');
    }
  };

  const handleMenu = () => {  
    try {
      if (selectedMarker != null) {
        const restaurantId = selectedMarker.uid;
        const restaurantName = selectedMarker.name;
        toggleModal();
        navigation.navigate('MenuPage', { restaurantId, restaurantName });
      }
    } catch (error) {
      console.error('Error navigating to MenuPage:', error);
    }
  };

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
        range: range,
        rating: selectedRating,
        name: nameFilter,
        location: locationFilter,
        categories: selectedCategories,
        allergenList: selectedAllergens
      }
      await getFilteredRestosNew(inter)
        .then((res) => {
          const validMarkers = res
            .filter(marker => marker.location.latitude && 
              marker.location.longitude);
          setFilteredMarkers(validMarkers);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
      setFilter(inter);
    } else {
      setFilteredMarkers(markers);
    }
    Keyboard.dismiss();
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
      range: range,
      rating: selectedRating,
      name: nameFilter,
      location: locationFilter,
      categories: selectedCategories,
      allergenList: selectedAllergens
    }
    await getFilteredRestosNew(inter)
      .then((res) => {
        const validMarkers = res
          .filter(marker => marker.location.latitude && 
            marker.location.longitude);
        setFilteredMarkers(validMarkers);
    })
    .catch((error) => {
      console.error('Error updating restaurant data:', error);
    });
    setFilter(inter);
    setShowFilterPopup(false);
  };

  const handleRatingChange = (index: number) => {
    setRating(index);
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

  const clearFilters = async () => {
    setNameFilter('');
    setLocationFilter('');
    setSelectedAllergens([]);
    setSelectedCategories([]);
    setRange(0);
    setRating(0);
    setCategories(categories.map(category => 
      ({ ...category, selected: false })));
    setAllergens(allergens.map(allergen => 
      ({ ...allergen, selected: false })));
    await AsyncStorage.removeItem('filter');
  };

  const handleSaveFilter = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      setSaveFilterStatus({
        success: false,
        error: true,
        message: t('pages.MapPage.save-filter-error') as string,
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
      range: range,
      rating: selectedRating,
      name: nameFilter,
      location: locationFilter,
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
          message: t('pages.MapPage.save-filter-success') as string,
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
          message: t('pages.MapPage.save-filter-error') as string,
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
        message: t('pages.MapPage.save-filter-error') as string,
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

    setSelectedCategories(newFilter.categories);
    setSelectedAllergens(newFilter.allergenList);
    setRating(newFilter.rating[0]);
    setRange(newFilter.range);
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
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      setSaveFilterStatus({
        success: false,
        error: true,
        message: t('pages.MapPage.delete-filter-error') as string,
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
          message: t('pages.MapPage.delete-filter-success') as string,
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
          message: t('pages.MapPage.delete-filter-error') as string,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={[styles.searchContainer, darkMode && styles.searchContainerDarkTheme]}>
        <TextInput
          style={[styles.input, darkMode && styles.inputDarkTheme]}
          placeholder={t('pages.MapPage.enter-resto-name') as string}
          value={nameFilter}
          onChangeText={(text) => setNameFilter(text)}
        />
        <TextInput
          style={[styles.input, darkMode && styles.inputDarkTheme]}
          placeholder={t('pages.MapPage.enter-city') as string}
          value={locationFilter}
          onChangeText={(text) => setLocationFilter(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>{t('pages.MapPage.search')}</Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation ? userLocation.latitude : Epitech[1],
          longitude: userLocation ? userLocation.longitude : Epitech[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {userLocation && (
          <Circle
            center={userLocation}
            radius={250}
            strokeColor="rgba(0, 0, 255, 0.5)"
            fillColor="rgba(0, 0, 255, 0.3)"
          />
        )}
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.uid}
            coordinate={{ latitude: parseFloat(marker.location.latitude), 
              longitude: parseFloat(marker.location.longitude) }}
            title={marker.name}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => {
          if (mapRef.current && userLocation) {
            mapRef.current.animateToRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }, 1000);
          }
        }}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} style={{ margin: 0}}>
        <View style={[styles.modalContent, darkMode && styles.modalContentDarkTheme]}>
          <Image 
            source={
              !imageError &&
              selectedMarker &&
              selectedMarker.pictures &&
              selectedMarker.pictures.length > 0
                ? { uri: selectedMarker.pictures }
                : { uri: defaultRestoImage }
            }
            style={styles.modalImage}
            onError={() => {
              setImageError(true);
              console.warn('Image loading error');
              return null; 
            }}
          />
          <View style={[styles.headingContainer, darkMode && styles.headingContainerDarkTheme]}>
            <Text style={[styles.headingText, darkMode && styles.headingTextDarkTheme]}>
              {selectedMarker && selectedMarker.name}
            </Text>
          <View style={styles.starContainer}>
            {Array.from({ length: 5 }).map((_, index) => {
              const rating = selectedMarker ? selectedMarker.rating || 0 : 0;
              const isFullStar = index < Math.floor(rating);
              const isHalfStar = index === Math.floor(rating) && 
                rating % 1 !== 0;
              
              return (
                <Ionicons
                  key={index}
                  name={isFullStar ? 'star' : isHalfStar ?
                    'star-half' : 'star-outline'}
                  size={20}
                  color={isFullStar || isHalfStar ? 'gold' : 'black'}
                  style={[styles.starIcon, darkMode && styles.starIconDarkTheme]}
                />
                );
              })}
            <Text style={{ marginLeft: 5 }}>
              {selectedMarker && selectedMarker.rating}
            </Text>
          </View>
              </View>

          <View style={[styles.locationContainer, darkMode && styles.locationContainerDarkTheme]}>
            <Ionicons name="location-sharp" size={18} color={darkMode ? 'white' : 'black'} />
            <Text style={{ marginLeft: 5, color: darkMode ? 'white' : 'black'}}>
              {`${selectedMarker && selectedMarker.location.streetName} `+ 
              `${selectedMarker && selectedMarker.location.streetNumber}, ` + 
              `${selectedMarker && selectedMarker.location.postalCode} `+ 
              `${selectedMarker && selectedMarker.location.city}, ` +
              `${selectedMarker && selectedMarker.location.country}`}
            </Text>
          </View>

          <Text style={{ marginTop: 10, color: darkMode ? 'white' : 'black' }}>
            {selectedMarker && selectedMarker.description}
          </Text>
          <Text style={{ marginTop: 10, color: darkMode ? 'white' : 'black' }}>
            {t('pages.MapPage.telephone', {phoneNumber: selectedMarker && selectedMarker.phoneNumber})}
          </Text>
          <Text style={{color: darkMode ? 'white' : 'black'}}>
            {t('pages.MapPage.website', {website: selectedMarker && selectedMarker.website})}
          </Text>

          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={handleMenu} 
                style={styles.menuButton}
              >
                <Text style={styles.buttonText}>{t('pages.MapPage.menu')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleNavigate} 
                style={styles.navigateButton}
              >
                <Text style={styles.buttonText}>{t('pages.MapPage.navigate')}</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilterPopup(true)}
      >
        <Ionicons name="filter-outline" size={24} color="white" />
      </TouchableOpacity>

      <Modal isVisible={showFilterPopup} style={{ marginTop: 50 }}>
      <ScrollView style={darkMode ? styles.filterPopupDark : styles.filterPopup}>
        <View style={darkMode ? styles.filterPopupDark : styles.filterPopup}>
          <Text style={[darkMode && styles.darkModeTxt, styles.popupHeading]}>{t('pages.MapPage.filter')}</Text>

          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.rating')}</Text>
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

          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.range')}</Text>
              <Slider
                thumbStyle={styles.thumb}
                value={range}
                onValueChange={(value) => setRange(value)}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor="#6d071a"
                maximumTrackTintColor="#e2b0b3"
                thumbTintColor="#6d071a" 
              />
              <Text style={[darkMode && styles.darkModeTxt, styles.distanceText]}>{t('pages.MapPage.distance', {range: range})}</Text>

          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.categories')}</Text>

          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryBox, 
                  { backgroundColor: category.selected ? '#e2b0b3' : 'white' }]}
                onPress={() => handleCategoryToggle(index)}
              >
                <Text>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.allergens')}</Text>
          <View style={styles.categoriesContainer}>
            {allergens.map((allergen, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryBox, 
                  { backgroundColor: allergen.selected ? '#e2b0b3' : 'white' }]}
                onPress={() => handleAllergenToggle(index)}
              >
                <Text>{allergen.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.save-filter')}</Text>
            <TextInput
              style={styles.saveInput}
              placeholder={t('pages.MapPage.enter-filter-name') as string}
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
          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.MapPage.saved-filters')}</Text>
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
                    <Text style={styles.buttonTextPopup}>{t('pages.MapPage.load')}</Text>
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
              onPress={clearFilters}
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
          onPress={() => setShowFilterPopup(false)}
        >
            <Ionicons name="close-circle" size={24} color="#6d071a" />
          </TouchableOpacity>
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default MapPage;
