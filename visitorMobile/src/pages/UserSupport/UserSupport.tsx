import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import styles from './UserSupport.styles';
import { IRequestUser } from '../../models/emailInterfaces';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendUserSupport } from '../../services/emailCalls';
import { useTranslation } from 'react-i18next';
import { getVisitorUserPermission } from '../../services/permissionsCalls';
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
  const { t } = useTranslation();

  const handleInputChange = (field: keyof IRequestUser, text: string) => {
    setRequest((prevState) => ({
      ...prevState,
      [field]: text,
    }));
  };

  const getPremium = async () => {
    try {
      const userToken = await AsyncStorage.getItem('user');
      const permissions = await getVisitorUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      handleInputChange('isPremium', isPremiumUser ? 'true' : 'false');
    } catch (error) {
      console.error('Error getting permissions: ', error);
    }
  };

  useEffect(() => {
    getPremium();
  }, []);

  const handleButtonPress = async () => {
    try {
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
    } catch (error) {
      console.error('Error sending support request:', error);
    }
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
        placeholder={t('pages.UserSupport.issue') as string}
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
