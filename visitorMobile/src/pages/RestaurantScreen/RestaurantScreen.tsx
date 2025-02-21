import React, {useEffect, useState, useCallback, useContext, useRef} from 'react';
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
import {Slider} from 'react-native-elements';
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
import {getCategories} from "../../services/categorieCalls";
import { getVisitorUserPermission } from '../../services/permissionsCalls';

const MyRestaurantsScreen = () => {
  const navigation = useNavigation();
  const [restoData, setRestoData] = useState<IRestaurantFrontEnd[]>([]);
  const [selectedRestoData, setSelectedRestoData] = 
    useState<IRestaurantFrontEnd[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [distance, setDistance] = useState(0);
  const [categories, setCategories] = useState([]);
  const hasLoadedFilter = useRef(false);
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
    { name: 'sulphites', selected: false },
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
  const [premium, setPremium] = useState<boolean>(false);

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
  
  if (!premium) {
    for (let i = adFrequency - 1; i < dataWithAds.length; i += adFrequency) {
      dataWithAds.splice(i, 0, { isAd: true });
    }
  }
  
  const [filterLimit, setFilterLimit] = useState<number | null>(null);
  const userProfileName: string = t('common.me') as string;
  const [groupProfiles, setGroupProfiles] = useState<AllergenProfile[]>([]);
  const [defaultAllergens, setDefaultAllergens] = useState([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [loadingAllergens, setLoadingAllergens] = useState(true);

  useEffect(() => {
    const loadAllergensAndFavourites = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) return;
      setLoadingAllergens(true);
      const userAllergens = await getUserAllergens(userToken);

      const updatedAllergens = allergens.map((allergen) => ({
        ...allergen,
        selected: userAllergens.includes(allergen.name),
      }));

      setAllergens(updatedAllergens);
      setSelectedAllergens(updatedAllergens.filter(a => a.selected).map(a => a.name));

      const newFilter = {
        range: distance,
        rating: [rating, 5],
        name: nameFilter,
        location: locationFilter,
        categories: categories.filter(c => c.selected).map(c => c.name),
        allergenList: updatedAllergens.filter(a => a.selected).map(a => a.name),
        userLoc: userPosition
      };

      setFilter(newFilter);
      await fetchFavourites();
      setLoadingAllergens(false);
    };

    loadAllergensAndFavourites()
      .then(() => console.log("Loaded allergens and favourites ", allergens))
      .catch((error) => console.error("Error loading allergens or favourites:", error));
  
  }, []);

  const getPremium = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const permissions = await getVisitorUserPermission(userToken);
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
    if (isFocused) {
      loadSavedFilters();
    }
    getPremium();
    fetchFavourites().then(r => console.log("Loaded favourite resto list"));
    fetchDarkMode();
    fetchGroupProfile();
  }, [isFocused]);

  const fetchGroupProfile = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    getUserAllergens(userToken).then((userAllergens) => {
      const profileCopy = groupProfiles[0] ?? { name: userProfileName, allergens: allergens};
      for (let j = 0; j < profileCopy.allergens.length; j++) {
        profileCopy.allergens[j].selected = false;
      }
      for (let i = 0; i < userAllergens.length; i++) {
        profileCopy.allergens.map((state, index) => {
          if (userAllergens[i] === state.name) {
            profileCopy.allergens[index].selected = true;
          }
        });
      }
      setGroupProfiles([profileCopy]);
      setSelectedProfileIndex(0);
      AsyncStorage.setItem('groupProfiles', JSON.stringify([profileCopy]));
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
    const userToken = await AsyncStorage.getItem('userToken');
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
    if (!loadingAllergens) {
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
    }
  }, [filter, loadingAllergens]);

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
    const userToken = await AsyncStorage.getItem('userToken');
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
    const userToken = await AsyncStorage.getItem('userToken');
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

    getCategories(userToken)
        .then((res) => {
          setCategories(res.map(category => ({name: category, selected: false})));
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

  const onRefresh = useCallback(async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    setRefreshing(true);
    getPremium();
    getCategories(userToken).then((res) => {
      setCategories(res.map(category => ({name: category, selected: false})));
    });
    const newFilter = resetFilters();
    getFilteredRestosNew(filter)
      .then((res) => {
        setRestoData(res);
        setSelectedRestoData(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
    setRefreshing(false);
  }, []);

  useEffect(() => {
    setSelectedAllergens(allergens.filter(a => a.selected).map(a => a.name));
  }, [allergens]);

  useEffect(() => {
    if (categories.length > 0 && !hasLoadedFilter.current) {
      hasLoadedFilter.current = true;
    }
  }, [categories]);

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  const setFilteredRestos = async (filter: ISearchCommunication) => {
    try {
      const restos: IRestaurantFrontEnd[] = await getFilteredRestosNew(filter);
      if (restos.length === 0) {
        console.warn('No restaurants match the filter.');
      }
      const updatedRestoData = restos.map(resto => ({
        ...resto,
        isFavouriteResto: isFavouriteRestos.includes(resto.uid),
      }));
      setSelectedRestoData(updatedRestoData);
    } catch (error) {
      console.error('Error fetching filtered restaurants:', error);
      setSelectedRestoData([]);
    }
  };

  const handleFilter = async () => {
    setNameFilter(nameFilter ?? '');
    setLocationFilter(locationFilter ?? '');
    const selectedRating = rating > 0 ? [rating, 5] : undefined;
  
    let filter: ISearchCommunication = {
      range: distance > 0 ? distance : undefined,
      rating: selectedRating,
      name: nameFilter?.trim() || undefined,
      location: locationFilter?.trim() || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      allergenList: selectedAllergens.length > 0 ? selectedAllergens : undefined,
      userLoc: userPosition || undefined,
    };
    filter = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v !== undefined));  
    try {
      await setFilteredRestos(filter);
      setFilter(filter);
    } catch (error) {
      console.error('Error applying filter:', error);
    }
    setIsTabVisible(false);
  };
  
  const handleRatingChange = (index: number) => {
    setRating(index);
  };

  const handleDistanceChange = (value: number) => {
    setDistance(value);
  };

  const handleCategoryToggle = (index: number) => {
    setNameFilter(nameFilter ?? '');
    setLocationFilter(locationFilter ?? '');
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
    AsyncStorage.setItem('groupProfiles', JSON.stringify(groupProfilesCopy));
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

  const getUserAllergensFunc = async (): Promise<Allergen[]> => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) return [];

    const userAllergens = await getUserAllergens(userToken);
    return allergens.map((allergen) => ({
      ...allergen,
      selected: userAllergens.includes(allergen.name),
    }));
  };


  const resetFilters = async () => {
    setNameFilter('');
    setLocationFilter('');
    setRating(0);
    setDistance(0);
    setSelectedCategories([]);

    setCategories(prevCategories =>
        prevCategories.map(category => ({ ...category, selected: false }))
    );

    const userDefaultAllergens = await getUserAllergensFunc();
    console.log("Reset Filters -> Loaded default allergens:", userDefaultAllergens);

    setAllergens(userDefaultAllergens);
    setSelectedAllergens(userDefaultAllergens.filter(a => a.selected).map(a => a.name));

    setGroupProfiles([{
      name: userProfileName,
      allergens: userDefaultAllergens,
    }]);

    AsyncStorage.setItem('groupProfiles', JSON.stringify([{
      name: userProfileName,
      allergens: userDefaultAllergens,
    }]));

    const newFilter: ISearchCommunication = {
      rating: [0, 5],
      range: 0,
      name: '',
      location: '',
      categories: [],
      allergenList: userDefaultAllergens.filter(a => a.selected).map(a => a.name),
      userLoc: userPosition
    };

    setFilter(newFilter);
    setSelectedProfileIndex(0);
  };



  const handleSaveFilter = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
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
      groupProfiles: groupProfiles.map((profile) => (
        {
          name: profile.name,
          allergens: profile.allergens.map((allergen) => (
            {
              name: allergen.name,
              value: allergen.selected,
              selected: allergen.selected,
            }
          )),
        }
      )),
      userLoc: userPosition
    };

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
          value: allergen['value'],
        })),
      }));
    }
    const tempGroupProfiles = adjustedGroupProfiles ?? [{
      name: userProfileName,
      allergens: defaultAllergens,
    }]
    setGroupProfiles(tempGroupProfiles);
    AsyncStorage.setItem('groupProfiles', JSON.stringify(tempGroupProfiles));
    setAllergens(updatedAllergens);
  };

  const handleDeleteFilter = async (filterName: string) => {
    const userToken = await AsyncStorage.getItem('userToken');
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
      const profileCopy = [
        ...groupProfiles,
        { name: newProfileName, allergens: allergens.map(allergen => ({ name: allergen.name, value: false, selected: false })) }
      ];
      setGroupProfiles(profileCopy);
      AsyncStorage.setItem('groupProfiles', JSON.stringify(profileCopy));
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
                      <Text>{t('food-allergene.' + allergen.name)}</Text>
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
