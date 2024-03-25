import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, StatusBar, Image, ScrollView } from 'react-native'; // Import ScrollView
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import styles from './AddRestaurantScreen.styles';
import HomeScreen from "src/pages/HomeScreen/HomeScreen";
import Header from '../../components/Header';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addRestaurant, getAllMenuDesigns } from '../../services/restoCalls';
import { IMenuDesigns } from 'src/models/menuDesignsInterface'

const AddRestaurantScreen = () => {
  const navigation = useNavigation();
  const [restaurantName, setRestaurantName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [menuDesigns, setMenuDesigns] = useState<IMenuDesigns[]>([]);
  const [selectedMenuDesign, setSelectedMenuDesign] = useState('');
  const [selectedMenuDesignID, setSelectedMenuDesignID] = useState(0);
  const [menuDesignOpen, setMenuDesignOpen] = useState(false);

  useEffect(() => {    
    getAllMenuDesigns()
      .then((res) => {
        setMenuDesigns(res);
      })
      .catch((error) => {
        console.error('Error updating restaurant data:', error);
      });
  }, []);


  const handleAddRestaurant = async () => {
    if (!restaurantName || !streetName || !streetNumber || !postalCode || !city || !country) {
      Alert.alert('Error', 'All fields are mandatory.');
      return;
    }
    const token = await AsyncStorage.getItem('userToken');
    const restaurantData = {
      name: restaurantName,
      phonenumber: phoneNumber,
      website: website,
      pictures: [imageURL],
      location: {
        streetName: streetName,
        streetNumber: streetNumber,
        postalCode: postalCode,
        city: city,
        country: country,
        latitude: "0",
        longitude: "0",
      },
      description: description,
      menuDesignID: selectedMenuDesignID,
    };
    const data  = {
      userToken: token,
      resto: restaurantData,
    };
    try {
      const response = addRestaurant(data);
      setRestaurantName('');
      setPhoneNumber('');
      setStreetName('');
      setStreetNumber('');
      setPostalCode('');
      setCity('');
      setCountry('');
      setDescription('');
      setWebsite('');
      setImageURL('');
      setSelectedMenuDesignID(0);
      setSelectedMenuDesign('');
      navigation.navigate('MyRestaurantsScreen');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      Alert.alert('Error', 'Failed to add restaurant. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageURL(result.uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.inputContainer}>
        <View style={styles.inputPair}>
          <TextInput
            style={styles.input}
            placeholder="Restaurant Name *"
            value={restaurantName}
            onChangeText={setRestaurantName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={styles.input}
            placeholder="Street Name *"
            value={streetName}
            onChangeText={setStreetName}
          />
          <TextInput
            style={styles.input}
            placeholder="Street Number *"
            value={streetNumber}
            onChangeText={setStreetNumber}
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={styles.input}
            placeholder="Postal Code *"
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <TextInput
            style={styles.input}
            placeholder="City *"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={styles.input}
            placeholder="Country *"
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.inputPair}>
          <TextInput
            style={styles.input}
            placeholder="Website"
            value={website}
            onChangeText={setWebsite}
          />
        </View>
        <View style={styles.containerPicker}>
          <Text style={{ marginBottom: 5 }}>Select a menu design:</Text>
          <DropDownPicker
            open={menuDesignOpen}
            items={menuDesigns.map((menuDesign) => ({ label: menuDesign.name, value: menuDesign._id }))}
            value={selectedMenuDesign}
            dropDownDirection={'TOP'}
            setOpen={setMenuDesignOpen}
            onChangeValue={(item:any) => {
              if (item === null || item === undefined || item === '' || typeof item === "undefined") {
                return;
              }
              setSelectedMenuDesign(item);
              setSelectedMenuDesignID(item);
            }}
            setValue={setSelectedMenuDesign}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddRestaurant}>
        <Text style={styles.buttonText}>Add Restaurant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRestaurantScreen;