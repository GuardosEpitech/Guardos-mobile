import React, { useEffect } from 'react';
import { View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getVisitorProfileDetails } from '../../../services/profileCalls';
import {styles} from "./styles";
import {GoogleSignin, GoogleSigninButton} from "@react-native-google-signin/google-signin";
import {loginUser} from "../../../services/userCalls";

const GOOGLE_CLIENT_ID = '251768771069-7v10qin71ssbe5au77dt6at41s6cgglg.apps.googleusercontent.com';
const WEB_CLIENT_ID = '251768771069-9iate5ptc3pm51k380d2uamf3segvtf6.apps.googleusercontent.com';

type GoogleLoginButtonProps = {
  setLoggedInStatus: (status: boolean) => void;
  navigation: any;
};

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ setLoggedInStatus, navigation }) => {
  const { t, i18n } = useTranslation();
  const [error, setError] = React.useState<string | null>(null);
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      androidClientId: GOOGLE_CLIENT_ID,
      iosClientId: GOOGLE_CLIENT_ID,
    });
  };

  const signIn = async () => {
    try {
      console.log('Google Sign-In button pressed');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await handleGoogleLogin(userInfo);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setError(error);
    }
  }

  useEffect(() => {
    configureGoogleSignIn();
  });

  const handleGoogleLogin = async (userInfo: any) => {
    try {
      const dataStorage = JSON.stringify({
        username: userInfo.user.email,
        password: userInfo.user.id,
      });
      console.log('Data storage:', dataStorage)
      const response = await loginUser(dataStorage);
      if (response.data === 'Invalid Access') {
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userName');
      } else {
        getVisitorProfileDetails(response.data)
            .then((res) => {
              if (res.preferredLanguage) {
                i18n.changeLanguage(res.preferredLanguage);
              }
            });
        await AsyncStorage.setItem('userToken', JSON.stringify('isSet'));
        await AsyncStorage.setItem('user', response.data);
        setLoggedInStatus(true);
        navigation.navigate('RestaurantScreen');
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
      <View>
        <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={signIn}
        />
      </View>
  );
};

export default GoogleLoginButton;