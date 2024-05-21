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
            <Text>{t('common.english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('de');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>{t('common.german')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('fr');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>{t('common.french')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.header}>{t('pages.Profile.register')}</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('pages.Profile.username') as string}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        {errorUsername && (
          <Text style={styles.errorText}>{t('pages.Profile.username-taken-or-invalid')}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={t('pages.Profile.email') as string}
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {errorEmail && (
          <Text style={styles.errorText}>{t('pages.Profile.email-taken-or-invalid')}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={t('pages.Profile.password') as string}
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errorPassword && (
          <Text style={styles.errorText}>
            {t('pages.Profile.wrong-pw-format')}
          </Text>
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
          <Text style={styles.registerText}>{t('pages.Profile.register')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
