import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from './Login.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loginUser} from "../../../services/userCalls";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorForm, setErrorForm] = useState(false);

  const handleSubmit = async () => {
    try {
      const userName = username;
      const dataStorage = JSON.stringify({
        username: username,
        password: password
      });
      await AsyncStorage.setItem('userName', userName);
      const response = await loginUser(dataStorage);

      if (response === 'Invalid Access') {
        setErrorForm(true);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userName');
      } else {
        setErrorForm(false);
        await AsyncStorage.setItem('userToken', JSON.stringify('isSet'));
        setLoggedInStatus(true);
        navigation.navigate('RestaurantScreen');
      }
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {errorForm && <Text style={styles.errorText}>Invalid Logindata</Text>}
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerInfo}>
          Don't you have an account yet? Register yourself{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            here
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;