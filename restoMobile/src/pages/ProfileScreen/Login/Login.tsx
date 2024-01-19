import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from './Login.styles';

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorForm, setErrorForm] = useState(false);

  const baseUrl = `http://localhost:8081/api/login/`;

  const handleSubmit = async () => {
    try {
      const dataStorage = JSON.stringify({
        username: username,
        password: password
      });

      const response = await axios.post(baseUrl, dataStorage, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data === 'Invalid Access') {
        setErrorForm(true);
        // Handle error accordingly for mobile (e.g., show error message)
      } else {
        setErrorForm(false);
        // Navigate to the next screen upon successful login
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
