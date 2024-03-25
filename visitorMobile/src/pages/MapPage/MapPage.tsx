import React, { useState, useEffect } from 'react';
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
  TouchableWithoutFeedback 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import { 
  IRestaurantFrontEnd
} from '../../../../shared/models/restaurantInterfaces';
import { 
  ISearchCommunication 
} from '../../../../shared/models/communicationInterfaces';
import { 
  getSelectedFilteredRestos, 
  getAllResto 
} from '../../services/restoCalls';
import styles from './MapPage.styles';
import MenuPage from '../MenuPage/MenuPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import placeholderImage from '../../../assets/logo.png';
import { CheckBox, Slider } from 'react-native-elements';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {addSavedFilter, deleteSavedFilter, getSavedFilters} from "../../services/profileCalls";
import { defaultRestoImage } from "../../../assets/placeholderImagesBase64";
import { getImages } from "../../services/imageCalls";

function findMinMax(arr: any) {
  if (!arr || arr.length === 0) {
    return [0, 5];
  }

  let minVal = arr[0];
  let maxVal = arr[0];

  for (let i = 1; i < arr.length; i++) {
    const num = arr[i];
    if (num < minVal) {
      minVal = num;
    } else if (num > maxVal) {
      maxVal = num;
    }
  }

  return [minVal, maxVal];
}


const Epitech = [13.328820, 52.508540];// long,lat

const MapPage = () => {
  const [markers, setMarkers] = useState<IRestaurantFrontEnd[]>([]);

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

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [range, setRange] = useState(100);
  const navigation = useNavigation();
  const [saveFilterStatus, setSaveFilterStatus] = useState({
    success: false,
    error: false,
    message: '',
  });


  useEffect(() => {
    updateRestoData();
    loadSavedFilters();
  }, []);

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
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    getSavedFilters(userToken).then((res) => {
      setSavedFilters(res);
    })
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
        const restaurantId = selectedMarker.id;
        const restaurantName = selectedMarker.name;
        toggleModal();
        navigation.navigate('MenuPage', { restaurantId, restaurantName });
      }
    } catch (error) {
      console.error('Error navigating to MenuPage:', error);
    }
  };

  const handleSearch = () => {
    if (nameFilter || locationFilter) {
      const filtered = markers.filter((marker) => {
        const nameMatch = !nameFilter || 
        marker.name.toLowerCase().includes(nameFilter.toLowerCase());
        const locationMatch = !locationFilter || 
        marker.location.city.toLowerCase()
          .includes(locationFilter.toLowerCase());
        return nameMatch && locationMatch;
      });
      setFilteredMarkers(filtered);
    } else {
      setFilteredMarkers(markers);
    }
    Keyboard.dismiss();
  };

  const handleFilter = async () => {
    const inter: ISearchCommunication = {
      range: range,
      rating: findMinMax(selectedRating),
      name: nameFilter,
      location: locationFilter,
      categories: selectedCategories,
      allergenList: selectedAllergens
    }
    setFilteredMarkers(await getSelectedFilteredRestos(inter));

    setShowFilterPopup(false);
  };

  const clearFilters = async () => {
    setSelectedRating([]);
    setSelectedAllergens([]);
    setSelectedCategories([]);
    setRange(100);
    await AsyncStorage.removeItem('filter');
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
    const filter : ISearchCommunication = {
      filterName: filterName,
      range: range,
      rating: findMinMax(selectedRating),
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

    setSelectedCategories(newFilter.categories);
    setSelectedAllergens(newFilter.allergenList);
    setSelectedRating(newFilter.rating);
    setRange(newFilter.range);
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
        const remainingFilters = savedFilters.filter((filter) => filter.filterName !== filterName);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
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

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Epitech[1],
          longitude: Epitech[0],
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
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

      <Modal isVisible={isModalVisible} style={{ margin: 0 }}>
        <View style={styles.modalContent}>
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
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>
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
                style={styles.starIcon}
                />
                );
              })}
            <Text style={{ marginLeft: 5 }}>
              {selectedMarker && selectedMarker.rating}
            </Text>
          </View>
              </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={18} color="black" />
            <Text style={{ marginLeft: 5 }}>
              {`${selectedMarker && selectedMarker.location.streetName} `+ 
              `${selectedMarker && selectedMarker.location.streetNumber}, ` + 
              `${selectedMarker && selectedMarker.location.postalCode} `+ 
              `${selectedMarker && selectedMarker.location.city}, ` +
              `${selectedMarker && selectedMarker.location.country}`}
            </Text>
          </View>

          <Text style={{ marginTop: 10 }}>
            {selectedMarker && selectedMarker.description}
          </Text>
          <Text style={{ marginTop: 10 }}>
            Telephone: {selectedMarker && selectedMarker.phoneNumber}
          </Text>
          <Text>Website: {selectedMarker && selectedMarker.website}</Text>

          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={handleMenu} 
                style={styles.menuButton}
              >
                <Text style={styles.buttonText}>Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleNavigate} 
                style={styles.navigateButton}
              >
                <Text style={styles.buttonText}>Navigate</Text>
              </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilterPopup(true)}
      >
        <Ionicons name="md-funnel" size={24} color="white" />
      </TouchableOpacity>

      <Modal isVisible={showFilterPopup} style={{ marginTop: 50 }}>
      <ScrollView style={styles.filterPopup}>
        <View style={styles.filterPopup}>
          <Text style={styles.popupHeading}>Filter Options</Text>

          <Text style={styles.categoryText}>Rating:</Text>
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <CheckBox
              key={rating}
              title={`${rating} Stars`}
              checked={selectedRating.includes(rating)}
              onPress={() => {
                setSelectedRating((prev) =>
                  prev.includes(rating) ? prev.filter((item) => 
                    item !== rating) : [...prev, rating]
                );
              }}
            />
          ))}

          <Text style={styles.categoryText}>Range:</Text>
              <Slider
                thumbStyle={styles.thumb}
                value={range}
                onValueChange={(value) => setRange(value)}
                minimumValue={0}
                maximumValue={500}
                step={10}
                thumbTintColor="red" 
              />
              <Text style={{ marginBottom: 10 }}>Selected Range: {range}</Text>

          <Text style={styles.categoryText}>Categories:</Text>

          {['Burger', 'Sushi', 'Pizza', 'Salad', 'Pasta'].map((category) => (
            <CheckBox
              key={category}
              title={category}
              checked={selectedCategories.includes(category)}
              onPress={() => {
                setSelectedCategories((prev) =>
                  prev.includes(category) ? prev.filter((item) => 
                    item !== category) : [...prev, category]
                );
              }}
            />
          ))}

          <Text style={styles.categoryText}>Allergens:</Text>
          {['Milk', 'Peanut', 'Shellfish', 'Eggs'].map((allergen) => (
            <CheckBox
              key={allergen}
              title={allergen}
              checked={selectedAllergens.includes(allergen)}
              onPress={() => {
                setSelectedAllergens((prev) =>
                  prev.includes(allergen) ? prev.filter((item) => 
                    item !== allergen) : [...prev, allergen]
                );
              }}
            />
          ))}

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
              onPress={clearFilters}
            >
              <Text style={styles.buttonTextPopup}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterPopupButton}
              onPress={handleFilter}
            >
              <Text style={styles.buttonTextPopup}>Filter</Text>
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
