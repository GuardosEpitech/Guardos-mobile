import React, { useEffect } from 'react';
import { TouchableOpacity, View, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getVisitorProfileDetails } from '../../../services/profileCalls';
import { loginUser } from '../../../services/userCalls';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import {styles} from './styles';

type FacebookLoginButtonProps = {
  setLoggedInStatus: (status: boolean) => void;
  navigation: any;
};

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ setLoggedInStatus, navigation }) => {
  const { t, i18n } = useTranslation();

  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        return;
      }

      const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${data.accessToken}&fields=id,name,email`
      );
      const userInfo = await userInfoResponse.json();
      await handleFacebookLogin(userInfo);
    } catch (error) {
      console.error('Facebook Login Error:', error);
      Alert.alert(t('pages.Profile.error-login-facebook'));
    }
  };

  const handleFacebookLogin = async (userInfo: any) => {
    try {
      const dataStorage = JSON.stringify({
        username: userInfo.email,
        password: userInfo.id,
      });

      const response = await loginUser(dataStorage);
      if (response.data === 'Invalid Access') {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userName');
      } else {
        const profileDetails = await getVisitorProfileDetails(response.data);
        if (profileDetails.preferredLanguage) {
          i18n.changeLanguage(profileDetails.preferredLanguage);
        }
        await AsyncStorage.setItem('userToken', JSON.stringify('isSet'));
        await AsyncStorage.setItem('user', response.data);
        setLoggedInStatus(true);
        navigation.navigate('RestaurantScreen');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
      <View>
        <TouchableOpacity onPress={signInWithFacebook}>
          <Image source={require('../../../../assets/Facebook.png')} style={styles.googleIcon} />
        </TouchableOpacity>
      </View>
  );
};

export default FacebookLoginButton;
