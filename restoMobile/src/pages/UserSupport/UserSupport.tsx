import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, Alert, Text} from 'react-native';
import styles from './UserSupport.styles';
import { IRequestUser } from '../../models/emailInterfaces';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendUserSupport } from '../../services/emailCalls';
import { useTranslation } from 'react-i18next';
import { getRestoUserPermission } from '../../services/permissionsCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FeatureRequestScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const initialRequestState: IRequestUser = {
  name: '',
  subject: '',
  request: '',
  isPremium: 'false',
};

const UserSupport: React.FC<FeatureRequestScreenProps> = ({ navigation }) => {
  const [request, setRequest] = useState<IRequestUser>(initialRequestState);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fieldRequire, setFieldRequire] = useState<boolean>(true);
  const { t } = useTranslation();

  const handleInputChange = (field: keyof IRequestUser, text: string) => {
    setRequest((prevState) => ({
      ...prevState,
      [field]: text,
    }));
  };

  const getPremium = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const permissions = await getRestoUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      handleInputChange('isPremium', isPremiumUser ? 'true' : 'false');
    } catch (error) {
      console.error('Error getting permissions: ', error);
    }
  };

  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  useEffect(() => {
    getPremium();
    fetchDarkMode();
  }, []);

  const handleButtonPress = async () => {
    try {
      if (request.name.trim() === '' || request.request.trim() === "" || request.subject.trim() === '') {
        setFieldRequire(false)
      } else {
        handleInputChange('name', '')
        handleInputChange('subject', '')
        handleInputChange('request', '')
        setFieldRequire(true)
        await sendUserSupport(request);

        Alert.alert(
          t('common.success') as string,
          t('pages.UserSupport.emailSent') as string,
          [
            {
              text: t('common.confirm') as string,
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error sending support request:', error);
    }
  };

  return (
    <View style={darkMode ? styles.containerDark : styles.container}>
      <TextInput
        style={darkMode ? styles.smallInputDark : styles.smallInput}
        placeholder={t('pages.UserSupport.name') as string}
        placeholderTextColor={darkMode ? 'white' : 'black'}
        onChangeText={(text) => handleInputChange('name', text)}
        value={request.name}
      />
      <TextInput
        style={darkMode ? styles.smallInputDark : styles.smallInput}
        placeholder={t('pages.UserSupport.subject') as string}
        placeholderTextColor={darkMode ? 'white' : 'black'}
        onChangeText={(text) => handleInputChange('subject', text)}
        value={request.subject}
      />
      <TextInput
        style={darkMode ? styles.mainInputDark : styles.mainInput}
        placeholder={t('pages.UserSupport.issue') as string}
        placeholderTextColor={darkMode ? 'white' : 'black'}
        onChangeText={(text) => handleInputChange('request', text)}
        value={request.request}
      />
      { !fieldRequire ?
        <Text style={{color: "red"}}>{t('pages.FeatureRequest.require')}</Text>
        :
        <Text />
      }
      <Button
        title={t('common.submit') as string}
        onPress={handleButtonPress}
      />
    </View>
  );
};

export default UserSupport;
