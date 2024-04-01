import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './Register.styles';
import {registerUser} from "../../../services/userCalls";
import {useTranslation} from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const {t, i18n} = useTranslation();

  function isValidPassword(password) {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    return (
      password.length >= 7 &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password)
    );
  }

  const handleSubmit = async () => {
    try {
      const dataStorage = JSON.stringify({
        username: username,
        password: password,
        email: email,
      });

      const validPassword = !isValidPassword(password);

      setErrorPassword(validPassword);
      setErrorEmail(!email);
      setErrorUsername(!username);

      if (validPassword || !email || !username) {
        return;
      }

      const response = await registerUser(dataStorage);

      setErrorEmail(response[0]);
      setErrorUsername(response[1]);

      if (!response.includes(true)) {
        navigation.navigate('Login');
      }
      return response;
    } catch (error) {
      console.error(`Error in post Route: ${error}`);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
      >
        <Ionicons name="language" size={24} color="black" />
      </TouchableOpacity>
      {showLanguageDropdown && (
        <View style={styles.languageDropdown}>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('en');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('de');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>German</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('fr');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>French</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.header}>{t('register')}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        {errorUsername && (
          <Text style={styles.errorText}>The desired Username exists already or is invalid</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errorEmail && (
          <Text style={styles.errorText}>An account already exists for the specified email or is invalid</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errorPassword && (
          <Text style={styles.errorText}>
            Your Password should contain minimum: 1x Uppercase and Lowercase Letter, 1x Number and minimum 7 Characters
          </Text>
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
