import React, { useEffect } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getVisitorProfileDetails } from '../../../services/profileCalls';
import {styles} from "./styles";
import {loginUser} from "../../../services/userCalls";

type FacebookLoginButtonProps = {
  setLoggedInStatus: (status: boolean) => void;
  navigation: any;
};

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ setLoggedInStatus, navigation }) => {
  const { t, i18n } = useTranslation();

  const handleFacebookLogin = async () => {
    try {
      const dataStorage = JSON.stringify({
        username: "thatistube@gmail.com",
        password: "122142071198176628",
      });
      const response = await loginUser(dataStorage);
      if (response === 'Invalid Access') {
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userName');
      } else {
        getVisitorProfileDetails(response)
            .then((res) => {
              if (res.preferredLanguage) {
                i18n.changeLanguage(res.preferredLanguage);
              }
            });
        await AsyncStorage.setItem('userToken', JSON.stringify('isSet'));
        await AsyncStorage.setItem('user', response);
        setLoggedInStatus(true);
        navigation.navigate('RestaurantScreen');
      }
    } catch (error) {
      console.error('Error logging in with Facebook:', error);
    }
  };

  return (
      <TouchableOpacity style={styles.googleButton} onPress={handleFacebookLogin}>
        <Image source={require('../../../../assets/Facebook.png')} style={styles.googleIcon} />
      </TouchableOpacity>
  );
};

export default FacebookLoginButton;
