import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import styles from './FeatureRequest.styles'
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';
import {useTranslation} from "react-i18next";

type FeatureRequestScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const initialRequestState = {
  name: '',
  subject: '',
  request: '',
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
