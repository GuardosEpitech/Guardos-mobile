import React, {useEffect, useState} from 'react';
import {Alert, Button, View, Text, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';
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
  const [allergensOpen, setAllergensOpen] = useState(false);
  const [selectedDislikedIngredients, setSelectedDislikedIngredients] = useState([]);
  const [dbIngredients, setDBIngredients] = useState([]);
  const [openIngredientPopup, setOpenIngredientPopup] = useState(false);
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
  // TODO: apply i18n
  const allergensOptions = [
    { label: "celery", value: "celery"},
    { label: "gluten", value: "gluten"},
    { label: "crustaceans", value: "crustaceans"},
    { label: "eggs", value: "eggs"},
    { label: "fish", value: "fish"},
    { label: "lupin", value: "lupin"},
    { label: "milk", value: "milk"},
    { label: "molluscs", value: "molluscs"},
    { label: "mustard", value: "mustard"},
    { label: "peanuts", value: "peanuts"},
    { label: "sesame", value: "sesame"},
    { label: "soybeans", value: "soybeans"},
    { label: "sulphides", value: "sulphides"},
    { label: "tree nuts", value: "tree nuts"}
  ];
  const [dataChangeStatus, setDataChangeStatus] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restoPage, setRestoPage] = useState(1);
  const [dishPage, setDishPage] = useState(1);
  const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
  const pageSize = 3; // Number of items per page
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();


  useEffect(() => {
    loadDarkModeState();
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('user');
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

  const handleFileChange = async (assets) => {
    const file = {
      name: "profileImage",
      type: "image/png",
      size: assets.length,
      uri: assets[0].uri
    }
    const userToken = await AsyncStorage.getItem('user');
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
      const userToken = await AsyncStorage.getItem('user');
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
        routes: [{ name: 'RestaurantScreen' }],
      })
    );
  };

  const fetchFavoriteRestaurants = async () => {
    const userToken = await AsyncStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const favorites = await getRestoFavourites(userToken);
    setFavoriteRestaurants(favorites);
  };

  const fetchFavoriteDishes = async () => {
    const userToken = await AsyncStorage.getItem("user");
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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let uri: string = '';

      if (result.assets && result.assets.length > 0 &&
        'uri' in result.assets[0]) {
        uri = result.assets[0].uri as string;
      }

      if (uri) {
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
            AsyncStorage.removeItem('user');
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
            const userToken = await AsyncStorage.getItem('user');
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
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      setDataChangeStatus("failed");
      return;
    }
    const res = await editVisitorProfileDetails(userToken, {
      username: name,
      email: email,
      city: city,
      allergens: allergens,
      preferredLanguage: language
    });
    i18n.changeLanguage(language);

    let isError = false;
    if (!res) {
      isError = true;
    } else {
      await AsyncStorage.setItem('user', res);
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
    setOpenIngredientPopup(false);
    setOpenAddIngredientPopup(false);
    setAllergensOpen(false);
    setLanguageOpen(false);
  }

  const handleAddIngredientPopupOpen = () => {
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
    addIngredient(newIngredient).then(r => console.log("Added ingredient: ", r));
    setDBIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setNewIngredient('');
    handleAddIngredientPopupClose();
  };

  const navigateToMenu = (restaurantId: number, restaurantName: string) => {
    navigation.navigate('MenuPage', { restaurantId, restaurantName });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDarkTheme]}>
      <View style={[styles.profileSection, darkMode && styles.profileSectionDarkTheme]}>
        <Text style={[styles.heading, darkMode && styles.headingDarkTheme]}>{t('pages.Profile.profile-page')}</Text>
        {dataChangeStatus !== null && (
          <Text
            style={dataChangeStatus === 'success' ?
            styles.success : styles.error}
          >
            {dataChangeStatus === 'success'
              ? t('pages.Profile.changed-data-success')
              : t('pages.Profile.changed-data-failure')}
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
        <DropDownPicker
          itemKey={"languagePicker"}
          dropDownDirection={'TOP'}
          language={language.toUpperCase()}
          multiple
          open={allergensOpen}
          value={allergens}
          textStyle={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]}
          items={allergensOptions}
          setOpen={() => {
            closeAllPopups();
            return setAllergensOpen(!allergensOpen)
          }}
          setValue={setAllergens}
          style={[styles.dropDown, darkMode && styles.dropDownDarkTheme]}
        />
        <View>
          <DropDownPicker
            itemKey={"dislikedIngredientPicker"}
            dropDownDirection={'TOP'}
            language={language.toUpperCase()}
            multiple
            open={openIngredientPopup}
            value={selectedDislikedIngredients}
            textStyle={[styles.profileHeader, darkMode && styles.profileHeaderDarkTheme]}
            items={dbIngredients.map((item) => {
              return {label: item, value: item};
            })}
            setOpen={() => {
              closeAllPopups();
              return setOpenIngredientPopup(!openIngredientPopup)
            }}
            setValue={setSelectedDislikedIngredients}
            style={[styles.dropDown, darkMode && styles.dropDownDarkTheme]}
          />
        </View>
        <View>
          <Button title={t('pages.Profile.ingredient-not-found')} onPress={handleAddIngredientPopupOpen}/>
        </View>
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
              {favoriteRestaurants.slice((restoPage - 1) * pageSize, restoPage * pageSize).map((restaurant) => (
                <TouchableOpacity onPress={() => navigateToMenu(restaurant.uid, restaurant.name)}>
                  <RestaurantCard
                    key={restaurant.uid}
                    info={restaurant}
                    isFavouriteResto={true}
                    isSmallerCard={true}
                    dataIndex={0}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'dishes' && (
            <View>
              {favoriteDishes.slice((dishPage - 1) * pageSize, dishPage * pageSize).map((dish, index) => {
                return (<DishCard
                  key={dish.dish.uid + index}
                  dish={dish.dish}
                  restoID={dish.restoID}
                  pictures={[]}
                  isSmallerCard={true}
                  isFavourite={true}
                  isFirstLevel={false}
                />)
              }

              )}
            </View>
          )}
          {/* Pagination controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, { marginRight: 10 }]}
              onPress={handlePrevPage}
              disabled={activeTab === 'restaurants' ? restoPage === 1 : dishPage === 1}
            >
              <Text style={styles.paginationButtonText}>{t('pages.Profile.previous')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={handleNextPage}
              disabled={activeTab === 'restaurants' ?
                (restoPage * pageSize >= favoriteRestaurants.length) :
                (dishPage * pageSize >= favoriteDishes.length)
              }
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
          <Dialog.Button title={t('common.cancel')} onPress={handleAddIngredientPopupClose}/>
          <Dialog.Button title={t('common.save')} onPress={handleAddIngredient}/>
        </Dialog.Actions>
      </Dialog>
    </ScrollView>
  );
};

export default Profile;
