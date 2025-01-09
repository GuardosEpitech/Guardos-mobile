import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, Text, Alert} from 'react-native';
import styles from './FeatureRequest.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVisitorUserPermission } from '../../services/permissionsCalls';

type FeatureRequestScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const initialRequestState = {
  name: '',
  subject: '',
  request: '',
  isPremium: 'false',
}

const FeatureRequest: React.FC<FeatureRequestScreenProps> = ({navigation}) => {
    const [request, setRequest] = useState<IRequestUser>(initialRequestState);
    const {t} = useTranslation();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [fieldRequire, setFieldRequire] = useState<boolean>(true);

    const handleInputChange = (field: keyof IRequestUser, text: string) => {
      setRequest(prevState => ({
        ...prevState,
      [field]: text,
      }));
    };

    const getPremium = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const permissions = await getVisitorUserPermission(userToken);
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

    useEffect(() => {
      try {
        getPremium();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }, []);

    useEffect(() => {
      fetchDarkMode();  
    })


    const handleButtonPress = () => {
        if (request.name.trim() === '' || request.request.trim() === "" || request.subject.trim() === '') {
          setFieldRequire(false)
        } else {
          handleInputChange('name', '')
          handleInputChange('subject', '')
          handleInputChange('request', '')
          setFieldRequire(true)
          sendFeatureRequest(request)

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

    return (
      <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
        <TextInput
          style={[styles.smallInput, darkMode && styles.smallInputDarkTheme]}
          placeholder={t('pages.FeatureRequest.name') as string}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => handleInputChange('name', text)}
          value={request.name}
        />
        <TextInput
          style={[styles.smallInput, darkMode && styles.smallInputDarkTheme]}
          placeholder={t('pages.FeatureRequest.subject') as string}
          placeholderTextColor={darkMode ? 'white' : 'black'}
          onChangeText={(text) => handleInputChange('subject', text)}
          value={request.subject}
        />
        <TextInput
          style={[styles.mainInput, darkMode && styles.mainInputDarkTheme]}
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
        <Button title={t('common.submit')} onPress={handleButtonPress} />
      </View>
    );
  };
export default FeatureRequest;
