import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import styles from './FeatureRequest.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';
import {useTranslation} from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

type FeatureRequestScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const initialRequestState = {
  name: '',
  subject: '',
  request: '',
}

const FeatureRequest: React.FC<FeatureRequestScreenProps> = ({navigation}) => {
    const [request, setRequest] = useState<IRequestUser>(initialRequestState);
    const {t} = useTranslation();
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
      fetchDarkMode();  
    })


    const handleInputChange = (field: keyof IRequestUser, text: string) => {
      setRequest(prevState => ({
        ...prevState,
      [field]: text,
      }));
    };
  
    const handleButtonPress = () => {
      sendFeatureRequest(request)
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
        <Button title={t('common.submit')} onPress={handleButtonPress} />
      </View>
    );
  };
export default FeatureRequest;
