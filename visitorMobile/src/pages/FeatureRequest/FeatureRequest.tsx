import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './FeatureRequest.styles'
import axios from 'axios';
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/featureRequest`;
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
          placeholder="Name"
          onChangeText={(text) => handleInputChange('name', text)}
          value={request.name}
        />
        <TextInput
          style={styles.smallInput}
          placeholder="Subject"
          onChangeText={(text) => handleInputChange('subject', text)}
          value={request.subject}
        />
        <TextInput
          style={styles.mainInput}
          placeholder="Request"
          onChangeText={(text) => handleInputChange('request', text)}
          value={request.request}
        />
        <Button title="Submit" onPress={handleButtonPress} />
      </View>
    );
  };
export default FeatureRequest;