import React, {useEffect, useState} from 'react';
import {Alert, Button, View, Text, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import styles from './Profile.styles';
import logoImage from '../../../../assets/logo.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from 'react-native-dropdown-picker';
import {editVisitorProfileDetails, getVisitorProfileDetails} from "../../../services/profileCalls";
import {deleteAccount} from "../../../services/userCalls";

type ProfileScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const Profile: React.FC<ProfileScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [image, setImage] = useState<string | null>(null);
  const [pictureId, setPictureId] = useState<number>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [allergens, setAllergens] = useState([]);
  const [watchedRestaurants, setWatchedRestaurants] = useState([]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [allergensOpen, setAllergensOpen] = useState(false);
  const [language, setLanguage] = useState<string>('english');
  const languageOptions = [
    {label: 'English', value: 'english'},
    {label: 'German', value: 'german'},
    {label: 'French', value: 'french'},
  ];
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('user');
        if (userToken === null) {
          return;
        }
        getVisitorProfileDetails(userToken)
          .then((res) => {
            setEmail(res.email);
            setName(res.username);
            setCity(res.city);
            setAllergens(res.allergens);
            setPictureId(res.profilePicId);
            setLanguage(res.preferredLanguage);
          });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

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
            deleteAccount(userToken).then(res => {
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

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleCityChange = (text) => {
    setCity(text);
  };

  const handleAddRestaurant = () => {
    // Add the watched restaurant to the list
    const newRestaurant = {
      name: `Restaurant ${watchedRestaurants.length + 1}`,
      date: new Date().toLocaleString(),
    };

    setWatchedRestaurants((prevRestaurants) => [newRestaurant, ...prevRestaurants]);
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

    let isError = false;
    if (!res) {
      isError = true;
    } else {
      await AsyncStorage.setItem('user', res);
    }

    // TODO: add image mngt

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.heading}>Account Page</Text>
        {dataChangeStatus !== null && (
          <Text
            style={dataChangeStatus === 'success' ?
            styles.success : styles.error}
          >
            {dataChangeStatus === 'success'
              ? 'Profile details changed successfully!'
              : 'Failed to change profile details.'}
          </Text>
        )}
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
        <View>
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your name"
            required
          />
        </View>
        <View>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>
        <View>
          <Text>City:</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={handleCityChange}
            placeholder="Enter your city"
          />
        </View>
        <View style={styles.changePasswordButton}>
          <Button
            title="Change Password"
            onPress={handleNavigateToChangePassword}
          />
        </View>
        <DropDownPicker
          dropDownDirection={'TOP'}
          multiple
          open={allergensOpen}
          value={allergens}
          items={allergensOptions}
          setOpen={setAllergensOpen}
          setValue={setAllergens}
          style={styles.dropDown}
        />
        <DropDownPicker
          dropDownDirection={'TOP'}
          open={languageOpen}
          value={language}
          items={languageOptions}
          setOpen={setLanguageOpen}
          setValue={setLanguage}
          style={styles.dropDown}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Apply Change</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.restaurantSection}>
        <Text style={styles.heading}>Last Watched Restaurants</Text>
        {watchedRestaurants.map((restaurant, index) => (
          <View key={index} style={styles.restaurantItem}>
            <Text>
              <Text style={styles.boldText}>{restaurant.name}</Text> - {restaurant.date}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.logoutSection}>
        <Button style={styles.logoutButton} title="Logout" onPress={handleLogout} color="#6d071a" />
      </View>
      <View style={styles.deleteAccountSection}>
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          color="#6d071a"
        />
      </View>
    </ScrollView>
  );
};

export default Profile;
