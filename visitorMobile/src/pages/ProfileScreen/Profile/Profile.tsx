import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Button,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from './Profile.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import {editVisitorProfileDetails, getVisitorProfileDetails} from "../../../services/profileCalls";
import {deleteAccount} from "../../../services/userCalls";
import RestaurantCard from "../../../components/RestaurantCard/RestaurantCard";
import DishCard from "../../../components/DishCard/DishCard";
import {getDishFavourites, getRestoFavourites} from "../../../services/favourites";
import { CommonActions, useIsFocused } from '@react-navigation/native';
import i18n from "i18next";
import {useTranslation} from "react-i18next";
import {IimageInterface} from "../../../models/imageInterface";
import {addProfileImage, deleteProfileImage, getImages} from "../../../services/imageCalls";
import {addIngredient, getAllIngredients} from "../../../services/ingredientsCalls";
import {Dialog} from "react-native-elements";

DropDownPicker.addTranslation("DE", {
  PLACEHOLDER: "Wählen Sie ein Element aus",
  SEARCH_PLACEHOLDER: "Suche...",
  SELECTED_ITEMS_COUNT_TEXT: "{count} Elemente ausgewählt",
  NOTHING_TO_SHOW: "Es gibt nichts zu zeigen!"
});

DropDownPicker.addTranslation("FR", {
  PLACEHOLDER: "Sélectionnez un élément",
  SEARCH_PLACEHOLDER: "Tapez quelque chose...",
  SELECTED_ITEMS_COUNT_TEXT: "{count} éléments ont été sélectionnés",
  NOTHING_TO_SHOW: "Il n'y a rien à montrer!"
});

type ProfileScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const Profile: React.FC<ProfileScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [image, setImage] = useState<number | null>(null);
  const [pictureId, setPictureId] = useState<number>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [allergens, setAllergens] = useState([]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContentType, setModalContentType] = useState('');
  const [selectedDislikedIngredients, setSelectedDislikedIngredients] = useState([]);
  const [dbIngredients, setDBIngredients] = useState([]);
  const [openAddIngredientPopup, setOpenAddIngredientPopup] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [language, setLanguage] = useState<string>('en');
  const {t} = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const languageOptions = [
    {label: t('common.english'), value: 'en'},
    {label: t('common.german'), value: 'de'},
    {label: t('common.french'), value: 'fr'},
  ];

  const allergenNames = [
    "celery",
    "gluten",
    "crustaceans",
    "eggs",
    "fish",
    "lupin",
    "milk",
    "molluscs",
    "mustard",
    "peanuts",
    "sesame",
    "soybeans",
    "sulphites",
    "tree nuts",
  ];
  const [dataChangeStatus, setDataChangeStatus] = useState(null);
  const [saveFailureType, setSaveFailureType] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restoPage, setRestoPage] = useState(1);
  const [dishPage, setDishPage] = useState(1);
  const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
  const pageSize = 3; // Number of items per page
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const [ingredientFeedback, setIngredientFeedback] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    loadDarkModeState();
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }
        const res = await getAllIngredients();
        if (res) {
          const tmp = Array.from(new Set(res.map((ingredient: any) => ingredient.name)));
          setDBIngredients(tmp);
        }
        getVisitorProfileDetails(userToken)
          .then((res) => {
            setEmail(res.email);
            setName(res.username);
            setCity(res.city);
            setAllergens(res.allergens);
            setSelectedDislikedIngredients(res.dislikedIngredients);
            setImage(res.profilePicId);
            setLanguage(res.preferredLanguage);
            loadImages(res.profilePicId).then(r => console.log("Loaded user picture successfully"));
          });
        await fetchFavoriteRestaurants();
        await fetchFavoriteDishes();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData().then(r => console.log("Loaded user data successfully"));
  }, []);

  const loadImages = async (picId) => {
    if (picId) {
      try {
        const answer = await getImages([picId]);
        //@ts-ignore
        setProfilePic(answer.map((img) => ({
          base64: img.base64,
          contentType: img.contentType,
          filename: img.filename,
          size: img.size,
          uploadDate: img.uploadDate,
          id: img.id,
        })));
      } catch (error) {
        console.error("Failed to load images", error);
        setProfilePic([]);
      }
    } else {
      setProfilePic([]);
    }
  };

  const allergensOptions = useMemo(() => {
    return allergenNames.map((name) => ({
      label: t('food-allergene.' + name),
      value: name,
    }));
  }, [i18n.language]);

  const handleFileChange = async (assets: ImagePicker.ImagePickerAsset[]) => {
    if (assets.length === 0) {
      return;
    }
    const asset = assets[0];
    const file = {
      name: asset.fileName,
      type: asset.mimeType,
      size: asset.fileSize,
      uri: 'data:' + asset.mimeType + ';base64,' + asset.base64
    }
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }

    addProfileImage(userToken, file.name,
      file.type, file.size, file.uri)
      .then(r => {
        setProfilePic([{ base64: file.uri, contentType: file.type,
          filename: file.name, size: file.size,
          uploadDate: "0", id: r.message }]);
        setImage(r.message);
      });
  };

  const handleFileDelete = async () => {
    if (image) {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        return;
      }

      deleteProfileImage(image, userToken);
      setProfilePic([]);
    }
    else {
      console.log("No image to delete");
    }
  }

  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      await saveDarkModeState(newDarkMode);
      refreshApp();
    } catch (error) {
      console.error('Error storing dark mode value:', error);
    }
  };

  const saveDarkModeState = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('DarkMode', JSON.stringify(value));
    } catch (error) {
      console.error('Error storing dark mode value:', error);
    }
  };
  
  const loadDarkModeState = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        setDarkMode(JSON.parse(darkModeValue));
      }
    } catch (error) {
      console.error('Error loading dark mode value:', error);
    }
  };

  const refreshApp = () => {
    setRefresh((prevRefresh) => !prevRefresh);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  const fetchFavoriteRestaurants = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken === null) {
      return;
    }
    const favorites = await getRestoFavourites(userToken);
    setFavoriteRestaurants(favorites);
  };

  const fetchFavoriteDishes = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken === null) {
      return;
    }
    const favorites = await getDishFavourites(userToken);
    setFavoriteDishes(favorites);
  };

  const handleTabChange = async (tab: any) => {
    setActiveTab(tab);
    await fetchFavoriteRestaurants();
    await fetchFavoriteDishes();
  };

  const handleNextPage = () => {
    if (activeTab === 'restaurants') {
      setRestoPage(prevPage => prevPage + 1);
    } else {
      setDishPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeTab === 'restaurants') {
      setRestoPage(prevPage => prevPage - 1);
    } else {
      setDishPage(prevPage => prevPage - 1);
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker
      .requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert(t('common.need-cam-permissions'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let base64: string = '';

      if (result.assets && result.assets.length > 0 &&
        'base64' in result.assets[0]) {
        base64 = result.assets[0].base64 as string;
      }

      if (base64) {
        await handleFileChange(result.assets);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('pages.Profile.logout') as string,
      t('pages.Profile.confirm-logout') as string,
      [
        {
          text: t('common.cancel') as string,
          style: 'cancel',
        },
        {
          text: t('pages.Profile.logout') as string,
          onPress: () => {
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('userName');
            setLoggedInStatus(false);
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('pages.Profile.delete-account') as string,
      t('pages.Profile.confirm-delete-account') as string,
      [
        {
          text: t('common.cancel') as string,
          style: 'cancel',
        },
        {
          text: t('common.delete') as string,
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken === null) {
              Alert.alert(
                t('common.error') as string,
                t('pages.Profile.delete-account-failure-login') as string
              );
            }
            deleteAccount(userToken).then(res => {
              if (res !== null) {
                AsyncStorage.removeItem('userToken');
                AsyncStorage.removeItem('userName');
                setLoggedInStatus(false);
                navigation.navigate('Login');
              } else {
                Alert.alert(
                  t('common.error') as string,
                  t('pages.Profile.delete-account-failure-retry') as string
                );
              }
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleCityChange = (text) => {
    setCity(text);
  };

  const handleSave = async () => {
    setDataChangeStatus(null);
    setSaveFailureType(null);
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      setDataChangeStatus("failed");
      return;
    }
    const res = await editVisitorProfileDetails(userToken, {
      username: name,
      email: email,
      city: city,
      allergens: allergens,
      preferredLanguage: language,
      dislikedIngredients: selectedDislikedIngredients
    });
    i18n.changeLanguage(language);

    let isError = false;

    if (typeof res === "string") {
      if (!res) {
        isError = true;
      } else {
        await AsyncStorage.setItem('userToken', res);
      }
    } else if (Array.isArray(res) && res.length === 2) {
      isError = true;
      if (res[0] === true) {
        setSaveFailureType("email");
      } else if (res[1] === true) {
        setSaveFailureType("username");
      }
    } else {
      isError = true;
      console.error('Error updating user data:');
    }

    if (isError) {
      setDataChangeStatus("failed");
      setTimeout(() => {
        setDataChangeStatus(null);
      }, 5000);
    } else {
      setDataChangeStatus("success");
      setTimeout(() => {
        setDataChangeStatus(null);
      }, 5000);
    }
  };

  const handleNavigateToChangePassword = () => {
    navigation.navigate('Change Password');
  };

  const handleFeatureRequest = () => {
    navigation.navigate('FeatureRequest', {});
  };

  const handleSupportRequest = () => {
    navigation.navigate('UserSupport', {});
  }

  const handleRedirectSubscriptions = () => {
    navigation.navigate('Subscriptions', {});
  };

  const handleRedirectUserReview = () => {
    navigation.navigate('UserReview', {});
  };

  const handleTerms = () => {
    navigation.navigate('Terms and Conditions', {});
  };

  const handlePrivacy = () => {
    navigation.navigate('Privacy', {});
  };

  const handleImprint = () => {
    navigation.navigate('Imprint', {});
  };

  const handlePayment = () => {
    navigation.navigate('Payment methods');
  };

  const closeAllPopups = () => {
    setOpenAddIngredientPopup(false);
    setLanguageOpen(false);
  }

  const handleAddIngredientPopupOpen = () => {
    setIngredientFeedback('');
    closeAllPopups();
    setOpenAddIngredientPopup(true);
  };

  const handleAddIngredientPopupClose = () => {
    setOpenAddIngredientPopup(false);
  };

  const handleNewIngredientChange = (event: any) => {
    setNewIngredient(event);
  };

  const handleAddIngredient = async () => {
    setIngredientFeedback('');
    try {
      const result = await addIngredient(newIngredient);
      if (result.ok) {
        setDBIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
        setNewIngredient('');
        handleAddIngredientPopupClose();
        setIngredientFeedback(`Successfully added ingredient: ${newIngredient}`);
      } else {
        setNewIngredient('');
        handleAddIngredientPopupClose();
        setIngredientFeedback(`Error handling ingredient change: ${newIngredient}`);
      }
    } catch (error) {
      setNewIngredient('');
      handleAddIngredientPopupClose();
      console.error("Error handling ingredient change:", error);
      setIngredientFeedback(`Error: ${error.message}`);
    }
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  const errorExplanation = () => {
    switch (saveFailureType) {
      case 'email':
        return t('pages.Profile.email-taken');
      case 'username':
        return t('pages.Profile.username-taken');
      default:
        return '';
    }
  };

  const removeFavDish = (dishId: number, restoId: number) => {
    const newFavDishes = favoriteDishes.filter((dish) => !(dish.dish.uid === dishId && dish.restoID === restoId));
    setFavoriteDishes(newFavDishes);
    if (favoriteDishes.length % pageSize === 1 && dishPage !== 1) {
      setDishPage(prevPage => prevPage - 1);
    }
  }

  const removeFavResto = (restoId: number) => {
    const newFavRestos = favoriteRestaurants.filter((resto) => resto.uid !== restoId);
    setFavoriteRestaurants(newFavRestos);
    if (favoriteRestaurants.length % pageSize === 1 && restoPage !== 1) {
      setRestoPage(prevPage => prevPage - 1);
    }
  }

  const isNextPossible = () => {
    if (activeTab === 'restaurants') {
      return restoPage * pageSize < favoriteRestaurants.length;
    } else {
      return dishPage * pageSize < favoriteDishes.length;
    }
  }

  const isPrevPossible = () => {
    if (activeTab === 'restaurants') {
      return restoPage > 1;
    } else {
      return dishPage > 1;
    }
  }

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadDarkModeState();
    setTimeout(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }
        const res = await getAllIngredients();
        if (res) {
          const tmp = Array.from(new Set(res.map((ingredient: any) => ingredient.name)));
          setDBIngredients(tmp);
        }
        await getVisitorProfileDetails(userToken)
            .then((res) => {
              setEmail(res.email);
              setName(res.username);
              setCity(res.city);
              setAllergens(res.allergens);
              setSelectedDislikedIngredients(res.dislikedIngredients);
              setImage(res.profilePicId);
              setLanguage(res.preferredLanguage);
              loadImages(res.profilePicId).then(r => console.log("Loaded user picture successfully"));
            });
        await fetchFavoriteRestaurants();
        await fetchFavoriteDishes();

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData().then(r => console.log("Loaded user data successfully"));
    setIsRefreshing(false);
    }, 2000);
  }, []);

  const onAllergenPress = (item: string) => {
    const updatedAllergens = allergens.filter(product => product !== item);
    setAllergens(updatedAllergens);
  };

  const onAddAllergen = () => {
    setModalContentType(t('pages.Profile.allergens') as string);
    setModalVisible(true);
  }

  const toggleAllergensSelection = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter(selectedItem => selectedItem !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  }

  const onDislikedIngredientPress = (item: string) => {
    const updatedDislikedIngredients = selectedDislikedIngredients.filter(ingredient => ingredient !== item);
    setSelectedDislikedIngredients(updatedDislikedIngredients);
  };

  const onAddDislikedIngredient = () => {
    setModalContentType(t('pages.Profile.disliked-ingredients-title') as string);
    setModalVisible(true);
  }

  const toggleDislikedIngredientsSelection = (item: string) => {
    if (selectedDislikedIngredients.includes(item)) {
      setSelectedDislikedIngredients(selectedDislikedIngredients.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedDislikedIngredients([...selectedDislikedIngredients, item]);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDarkTheme]}
      refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    }>
      <View style={[styles.profileSection, darkMode && styles.profileSectionDarkTheme]}>
        <Text style={[styles.heading, darkMode && styles.headingDarkTheme]}>{t('pages.Profile.profile-page')}</Text>
        {dataChangeStatus !== null && (
          <Text
            style={dataChangeStatus === 'success' ?
            styles.success : styles.error}
          >
            {dataChangeStatus === 'success'
              ? t('pages.Profile.changed-data-success')
              : (t('pages.Profile.changed-data-failure') + errorExplanation())}
          </Text>
        )}
        <TouchableOpacity
          onPress={selectImage}
          style={styles.profilePictureContainer}
        >
          {profilePic.length > 0 ? (
            <Image source={{uri: profilePic[0].base64}} style={styles.profilePicture}/>
          ) : (
            <View style={styles.defaultProfilePicture}>
              <Text style={styles.defaultProfilePictureText}>{t('pages.Profile.add-picture')}</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={[styles.deleteAccountSection, styles.deletePictureButton]}>
          <Button
            title={t('pages.Profile.delete-picture') as string}
            onPress={handleFileDelete}
            color="#6d071a"
          />
        </View>
        <View>
          <Text  style={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]} > {t('pages.Profile.username')}</Text>
          <TextInput
            style={[styles.input, darkMode && styles.inputDarkTheme]}
            value={name}
            onChangeText={handleNameChange}
            placeholder={t('pages.Profile.enter-username') as string}
            placeholderTextColor={darkMode ? 'white' : 'black'}
            required
          />
        </View>
        <View>
          <Text style={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]} > {t('pages.Profile.email')}</Text>
          <TextInput
            style={[styles.input, darkMode && styles.inputDarkTheme]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder={t('pages.Profile.enter-email') as string}
            placeholderTextColor={darkMode ? 'white' : 'black'}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>
        <View>
          <Text style={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]} > {t('pages.Profile.city')}</Text>
          <TextInput
            style={[styles.input, darkMode && styles.inputDarkTheme]}
            value={city}
            onChangeText={handleCityChange}
            placeholder={t('pages.Profile.enter-city') as string}
            placeholderTextColor={darkMode ? 'white' : 'black'}
          />
        </View>
        <View style={styles.changePasswordButton}>
          <Button
            title={t('pages.Profile.change-pw') as string}
            onPress={handleNavigateToChangePassword}
          />
        </View>
        <View>
        <View style={styles.contentProducsDishes}>
          <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.Profile.allergens')}</Text>
          <View style={styles.popupAllergens}>
            {allergens.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.allergenButton}
                onPress={() => onAllergenPress(item)}
              >
                <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            key={"ADDALLERGEN"}
            style={styles.allergenButton}
            onPress={() => onAddAllergen()}>
            <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>{t('pages.Profile.add-allergens')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentProducsDishes}>
          <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{t('pages.Profile.disliked-ingredients-title')}</Text>
          <View style={styles.popupAllergens}>
            {selectedDislikedIngredients.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.allergenButton}
                onPress={() => onDislikedIngredientPress(item)}
              >
                <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            key={"ADDDISLIKEDINGREDIENT"}
            style={styles.allergenButton}
            onPress={() => onAddDislikedIngredient()}>
            <Text style={[styles.labelCernterd, darkMode && styles.labelCernterdDarkTheme]}>{t('pages.Profile.add-disliked-ingredients')}</Text>
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.ingredientButton}>
          <Button title={t('pages.Profile.ingredient-not-found')} onPress={handleAddIngredientPopupOpen}/>
          {ingredientFeedback && (
            <Text style={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]}>{ingredientFeedback}</Text>
          )}
        </View>
        <Text style={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]} > {t('pages.Profile.language')}</Text>
        <DropDownPicker
          dropDownDirection={'TOP'}
          language={language.toUpperCase()}
          open={languageOpen}
          value={language}
          textStyle={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]}
          items={languageOptions}
          setOpen={() => {
            closeAllPopups();
            return setLanguageOpen(!languageOpen)
          }}
          setValue={setLanguage}
          style={[styles.dropDown, darkMode && styles.dropDownDarkTheme]}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('pages.Profile.apply-changes')}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.restaurantSection, darkMode && styles.restaurantSectionDarkTheme]}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'restaurants' && styles.activeTab]}
            onPress={() => handleTabChange('restaurants')}
          >
            <Text style={[styles.tabButtonText, darkMode && styles.tabButtonTexDarkTheme]}>{t('pages.Profile.fav-restos')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'dishes' && styles.activeTab]}
            onPress={() => handleTabChange('dishes')}
          >
            <Text style={[styles.tabButtonText, darkMode && styles.tabButtonTexDarkTheme]}>{t('pages.Profile.fav-dishes')}</Text>
          </TouchableOpacity>
        </View>

        {/* Display Favorite Restaurants or Dishes based on the active tab */}
        <ScrollView contentContainerStyle={styles.favoriteListContainer}>
          {activeTab === 'restaurants' && (
            <View>
              {favoriteRestaurants.length === 0 ? (
                <Text style={[styles.tabButtonText, darkMode && styles.tabButtonTexDarkTheme]}>{t('pages.Profile.no-fav-restos')}</Text>
              ) : (
              favoriteRestaurants.slice((restoPage - 1) * pageSize, restoPage * pageSize).map((restaurant) => (
                <TouchableOpacity onPress={() => navigateToMenu(restaurant.uid, restaurant.name)}>
                  <RestaurantCard
                    key={restaurant.uid}
                    info={restaurant}
                    isFavouriteResto={true}
                    isSmallerCard={true}
                    dataIndex={0}
                    deleteFavResto={removeFavResto}
                  />
                </TouchableOpacity>
              )))}
            </View>
          )}

          {activeTab === 'dishes' && (
            <View>
              {favoriteDishes.length === 0 ? (
                  <Text style={[styles.tabButtonText, darkMode && styles.tabButtonTexDarkTheme]}>{t('pages.Profile.no-fav-dishes')}</Text>
                ) : (
                  favoriteDishes.slice((dishPage - 1) * pageSize, dishPage * pageSize).map((dish, index) => {
                    return (
                      <>
                        <TouchableOpacity onPress={() => navigateToMenu(dish.restoID, dish.restoName)}>
                          <Text style={[styles.restoReference, darkMode && styles.restoReferenceDarkTheme]}>
                            {dish.restoName}
                          </Text>
                        </TouchableOpacity>
                        <DishCard
                          key={dish.dish.uid + index}
                          dish={dish.dish}
                          restoID={dish.restoID}
                          pictures={[]}
                          isSmallerCard={true}
                          isFavourite={true}
                          isFirstLevel={false}
                          deleteFavDish={removeFavDish}
                        />
                      </>
                    )
                  })
                )
              }
            </View>
          )}
          {/* Pagination controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[isPrevPossible() ? styles.paginationButton : styles.paginationButtonDisabled, { marginRight: 10 }]}
              onPress={handlePrevPage}
              disabled={!isPrevPossible()}
            >
              <Text style={styles.paginationButtonText}>{t('pages.Profile.previous')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={isNextPossible() ? styles.paginationButton : styles.paginationButtonDisabled}
              onPress={handleNextPage}
              disabled={!isNextPossible()}
            >
              <Text style={styles.paginationButtonText}>{t('pages.Profile.next')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button
          title={t('pages.Profile.subscriptions') as string}
          onPress={handleRedirectSubscriptions}
          color={darkMode ? "#6d071a" :  "#6d071a"} />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button 
          title={t('pages.Profile.payBtn') as string}
          onPress={handlePayment} 
          color={darkMode ? "#6d071a" :  "#6d071a"} />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button
            title={t('pages.Review.your-review') as string}
            onPress={handleRedirectUserReview}
            color={darkMode ? "#6d071a" :  "#6d071a"} />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button
          title={t('pages.Profile.feature-request') as string}
          onPress={handleFeatureRequest}
          color={darkMode ? "#6d071a" :  "#6d071a"} />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button
          title={t('pages.Profile.UserSupport') as string}
          onPress={handleSupportRequest}
          color={darkMode ? "#6d071a" :  "#6d071a"} />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
      <Button 
          title={darkMode ? "Light Mode" : "Dark Mode"}
          onPress={toggleDarkMode}
          color={darkMode ? "#6d071a" :  "#6d071a"}  />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button  
          title={t('pages.Profile.logout') as string}
          onPress={handleLogout} 
          color={darkMode ? "#6d071a" :  "#6d071a"}  />
      </View>
      <View style={[styles.logoutSection, darkMode && styles.logoutSectionDarkTheme]}>
        <Button
          title={t('pages.Profile.delete-account') as string}
          onPress={handleDeleteAccount}
          color={darkMode ? "#6d071a" :  "#6d071a"}
        />
      </View>
      <View style={styles.deleteAccountSection}>
        <Button
          title={t('pages.Profile.terms') as string}
          onPress={handleTerms}
          color="#6d071a"
        />
      </View>
      <View style={styles.deleteAccountSection}>
        <Button
          title={t('pages.Profile.privacy') as string}
          onPress={handlePrivacy}
          color="#6d071a"
        />
      </View>
      <View style={styles.deleteAccountSection}>
        <Button
          title={t('pages.Imprint.title') as string}
          onPress={handleImprint}
          color="#6d071a"
        />
      </View>
      <Dialog isVisible={openAddIngredientPopup} onDismiss={handleAddIngredientPopupClose}>
        <Dialog.Title title={t('pages.Profile.add-new-ingredient')}></Dialog.Title>
          <TextInput
            key={'addIngredientDialogText'}
            autoFocus
            placeholder={t('pages.Profile.enter-ingredient')}
            value={newIngredient}
            onChangeText={handleNewIngredientChange}
          />
        <Dialog.Actions>
          <View style={styles.dialogActions}>
            <Dialog.Button title={t('common.cancel')} onPress={handleAddIngredientPopupClose} />
            <Dialog.Button title={t('common.save')} onPress={handleAddIngredient} />
          </View>
        </Dialog.Actions>
      </Dialog>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, darkMode && styles.modalViewDark]}>
            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>{modalContentType}</Text>
            <View style={styles.flexContainer}>
              {modalContentType === t('pages.Profile.allergens') &&
                allergensOptions.map(({value, label}, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.allergenButton, allergens.includes(value) ? styles.selectedButton : null]}
                    onPress={() => toggleAllergensSelection(value)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{label}</Text>
                  </TouchableOpacity>
                ))
              }
              {modalContentType === t('pages.Profile.disliked-ingredients-title') &&
                dbIngredients.map((item) => {
                  return {label: item, value: item};
                }).map(({value, label}, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.allergenButton, selectedDislikedIngredients.includes(value) ? styles.selectedButton : null]}
                    onPress={() => toggleDislikedIngredientsSelection(value)}
                  >
                    <Text style={[styles.inputDishProduct, darkMode && styles.inputDishProductDarkTheme]}>{label}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
            <Button
              title={t('common.close') as string}
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
