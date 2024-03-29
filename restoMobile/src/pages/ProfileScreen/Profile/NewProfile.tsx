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
import DropDownPicker from 'react-native-dropdown-picker';
// @ts-ignore
import {API_URL} from '@env';
import {editProfileDetails, getProfileDetails} from "../../../services/profileCalls";
import {deleteRestoAccount} from "../../../services/userCalls";

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
    const [language, setLanguage] = useState<string>('english');
    const [showPasswordChangedMessage, setShowPasswordChangedMessage] = useState(false);

    const languageOptions = [
      {label: 'English', value: 'english'},
      {label: 'German', value: 'german'},
      {label: 'French', value: 'french'},
    ];
    const menuDesignOptions = [
      {label: 'Default', value: 'default'},
      {label: 'Fast food', value: 'fast-food'},
      {label: 'Pizzeria', value: 'pizzeria'},
    ];

    useEffect(() => {
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
            setLanguage(res.preferredLanguage);
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const selectImage = async () => {
      const permissionResult = await ImagePicker
        .requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
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

    const handleLogout = () => {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
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
        'Delete Account',
        'Are you sure you want to delete your account? This action is irreversible.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const userToken = await AsyncStorage.getItem('userToken');
              if (userToken === null) {
                Alert.alert('Error', 'Failed to delete account. Please log in again.');
              }
              deleteRestoAccount(userToken).then(res => {
                if (res !== null) {
                  AsyncStorage.removeItem('userToken');
                  AsyncStorage.removeItem('userName');
                  setLoggedInStatus(false);
                  navigation.navigate('Login');
                } else {
                  Alert.alert('Error', 'Failed to delete account. Please try again.');
                }
              });
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
        <View style={styles.container}>
          <Text style={styles.heading}>My Profile</Text>
          <TouchableOpacity
            onPress={selectImage}
            style={styles.profilePictureContainer}
          >
            {image ? (
              <Image source={{uri: image}} style={styles.profilePicture}/>
            ) : (
              <View style={styles.defaultProfilePicture}>
                <Text style={styles.defaultProfilePictureText}>Add Picture</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <View style={styles.changePasswordButton}>
            <Button
              title="Change Password"
              onPress={handleNavigateToChangePassword}
            />
          </View>
          <DropDownPicker
            dropDownDirection={'TOP'}
            open={menuDesignOpen}
            value={menuDesign}
            items={menuDesignOptions}
            setOpen={setMenuDesignOpen}
            setValue={setMenuDesign}
            style={styles.dropDown}
          />
          <DropDownPicker
            dropDownDirection={'TOP'}
            open={languageOpen}
            value={language}
            items={languageOptions}
            setOpen={setLanguageOpen}
            setValue={setLanguage}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Apply Changes"
              onPress={handleApplyChanges} color="green"
            />
          </View>
          <View style={styles.buttonContainer}>
          <Button 
          title="Feature request" 
          onPress={handleFeatureRequest} 
          color="green" />
          </View>
          <View style={styles.logoutButtonContainer}>
            <Button title="Logout" onPress={handleLogout} color="#6d071a"/>
          </View>
          {showPasswordChangedMessage && 
          <Text style={styles.passwordSuccess}>
            Password Changed
          </Text>}
        </View>
          <View style={styles.deleteAccountSection}>
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              color="#6d071a"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  };

export default ProfilePage;
