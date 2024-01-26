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
import { Ionicons } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import placeholderImage from '../../../assets/logo.png';
import { CheckBox, Slider } from 'react-native-elements';

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

  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [range, setRange] = useState(100);


  useEffect(() => {
    updateRestoData();
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setImageError(false);
  }, [isModalVisible]);

  const handleMarkerPress = (marker) => {
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

  const clearFilters = () => {
    setSelectedRating([]);
    setSelectedAllergens([]);
    setSelectedCategories([]);
    setRange(100);
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
            key={marker.id}
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
                ? { uri: selectedMarker.pictures[0] }
                : placeholderImage
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
              <TouchableOpacity onPress={handleMenu} style={styles.menuButton}>
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
                value={100}
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