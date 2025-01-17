import React, {useState, useEffect, useCallback} from 'react';
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
    ScrollView, Switch, RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './NewProfile.styles';
import DropDownPicker, {LanguageType} from 'react-native-dropdown-picker';
// @ts-ignore
import {API_URL} from '@env';
import {changeTwoFactor, editProfileDetails, getProfileDetails} from "../../../services/profileCalls";
import {deleteRestoAccount, getPaymentMethods} from "../../../services/userCalls";
import { CommonActions, useIsFocused } from '@react-navigation/native';
import {useTranslation} from "react-i18next";
import {IimageInterface} from "../../../models/imageInterface";
import {addRestoProfileImage, deleteRestoProfileImage, getImages} from "../../../services/imagesCalls";

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
    const [image, setImage] = useState<number | null>(null);
    const [pictureId, setPictureId] = useState<number>(null);
    const [profilePic, setProfilePic] = useState<IimageInterface[]>([]);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const [language, setLanguage] = useState<string>('en');
    const [showPasswordChangedMessage, setShowPasswordChangedMessage] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [paymentIsSet, setPaymentIsSet] = useState(false);
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [dataChangeStatus, setDataChangeStatus] = useState(null);
    const [saveFailureType, setSaveFailureType] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);


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
    const {t, i18n} = useTranslation();

    const languageOptions = [
      {label: t('common.english'), value: 'en'},
      {label: t('common.german'), value: 'de'},
      {label: t('common.french'), value: 'fr'},
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
            setImage(res.profilePicId[res.profilePicId.length - 1]);
            setLanguage(res.preferredLanguage || i18n.language);
            setTwoFactor(res.twoFactor === "true");
            loadImages(res.profilePicId).then(r => console.log("Loaded user picture successfully"));
          });
        let paymentMehtods = await getPaymentMethods(userToken);
        if (paymentMehtods && paymentMehtods !== '' && paymentMehtods.length !== 0) {
          setPaymentIsSet(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

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

      addRestoProfileImage(userToken, file.name,
        file.type, file.size, file.uri)
        .then(r => {
          setProfilePic([{ base64: file.uri, contentType: file.type,
            filename: file.name, size: file.size,
            uploadDate: "0", id: r.message }]);
          if (image) {
            deleteRestoProfileImage(image, userToken);
          }
          setImage(r.message);
        });
    };

    const handleFileDelete = async () => {
      if (image) {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }

        deleteRestoProfileImage(image, userToken);
        setProfilePic([]);
      }
      else {
        console.log("No image to delete");
      }
    }

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

    const handleFeatureRequest = () => {
      navigation.navigate('FeatureRequest', {});
    };

    const handleSupportRequest = () => {
      navigation.navigate('UserSupport', {});
    }

    const handleRedirectSubscriptions = () => {
      navigation.navigate('Subscriptions', {});
    };

    async function toggleTwoFactor() {
      const userToken = await AsyncStorage.getItem('userToken')
      changeTwoFactor(userToken, twoFactor
          ? "false" : "true")
          .then(r => {
            setTwoFactor(!twoFactor);
          });
    }

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
      setDataChangeStatus(null);
      setSaveFailureType(null);
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        setDataChangeStatus("failed");
        return;
      }
      const res = await editProfileDetails(userToken, {
        username: username,
        email: email,
        preferredLanguage: language
      });
      i18n.changeLanguage(language);

      let isError = false;

      if (typeof res === "string") {
        if (res) {
          await AsyncStorage.setItem('userToken', res);
        } else {
          isError = true;
        }
      } else if (Array.isArray(res) && res.length === 2) {
        isError = true;
        if (res[0] === true) {
          setSaveFailureType("email");
        }
        if (res[1] === true) {
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

    const onRefresh2 = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => {
          if (route.params?.passwordChanged) {
              setShowPasswordChangedMessage(true);
              setTimeout(() => {
                  setShowPasswordChangedMessage(false);
              }, 5000);
          }
          fetchUserData();
          setIsRefreshing(false);
        }, 2000);
    }, []);

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh2} />
        }>
        <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
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
              <Image source={{uri: profilePic[profilePic.length - 1].base64}} style={styles.profilePicture}/>
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

          <View style={styles.twoFactorContainer}>
            <Text style={[styles.label, darkMode && styles.labelDarkTheme]}>
              {twoFactor ? t('pages.Profile.two-factor-deactivate')
                  : t('pages.Profile.two-factor-activate')}
            </Text>
            <Switch
                value={twoFactor}
                onValueChange={toggleTwoFactor}
                thumbColor={twoFactor ? "#f5dd4b" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>
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
          {paymentIsSet ? (
            <View style={styles.buttonContainer}>
              <Button
                title={t('pages.Profile.subscriptions') as string}
                onPress={handleRedirectSubscriptions} color="grey"
              />
            </View>
          ) : (
            <View>
            </View>
          )}
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
          title={t('pages.UserSupport.UserSupport') as string}
          onPress={handleSupportRequest} 
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
              title={t('pages.Profile.terms') as string}
              onPress={handleTerms}
              color="#6d071a"
            />
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
