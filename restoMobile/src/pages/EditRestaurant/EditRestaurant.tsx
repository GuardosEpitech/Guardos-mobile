import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, Image } from 'react-native';
import Header from 'src/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './EditRestaurant.styles';

const EditRestaurant = ({ route }) => {
  const { restaurantId } = route.params; 
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pictures, setPictures] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(`http://195.90.210.111:8081/api/restaurants/${restaurantId}`);
        const data = await response.json();

        setName(data.name);
        setPhoneNumber(data.phoneNumber);
        setWebsite(data.website);
        setDescription(data.description);
        setStreetName(data.location.streetName);
        setStreetNumber(data.location.streetNumber);
        setPostalCode(data.location.postalCode);
        setCity(data.location.city);
        setCountry(data.location.country);
        setPictures(data.pictures);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const handleSave = async () => {
    try {
      const updatedData = {
        name,
        phoneNumber,
        website,
        pictures,
        location: {
          streetName,
          streetNumber,
          postalCode,
          city,
          country,
        },
      };

      const response = await fetch(`http://195.90.210.111:8081/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Restaurant data updated successfully', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update restaurant data');
      }
    } catch (error) {
      console.error('Error updating restaurant data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header label="Guardos" leftIcon={<Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.imageContainer}>
        {pictures.length > 0 && (
          <Image style={styles.image} source={{ uri: pictures[0] }} />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder="Restaurant Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder="Website"
              value={website}
              onChangeText={(text) => setWebsite(text)}
            />
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder="Street Name"
              value={streetName}
              onChangeText={(text) => setStreetName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Street Number"
              value={streetNumber}
              onChangeText={(text) => setStreetNumber(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={postalCode}
              onChangeText={(text) => setPostalCode(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={(text) => setCity(text)}
            />
          </View>
          <View style={styles.inputPair}>
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={country}
              onChangeText={(text) => setCountry(text)}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRestaurant;
