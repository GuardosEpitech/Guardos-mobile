import React, { useEffect } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getVisitorProfileDetails } from '../../../services/profileCalls';
import {styles} from "./styles";

const GOOGLE_CLIENT_ID = '251768771069-9iate5ptc3pm51k380d2uamf3segvtf6.apps.googleusercontent.com';

type GoogleLoginButtonProps = {
  setLoggedInStatus: (status: boolean) => void;
  navigation: any;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ setLoggedInStatus, navigation }) => {
  const { t, i18n } = useTranslation();
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true});
  console.log(`Generated Redirect URI: ${redirectUri}`);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();

      // Save user info and token to AsyncStorage
      await AsyncStorage.setItem('userToken', JSON.stringify(token));
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));

      // Fetch and set user's preferred language
      const profileDetails = await getVisitorProfileDetails(userInfo);
      if (profileDetails.preferredLanguage) {
        i18n.changeLanguage(profileDetails.preferredLanguage);
      }

      setLoggedInStatus(true);
      navigation.navigate('RestaurantScreen');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image source={require('../../../../assets/Google.png')} style={styles.googleIcon} />
      </TouchableOpacity>
  );
};

export default GoogleLoginButton;
