import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import styles from './UserSupport.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendUserSupport } from '../../services/emailCalls';
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

const UserSupport: React.FC<FeatureRequestScreenProps> = () => {
  const [request, setRequest] = useState<IRequestUser>(initialRequestState);
  const {t} = useTranslation();

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

    useEffect(() => {
      try {
        getPremium();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }, []);
  
    const handleButtonPress = () => {
      sendUserSupport(request)
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.smallInput}
          placeholder={t('pages.UserSupport.name') as string}
          onChangeText={(text) => handleInputChange('name', text)}
          value={request.name}
        />
        <TextInput
          style={styles.smallInput}
          placeholder={t('pages.UserSupport.subject') as string}
          onChangeText={(text) => handleInputChange('subject', text)}
          value={request.subject}
        />
        <TextInput
          style={styles.mainInput}
          placeholder={t('pages.UserSupport.Issue') as string}
          onChangeText={(text) => handleInputChange('request', text)}
          value={request.request}
        />
        <Button
          title={t('common.submit') as string}
          onPress={handleButtonPress}
        />
      </View>
    );
  };
export default UserSupport;
