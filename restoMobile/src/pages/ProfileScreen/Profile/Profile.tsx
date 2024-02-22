import React, { useState } from 'react';
import {Alert, Button, View, Text, TextInput, Image, ScrollView, TouchableOpacity} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
// import SelectBox from 'react-native-multi-selectbox-typescript'
import styles from './Profile.styles';
import logoImage from '../../../assets/logo.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {deleteRestoAccount} from "../../../services/userCalls";

type ProfileScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const Profile: React.FC<ProfileScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  // const [allergens, setAllergens] = useState([]);
  const [watchedRestaurants, setWatchedRestaurants] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
            const userToken = await AsyncStorage.getItem('user');
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

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleCityChange = (text) => {
    setCity(text);
  };

  const handleSelectChange = (value) => {
    setSelectedOptions(value);
  };

  const handleAddRestaurant = () => {
    // Add the watched restaurant to the list
    const newRestaurant = {
      name: `Restaurant ${watchedRestaurants.length + 1}`,
      date: new Date().toLocaleString(),
    };

    setWatchedRestaurants((prevRestaurants) => [newRestaurant, ...prevRestaurants]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.heading}>Account Page</Text>
        <View style={styles.profilePicture}>
          <Text>Profile Picture:</Text>
          <Image source={logoImage} style={styles.profileImage} />
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
          <Text>City:</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={handleCityChange}
            placeholder="Enter your city"
          />
        </View>
        {/*<View>*/}
        {/*  <Text>Allergens:</Text>*/}
        {/*  <SelectBox*/}
        {/*    label="Pick allergens"*/}
        {/*    options={[*/}
        {/*      { item: 'Peanut', id: 'peanut' },*/}
        {/*      { item: 'Gluten', id: 'gluten' },*/}
        {/*      { item: 'Dairy', id: 'dairy' },*/}
        {/*    ]}*/}
        {/*    value={selectedOptions[0]}*/}
        {/*    onChange={handleSelectChange}*/}
        {/*  />*/}
        {/*</View>*/}
        <TouchableOpacity style={styles.button} onPress={handleAddRestaurant}>
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
