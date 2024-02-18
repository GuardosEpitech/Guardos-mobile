import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, Button, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './NewProfile.styles';
import DropDownPicker from 'react-native-dropdown-picker';
// @ts-ignore
import { API_URL } from '@env';

const baseUrl = `${API_URL}user/`;

type ProfileScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ProfilePage: React.FC<ProfileScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<string>('english');
  const languageOptions = [
    { label: 'English', value: 'english' },
    { label: 'German', value: 'german' },
    { label: 'French', value: 'french' },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await fetch(baseUrl + 'data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUsername(userData.username);
      setEmail(userData.email);
      setLocation(userData.location);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
    const selectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    
          if (result.assets && result.assets.length > 0 && 'uri' in result.assets[0]) {
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
              setLoggedInStatus(false);
              navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false }
      );
  };

  const handleApplyChanges = async () => {
    try {
      const response = await fetch(baseUrl + 'update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token:  await AsyncStorage.getItem('userToken'),
          newUsername: username,
          newEmail: email,
          newLocation: location,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      const updatedToken = await response.text();
    await AsyncStorage.setItem('userToken', updatedToken);
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.heading}>My Profile</Text>
        <TouchableOpacity onPress={selectImage} style={styles.profilePictureContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profilePicture} />
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
            <Button title="Change Password" onPress={() => {/* Implement password change */}} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />
        <DropDownPicker
            open={open}
            value={language}
            items={languageOptions}
            setOpen={setOpen}
            setValue={setLanguage}
        />
       <View style={styles.buttonContainer}>
          <Button title="Apply Changes" onPress={handleApplyChanges} color="green" />
        </View>
        <View style={styles.logoutButtonContainer}>
          <Button title="Logout" onPress={handleLogout} color="red" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProfilePage;
