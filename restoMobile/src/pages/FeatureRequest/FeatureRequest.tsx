import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './FeatureRequest.styles'
import axios from 'axios';
import {IRequestUser} from '../../models/emailInterfaces'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { sendFeatureRequest } from '../../services/emailCalls';

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
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');

    const handleInputChange1 = (text) => {
      setInput1(text);
    };
  
    const handleInputChange2 = (text) => {
      setInput2(text);
    };
  
    const handleInputChange3 = (text) => {
      setInput3(text);
    };
  
    const handleButtonPress = () => {
      sendFeatureRequest(request)
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.smallInput}
          placeholder="Name"
          onChangeText={handleInputChange1}
          value={request.name}
        />
        <TextInput
          style={styles.smallInput}
          placeholder="Subject"
          onChangeText={handleInputChange2}
          value={request.subject}
        />
        <TextInput
          style={styles.mainInput}
          placeholder="Request"
          onChangeText={handleInputChange3}
          value={request.request}
        />
        <Button title="Submit" onPress={handleButtonPress} />
      </View>
    );
  };

export default FeatureRequest;