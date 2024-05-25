import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './NewProfile.styles';
import DropDownPicker, {LanguageType} from 'react-native-dropdown-picker';
// @ts-ignore
import {API_URL} from '@env';
import {editProfileDetails, getProfileDetails} from "../../../services/profileCalls";
import {deleteRestoAccount} from "../../../services/userCalls";
import { CommonActions, useIsFocused } from '@react-navigation/native';
import {useTranslation} from "react-i18next";

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
  route: { params?: { passwordChanged?: boolean } };
};

const ProfilePage: React.FC<ProfileScreenProps &
  { setLoggedInStatus: (status: boolean) => void }> =
  ({navigation, route, setLoggedInStatus}) => {
    const [image, setImage] = useState<string | null>(null);
    const [pictureId, setPictureId] = useState<number>(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [menuDesign, setMenuDesign] = useState<string>('default');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [menuDesignOpen, setMenuDesignOpen] = useState(false);
    const [language, setLanguage] = useState<string>('en');
    const [showPasswordChangedMessage, setShowPasswordChangedMessage] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [refresh, setRefresh] = useState(false);

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
          routes: [{ name: 'Scanning' }],
        })
      );
    };
    const {t, i18n} = useTranslation();

    const languageOptions = [
      {label: t('common.english'), value: 'en'},
      {label: t('common.german'), value: 'de'},
      {label: t('common.french'), value: 'fr'},
    ];
    const menuDesignOptions = [
      {label: t('pages.Profile.default'), value: 'default'},
      {label: t('pages.Profile.fast-food'), value: 'fast-food'},
      {label: t('pages.Profile.pizzeria'), value: 'pizzeria'},
    ];

    useEffect(() => {
      loadDarkModeState();
      fetchUserData();
    }, []);

    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }
        getProfileDetails(userToken)
          .then((res) => {
            setEmail(res.email);
            setUsername(res.username);
            setPictureId(res.profilePicId);
            setMenuDesign(res.defaultMenuDesign);
            setLanguage(res.preferredLanguage || i18n.language);
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
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
          setImage(uri);
        }
      }
    };

    const handleFeatureRequest = () => {
      navigation.navigate('FeatureRequest', {});
    };

    const handleRedirectSubscriptions = () => {
      navigation.navigate('Subscriptions', {});
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
              setLoggedInStatus(false);
              navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false}
      );
    };

    const handleApplyChanges = async () => {
      const userToken = await AsyncStorage.getItem('user');
      if (userToken === null) {
        return;
      }
      const res = await editProfileDetails(userToken, {
        username: username,
        email: email,
        defaultMenuDesign: menuDesign,
        preferredLanguage: language
      });
      i18n.changeLanguage(language);

      if (res) {
        await AsyncStorage.setItem('user', res);
        console.log('User data updated successfully');
      } else {
        console.error('Error updating user data:');
      }

        // TODO: add image mngt
    };

    const handleNavigateToChangePassword = () => {
      navigation.navigate('Change Password');
    };

    useEffect(() => {
      if (route.params?.passwordChanged) {
        setShowPasswordChangedMessage(true);
        setTimeout(() => {
          setShowPasswordChangedMessage(false);
        }, 5000);
      }
    }, [route.params]);

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
                  String(t('common.error')),
                  String(t('pages.Profile.delete-account-failure-login'))
                );
              }
              deleteRestoAccount(userToken).then(res => {
                if (res !== null) {
                  AsyncStorage.removeItem('userToken');
                  AsyncStorage.removeItem('userName');
                  setLoggedInStatus(false);
                  navigation.navigate('Login');
                } else {
                  Alert.alert(
                    String(t('common.error')),
                    String(t('pages.Profile.delete-account-failure-retry'))
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

    const handlePrivacy = () => {
      navigation.navigate('Privacy', {});
    };

    const handleImprint = () => {
      navigation.navigate('Imprint', {});
    };

    const handlePayment = () => {
      navigation.navigate('Payment methods');
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView >
        <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
          <Text style={[styles.heading, darkMode && styles.headingDarkTheme]}>{t('pages.Profile.profile-page')}</Text>
          <TouchableOpacity
            onPress={selectImage}
            style={styles.profilePictureContainer}
          >
            {image ? (
              <Image source={{uri: image}} style={styles.profilePicture}/>
            ) : (
              <View style={styles.defaultProfilePicture}>
                <Text style={styles.defaultProfilePictureText}>{t('pages.Profile.add-picture')}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={[styles.input, darkMode && styles.inputDarkTheme]}
            placeholder={t('pages.Profile.username') as string}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={[styles.input, darkMode && styles.inputDarkTheme]}
            placeholder={t('pages.Profile.email') as string}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <View style={styles.changePasswordButton}>
            <Button
              title={t('pages.Profile.change-pw') as string}
              onPress={handleNavigateToChangePassword}
            />
          </View>
          <DropDownPicker
            dropDownDirection={'TOP'}
            language={language.toUpperCase() as LanguageType}
            open={menuDesignOpen}
            value={menuDesign}
            items={menuDesignOptions}
            setOpen={setMenuDesignOpen}
            setValue={setMenuDesign}
            dropDownContainerStyle={{backgroundColor: darkMode ? '#181A1B' : 'white'}}
            textStyle={{ fontSize: 16, color: darkMode ? 'white' : 'black' }}
            style={[styles.dropDown, darkMode && styles.dropDownDarkTheme]}/>
          <DropDownPicker
            dropDownDirection={'TOP'}
            language={language.toUpperCase() as LanguageType}
            open={languageOpen}
            value={language}
            items={languageOptions}
            setOpen={setLanguageOpen}
            setValue={setLanguage}
            dropDownContainerStyle={{backgroundColor: darkMode ? '#181A1B' : 'white'}}
            textStyle={{ fontSize: 16, color: darkMode ? 'white' : 'black' }}
            style={[styles.dropDown, darkMode && styles.dropDownDarkTheme]}/>
          <View style={styles.buttonContainer}>
            <Button
              title={t('common.apply-changes') as string}
              onPress={handleApplyChanges} color="green"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('pages.Profile.subscriptions') as string}
              onPress={handleRedirectSubscriptions} color="grey"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              title={t('pages.Profile.payBtn') as string}
              onPress={handlePayment} 
              color="grey" 
            />
          </View>
          <View style={styles.buttonContainer}>
          <Button 
          title={t('pages.Profile.feature-request') as string}
          onPress={handleFeatureRequest} 
          color="grey" />
          </View>
          <View style={styles.buttonContainer}>
          <Button 
          title={darkMode ? "Light Mode" : "Dark Mode"}
          onPress={toggleDarkMode}
          color={darkMode ? "#6d071a" : "grey"}
          />
          </View>          
          <View style={styles.logoutButtonContainer}>
            <Button title={t('pages.Profile.logout') as string} onPress={handleLogout} color="#6d071a"/>
          </View>
          {showPasswordChangedMessage && 
          <Text style={styles.passwordSuccess}>
            {t('pages.Profile.pw-changed') as string}
          </Text>}

          <View style={[styles.deleteAccountSection, darkMode && styles.deleteAccountSectionDarkTheme]}>
            <Button
              title={t('pages.Profile.delete-account') as string}
              onPress={handleDeleteAccount}
              color="#6d071a"
            />
          </View>
          </View>
          <View style={[styles.deleteAccountSection, darkMode && styles.deleteAccountSectionDarkTheme]}>
            <Button
              title={t('pages.Profile.privacy') as string}
              onPress={handlePrivacy}
              color="#6d071a"
            />
          </View>
          <View style={[styles.deleteAccountSection, darkMode && styles.deleteAccountSectionDarkTheme]}>
        <Button
          title={t('pages.Imprint.title') as string}
          onPress={handleImprint}
          color="#6d071a"
        />
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  };

export default ProfilePage;
