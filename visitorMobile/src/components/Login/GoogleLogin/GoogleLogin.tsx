import React, { useEffect } from 'react';
import {Button, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getVisitorProfileDetails } from '../../../services/profileCalls';
import {styles} from "./styles";
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
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

  const redirectUri = 'https://auth.expo.dev/@marcpister/visitorMobile';
  console.log('Redirect URI:', redirectUri);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: WEB_CLIENT_ID,
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Auth Success:', authentication);
      handleGoogleLogin(authentication).then();
    }
  }, [response]);

  const handleGoogleLogin = async (userInfo: any) => {
    try {
      const dataStorage = JSON.stringify({
        username: userInfo.user.email,
        password: userInfo.user.id,
      });
      console.log('Data storage:', dataStorage)
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
      console.error('Error logging in with Google:', error);
    }
  };

  return (
      <View>
        <Button title="Sign in with Google" onPress={() => promptAsync()} />
      </View>
  );
};

export default GoogleLoginButton;
