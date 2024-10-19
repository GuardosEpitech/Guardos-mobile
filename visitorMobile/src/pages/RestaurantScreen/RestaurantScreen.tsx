import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
  RefreshControl,
  ScrollView,
  Button,
  Alert,
  Linking
} from 'react-native';
import {Chip, Slider} from 'react-native-elements';
import {useFocusEffect, useNavigation, useIsFocused} from '@react-navigation/native';
import Card from '../../components/RestaurantCard/RestaurantCard';
import AdCard from '../../components/AdCard/AdCard';
import styles from './RestaurantScreen.styles'
import { getAllResto , getFilteredRestosNew} from '../../services/restoCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {IRestaurantFrontEnd} from '../../models/restaurantsInterfaces';
import {Allergen, AllergenProfile} from '../../../../shared/models/restaurantInterfaces';
import {
  addSavedFilter,
  deleteSavedFilter, getSavedFilterLimit,
  getSavedFilters
} from "../../services/profileCalls";
import { 
  ISearchCommunication 
} from '../../../../shared/models/communicationInterfaces';
import { FilterContext } from '../../models/filterContext';
import {getRestoFavourites} from "../../services/favourites";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import * as Location from 'expo-location';
import {getUserAllergens} from "../../services/userCalls";

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
  const [allergens, setAllergens] = useState<Allergen[]>([
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
  const adFrequency = 5;
  const dataWithAds = [...selectedRestoData];
  const [userPosition, setUserPosition] = React.useState<{ lat: number; lng: number } | null>(null);

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
      setUserPosition({lat: location.coords.latitude, lng: location.coords.longitude});
    })();
  }, []);

  for (let i = adFrequency - 1; i < dataWithAds.length; i += adFrequency) {
    dataWithAds.splice(i, 0, { isAd: true });
  }
  const [filterLimit, setFilterLimit] = useState<number | null>(null);
  const userProfileName: string = t('common.me') as string;
  const [groupProfiles, setGroupProfiles] = useState<AllergenProfile[]>([]);
  const [defaultAllergens, setDefaultAllergens] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    if (isFocused) {
      loadSavedFilters();
    }
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    fetchDarkMode();

    fetchGroupProfile();

    setGroupProfiles([{
      name: userProfileName,
      allergens: allergens.map(allergen => ({ ...allergen, value: false, colorButton: "primary" })),
    }]);
  }, [isFocused]);

  const fetchGroupProfile = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }
    getUserAllergens(userToken).then((userAllergens) => {
      const profileCopy = groupProfiles[0] ?? { name: userProfileName, allergens: allergens};
      for (let i = 0; i < userAllergens.length; i++) {
        profileCopy.allergens.map((state, index) => {
          if (userAllergens[i] === state.name) {
            profileCopy.allergens[index].selected = true;
          }
        });
      }
      setGroupProfiles([profileCopy]);
      setDefaultAllergens(profileCopy.allergens);
    });
  }

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

    getSavedFilterLimit(userToken)
      .then((res) => {
        setFilterLimit((res && res.filterLimit) ? res.filterLimit : 0);
      });
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
        allergenList: selectedAllergens,
        userLoc: userPosition
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
      allergenList: selectedAllergens,
      userLoc: userPosition
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
    const updatedAllergens = [...getSelectedProfileAllergens()];
    updatedAllergens[index].selected = !updatedAllergens[index].selected;
    const groupProfilesCopy = groupProfiles;
    groupProfilesCopy[selectedProfileIndex].allergens = updatedAllergens;
    setGroupProfiles(groupProfilesCopy);
    AsyncStorage.setItem('groupProfiles', JSON.stringify(groupProfiles));
    const allergenListSelected: string[] = [];
    for (let i = 0; i < groupProfiles.length; i++) {
      for (let j = 0; j < groupProfiles[i].allergens.length; j++) {
        if (groupProfiles[i].allergens[j].selected) {
          allergenListSelected.push(groupProfiles[i].allergens[j].name);
        }
      }
    }
    setSelectedAllergens(allergenListSelected);
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
    setGroupProfiles([{
      name: userProfileName,
      allergens: defaultAllergens,
    }]);
    setSelectedProfileIndex(0);
  };

  const handleSaveFilter = async () => {
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null || !filterName) {
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
    if (savedFilters.some(filter => filter.filterName === filterName)) {
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
      allergenList: selectedAllergens,
      userLoc: userPosition
    }

      setFilterName('');
    addSavedFilter(userToken, filter).then((res) => {
      if (res !== null) {
        if (res.status == 203) {
          setSaveFilterStatus({
            success: false,
            error: true,
            message: t('pages.RestaurantScreen.save-filter-limit-reached') as string,
          });
          console.error('Error saving filter: reached limit');
          setTimeout(() => {
            setSaveFilterStatus({
              success: false,
              error: false,
              message: '',
            });
          }, 5000);
        }
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
    let adjustedGroupProfiles: AllergenProfile[] = null;
    if (newFilter.groupProfiles) {
      adjustedGroupProfiles = newFilter.groupProfiles.map((profile) => ({
        name: profile.name,
        allergens: profile.allergens.map((allergen) => ({
          name: allergen.name,
          selected: allergen['value'],
        })),
      }));
    }
    const tempGroupProfiles = adjustedGroupProfiles ?? [{
      name: userProfileName,
      allergens: updatedAllergens,
    }]
    setGroupProfiles(tempGroupProfiles);
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

  const handleRemoveProfile = (index: number) => {
    const remainingProfiles = groupProfiles.filter((_, i) => i !== index);
    const allergenListChanged: string[] = [];
    setGroupProfiles(remainingProfiles);
    if (Number(selectedProfileIndex) === index && groupProfiles.length > 1) {
      setSelectedProfileIndex(index === 0 ? 0 : index - 1);
    }

    for (let i = 0; i < remainingProfiles.length; i++) {
      const allergens = remainingProfiles[i].allergens;
      for (let j = 0; j < allergens.length; j++) {
        if (allergens[j].selected && !allergenListChanged.includes(allergens[j].name)) {
          allergenListChanged.push(allergens[j].name);
        }
      }
    }
    AsyncStorage.setItem('groupProfiles', JSON.stringify(remainingProfiles));
  };

  const handleProfileChange = (event) => {
    setSelectedProfileIndex(event);
  };

  const handleAddProfile = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileSave = () => {
    if (newProfileName && !groupProfiles.some(profile => profile.name === newProfileName)) {
      setGroupProfiles([
        ...groupProfiles,
        { name: newProfileName, allergens: allergens.map(allergen => ({ ...allergen, value: false, colorButton: "primary" })) }
      ]);
      setSelectedProfileIndex(groupProfiles.length);
    }
    setNewProfileName('');
    setOpenProfileDialog(false);
  };

  const handleProfileCancel = () => {
    setNewProfileName('');
    setOpenProfileDialog(false);
  };

  const getSelectedProfileAllergens = () : Allergen[] => {
    if (!groupProfiles || groupProfiles.length <= selectedProfileIndex) {
      return [];
    }
    return groupProfiles[selectedProfileIndex].allergens;
  }

  return (
    <View style={[darkMode ? styles.containerDark : styles.container]}>
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
          data={dataWithAds}
          renderItem={({ item, index }) => {
            if (item.isAd) {
              return <AdCard />;
            } else {
              return (
                <TouchableOpacity onPress={() => navigateToMenu(item.uid, item.name)}>
                  <Card info={item} isFavouriteResto={item.isFavouriteResto} isSmallerCard={false}/>
                </TouchableOpacity>
              );
            }
          }}
          keyExtractor={(item, index) => item.uid ? item.uid.toString() : `ad-${index}`}
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
          <ScrollView style={darkMode ? styles.filterPopupDark : styles.filterPopup}>
            <View style={darkMode ? styles.filterPopupDark : styles.filterPopup}>
              <Text style={[darkMode && styles.darkModeTxt, styles.popupHeading]}>{t('pages.RestaurantScreen.filter')}</Text>

              <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.rating')}</Text>
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

              <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.distance')}</Text>
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
              <Text style={[darkMode && styles.darkModeTxt, styles.distanceText]}>{t('pages.RestaurantScreen.distance-details', {distance: distance})}</Text>

              <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.categories')}</Text>
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

              <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.allergens')}</Text>
              <View>
                {/* Scrollable list of allergen profiles */}
                <ScrollView horizontal>
                  {groupProfiles.map((profile, index) => (
                    <>
                      <TouchableOpacity key={index} onPress={() => handleProfileChange(String(index))}>
                        <Text style={{ margin: 10, padding: 5, backgroundColor: index === Number(selectedProfileIndex) ? 'lightgray' : 'white' }}>
                          {profile.name}
                          {index > 0 && (
                            <TouchableOpacity onPress={() => handleRemoveProfile(index)}>
                              <Icon name="trash" size={12} />
                            </TouchableOpacity>
                          )}
                        </Text>
                      </TouchableOpacity>
                    </>
                  ))}
                  <TouchableOpacity onPress={handleAddProfile}>
                    <Icon name="add" size={24} />
                  </TouchableOpacity>
                </ScrollView>

                {/* Dialog for adding a new profile */}
                {openProfileDialog && (
                  <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 5 }}>
                    <Text style={{ fontSize: 20 }}>Add New Profile</Text>
                    <TextInput
                      style={{ borderBottomWidth: 1, marginVertical: 10 }}
                      placeholder={t('pages.RestaurantScreen.enter-name')}
                      value={newProfileName}
                      onChangeText={setNewProfileName}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Button title={t('common.cancel')} onPress={handleProfileCancel} />
                      <Button title={t('common.save')} onPress={handleProfileSave} />
                    </View>
                  </View>
                )}

                {/* Display selected allergen profile */}
                <View style={styles.categoriesContainer}>
                  { getSelectedProfileAllergens().map((allergen, allergenIndex) => (
                    <TouchableOpacity
                      key={allergenIndex}
                      style={[styles.categoryBox,
                        { backgroundColor: allergen.selected ?
                            '#e2b0b3' : 'white' }]}
                      onPress={() => handleAllergenToggle(allergenIndex)}
                    >
                      <Text>{allergen.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
            <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.save-filter')}</Text>
            <Text style={styles.filterLimit}>
              {t('pages.MapPage.saved-filters-overview', { used: savedFilters.length, limit: filterLimit })}
            </Text>
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
          <Text style={[darkMode && styles.darkModeTxt, styles.categoryText]}>{t('pages.RestaurantScreen.saved-filters')}</Text>
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
