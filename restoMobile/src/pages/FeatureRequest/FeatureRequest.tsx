import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
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
      sendFeatureRequest(request)
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.smallInput}
          placeholder={t('pages.FeatureRequest.name') as string}
          onChangeText={(text) => handleInputChange('name', text)}
          value={request.name}
        />
        <TextInput
          style={styles.smallInput}
          placeholder={t('pages.FeatureRequest.subject') as string}
          onChangeText={(text) => handleInputChange('subject', text)}
          value={request.subject}
        />
        <TextInput
          style={styles.mainInput}
          placeholder={t('pages.FeatureRequest.request') as string}
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
export default FeatureRequest;
