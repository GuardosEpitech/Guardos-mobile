import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import styles from './FeatureRequest.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';
import {useTranslation} from "react-i18next";
import { getRestoUserPermission } from '../../services/permissionsCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";

type FeatureRequestScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const initialRequestState = {
  name: '',
  subject: '',
  request: '',
  isPremium: 'false',
}

const FeatureRequest: React.FC<FeatureRequestScreenProps> = () => {
  const [request, setRequest] = useState<IRequestUser>(initialRequestState);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const {t} = useTranslation();
  const [fieldRequire, setFieldRequire] = useState<boolean>(true);
  const [requestSend, setRequestSend] = useState<boolean>(false);

    const handleInputChange = (field: keyof IRequestUser, text: string) => {
      setRequest(prevState => ({
        ...prevState,
      [field]: text,
      }));
    };

    const getPremium = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const permissions = await getRestoUserPermission(userToken);
        const isPremiumUser = permissions.includes('premiumUser');
        if (isPremiumUser) {
          handleInputChange('isPremium', 'true');
        } else {
          handleInputChange('isPremium', 'false');
        }
      } catch (error) {
        console.error("Error getting permissions: ", error);
      }
    }

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
      try {
        getPremium();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      fetchDarkMode();
    }, []);
  
    const handleButtonPress = () => {
      if (request.name.trim() === '' || request.request.trim() === "" || request.subject.trim() === '') {
        setFieldRequire(false)
        setRequestSend(false)
      } else {
        handleInputChange('name', '')
        handleInputChange('subject', '')
        handleInputChange('request', '')
        setRequestSend(true)
        setFieldRequire(true)
        sendFeatureRequest(request)
      }
    };

    return (
      <View style={darkMode ? styles.containerDark : styles.container}>
        <TextInput
          style={darkMode ? styles.smallInputDark : styles.smallInput}
          placeholder={t('pages.FeatureRequest.name') as string}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => handleInputChange('name', text)}
          value={request.name}
        />
        <TextInput
          style={darkMode ? styles.smallInputDark : styles.smallInput}
          placeholder={t('pages.FeatureRequest.subject') as string}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => handleInputChange('subject', text)}
          value={request.subject}
        />
        <TextInput
          style={darkMode ? styles.mainInputDark : styles.mainInput}
          placeholder={t('pages.FeatureRequest.request') as string}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => handleInputChange('request', text)}
          value={request.request}
        />
        { !fieldRequire ?
          <Text style={{color: "red"}}>{t('pages.FeatureRequest.require')}</Text>
            :
            <Text />
        }

        { requestSend ?
            <Text style={{color: "green"}}>{t('pages.FeatureRequest.thanks')}</Text>
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
export default FeatureRequest;
